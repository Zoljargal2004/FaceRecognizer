import { sendEmail } from "@/lib/emailer";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const client = await clientPromise;
    const db = client.db("fitness");

    const user = await db.collection("users").findOne({ email });
    const otp_doc = await db.collection("OTP").findOne({ email, otp });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!otp_doc) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }
    const createdAt = new Date(otp_doc.createdAt);
    const expiry = new Date(createdAt.getTime() + 3 * 60 * 1000);

    if (expiry < new Date()) {
      await db.collection("OTP").deleteOne({ email, otp });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await db.collection("OTP").deleteOne({ email, otp });

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    await db.collection("Token").insertOne({
      email,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    return NextResponse.json({ message: "OTP verified", token });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[0];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const { email } = decoded as { email: string };
    const { name, password, bio } = await req.json();

    const client = await clientPromise;
    const db = client.db("fitness");

    const savedToken = await db.collection("Token").findOne({ email, token });
    if (token != savedToken.token) {
      console.log(savedToken);

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
    console.error("Edit profile error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
