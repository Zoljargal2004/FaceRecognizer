import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("fitness");

    const foundUser = await db.collection("users").findOne({ email });
    if (!foundUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const status = await db.collection("attendance").findOne(
      { email, createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { sort: { createdAt: -1 } } // newest first
    );

    // ✅ CASE 1: No record yet → create new
    if (!status) {
      await db.collection("attendance").insertOne({
        email,
        createdAt: new Date(),
        leftAt: null,
      });

      return NextResponse.json(
        { message: "Checked in successfully", email },
        { status: 200 }
      );
    }

    // 🚫 CASE 2: Already checked in (no leftAt yet)
    if (status && !status.leftAt) {
      return NextResponse.json(
        { message: "Already checked in today", email },
        { status: 200 }
      );
    }

    // ✅ CASE 3: Checked out previously (leftAt exists)
    if (status && status.leftAt) {
      await db.collection("attendance").insertOne({
        email,
        createdAt: new Date(),
        leftAt: null,
      });

      return NextResponse.json(
        { message: "Checked in again (new session)", email },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("fitness");

    const user = await db.collection("users").findOne({ email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get today's attendance
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayRecord = await db.collection("attendance").findOne({
      email,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!todayRecord) {
      return NextResponse.json(
        { message: "No check-in found for today" },
        { status: 404 }
      );
    }

    if (todayRecord.leftAt) {
      return NextResponse.json(
        { message: "Already checked out today" },
        { status: 200 }
      );
    }

    await db
      .collection("attendance")
      .updateOne({ _id: todayRecord._id }, { $set: { leftAt: new Date() } });

    return NextResponse.json(
      { message: "Check-out successful" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
