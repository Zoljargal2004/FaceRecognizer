import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    // 1️⃣ Get and verify token
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

    // 2️⃣ Connect to DB
    const client = await clientPromise;
    const db = client.db("fitness");

    // 3️⃣ Get Monday → Sunday of this week
    const now = new Date();
    const currentDay = now.getDay(); // Sunday = 0
    const distanceToMonday = (currentDay + 6) % 7; // shift Monday = 0

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // 4️⃣ Get this week's attendance records for that user
    const records = await db
      .collection("attendance")
      .find({
        email,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        leftAt: { $ne: null }, // must have left
      })
      .toArray();

    if (!records.length) {
      return NextResponse.json({
        email,
        averageMinutes: 0,
        sessions: 0,
      });
    }

    // 5️⃣ Calculate average session duration
    let totalMinutes = 0;
    for (const r of records) {
      const durationMs = new Date(r.leftAt) - new Date(r.createdAt);
      const durationMin = Math.max(durationMs / 60000, 0);
      totalMinutes += durationMin;
    }

    const averageMinutes = totalMinutes / records.length;

    // 6️⃣ Return JSON response
    return NextResponse.json({
      email,
      averageMinutes: Math.round(averageMinutes),
    });
  } catch (err) {
    console.error("Weekly average session error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
