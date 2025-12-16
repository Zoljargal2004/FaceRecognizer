import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1️⃣ Read HttpOnly cookie (server-only)
    const token = (await cookies()).get("bearer")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
      role?: string;
    };

    // 3️⃣ (Optional but recommended) Load fresh user from DB
    const client = await clientPromise;
    const db = client.db("fitness");

    const user = await db.collection("users").findOne(
      { _id: new (require("mongodb").ObjectId)(decoded.id) },
      {
        projection: {
          password: 0, // 🚫 never return password
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // 4️⃣ Return safe user object
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    // Token expired / invalid
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("bearer")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name, password } = await req.json();
    if (!name && !password) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const users = db.collection("users");

    const update: any = {};
    if (name) update.name = name;
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    update.updatedAt = new Date();

    const result = await users.updateOne(
      { _id: new (require("mongodb").ObjectId)(decoded.id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const token = (await cookies()).get("bearer")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const users = db.collection("users");

    const result = await users.deleteOne({
      _id: new (require("mongodb").ObjectId)(decoded.id),
    });

    const response = NextResponse.json(
      { message: "User deleted" },
      { status: result.deletedCount ? 200 : 404 }
    );
    response.cookies.set({
      name: "bearer",
      value: "",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
