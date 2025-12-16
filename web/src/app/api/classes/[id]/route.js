import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const clazz = await db
      .collection("classes")
      .findOne({ _id: new ObjectId(id) });

    if (!clazz) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ class: clazz });
  } catch (err) {
    console.error("Error fetching class:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Enroll / unenroll (per-user) – requires auth, capacity enforced
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Require logged-in user
    const token = (await cookies()).get("bearer")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id || decoded._id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { action } = await req.json();
    if (!["enroll", "unenroll"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be enroll or unenroll" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const classes = db.collection("classes");

    const clazz = await classes.findOne({ _id: new ObjectId(id) });
    if (!clazz) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const enrolledUsers = clazz.enrolledUsers || [];
    const isAlreadyEnrolled = enrolledUsers.some(
      (uid) => uid?.toString() === userId.toString()
    );

    let newEnrolled = enrolledUsers.length;
    if (action === "enroll") {
      if (isAlreadyEnrolled) {
        return NextResponse.json(
          { error: "Already enrolled" },
          { status: 400 }
        );
      }
      if (newEnrolled >= clazz.capacity) {
        return NextResponse.json(
          { error: "Class is full" },
          { status: 400 }
        );
      }
      enrolledUsers.push(userId.toString());
      newEnrolled = enrolledUsers.length;
    } else {
      if (!isAlreadyEnrolled) {
        return NextResponse.json(
          { error: "Not enrolled" },
          { status: 400 }
        );
      }
      const filtered = enrolledUsers.filter(
        (uid) => uid?.toString() !== userId.toString()
      );
      newEnrolled = filtered.length;
      clazz.enrolledUsers = filtered;
    }

    await classes.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          enrolled: newEnrolled,
          enrolledUsers:
            action === "enroll" ? enrolledUsers : clazz.enrolledUsers,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "OK",
      enrolled: newEnrolled,
      enrolledUsers: action === "enroll" ? enrolledUsers : clazz.enrolledUsers,
    });
  } catch (err) {
    console.error("Error updating enrollment:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    const { name, instructor, schedule, capacity, description, location, duration } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (instructor !== undefined) update.instructor = instructor;
    if (schedule !== undefined) update.schedule = schedule;
    if (description !== undefined) update.description = description;
    if (location !== undefined) update.location = location;
    if (duration !== undefined) update.duration = duration;
    if (capacity !== undefined) {
      const numericCapacity = Number(capacity);
      if (Number.isNaN(numericCapacity) || numericCapacity <= 0) {
        return NextResponse.json(
          { error: "Capacity must be a positive number" },
          { status: 400 }
        );
      }
      update.capacity = numericCapacity;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    update.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db("fitness");
    const result = await db
      .collection("classes")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Class updated successfully" });
  } catch (err) {
    console.error("Error updating class:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const result = await db
      .collection("classes")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("Error deleting class:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

