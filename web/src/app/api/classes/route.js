import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const requireAdmin = async () => {
  const token = (await cookies()).get("bearer")?.value;
  if (!token) return { ok: false, status: 401, error: "Unauthorized" };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return { ok: false, status: 403, error: "Admin access required" };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, status: 401, error: "Invalid token" };
  }
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fitness");
    const classes = await db
      .collection("classes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ classes });
  } catch (err) {
    console.error("Error fetching classes:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { name, instructor, schedule, capacity, description, location, duration } =
      await req.json();

    if (!name || !instructor || !schedule || !capacity) {
      return NextResponse.json(
        { error: "Name, instructor, schedule, and capacity are required" },
        { status: 400 }
      );
    }

    const numericCapacity = Number(capacity);
    if (Number.isNaN(numericCapacity) || numericCapacity <= 0) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const classes = db.collection("classes");

    const result = await classes.insertOne({
      name,
      instructor,
      schedule,
      capacity: numericCapacity,
      enrolled: 0,
      enrolledUsers: [],
      description: description || "",
      location: location || "",
      duration: duration || "",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Class created", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating class:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

