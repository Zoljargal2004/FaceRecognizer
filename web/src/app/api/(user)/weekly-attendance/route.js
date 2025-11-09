import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    // 1️⃣ Decode JWT from cookies (get user's email)
    const cookieStore = await cookies();
    const token = await cookieStore.get("bearer")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const email = decoded.email;
    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // 2️⃣ Setup DB
    const client = await clientPromise;
    const db = client.db("fitness");

    // 3️⃣ Calculate this week’s start (Monday) and end (Sunday)
    const now = new Date();
    const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ...
    const distanceToMonday = (currentDay + 6) % 7; // how many days since Monday

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // 4️⃣ Fetch attendance for this week
    const records = await db
      .collection("attendance")
      .find({
        email,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      })
      .toArray();

    // 5️⃣ Days in Mongolian (starting from Monday)
    const daysMn = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
    const weekly = daysMn.map((day) => ({ day, minutes: 0 }));

    // 6️⃣ Calculate total minutes per day
    for (const r of records) {
      const recordDate = new Date(r.createdAt);
      const dayIndex = (recordDate.getDay() + 6) % 7; // shift so Monday = 0
      const endTime = r.leftAt ? new Date(r.leftAt) : new Date();
      const diffMs = endTime - recordDate;
      const diffMinutes = Math.max(diffMs / 60000, 0);
      weekly[dayIndex].minutes += Math.round(diffMinutes);
    }

    // 7️⃣ Respond
    return NextResponse.json({ email, weekly });
  } catch (err) {
    console.error("Weekly attendance error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
