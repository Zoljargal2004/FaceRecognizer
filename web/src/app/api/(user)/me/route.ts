import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

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
