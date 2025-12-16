import { sendEmail } from "@/lib/emailer";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req :Request) {
  try {
    const { email } = await req.json();

    const client = await clientPromise;
    const db = client.db("fitness");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    await db.collection("Token").insertOne({
      email,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const resetUrl = `http://face-recognizer-lyart.vercel.app/change-password/${token}`;

    const res = await sendEmail(
      `<div>
     <p>Click the link below to reset your password:</p>
     <a href="${resetUrl}">Reset password</a>
   </div>`,
      email
    );

    if (!res) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "email sent", token });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const {token, password} = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Expired token" },
        { status: 403 }
      );
    }

    const { email } = decoded as { email: string };

    const client = await clientPromise;
    const db = client.db("fitness");

    const savedToken = await db.collection("Token").findOne({ email, token });
    if (token != savedToken.token) {

      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .collection("users")
      .updateOne({ email }, { $set: { password: hashedPassword } });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
