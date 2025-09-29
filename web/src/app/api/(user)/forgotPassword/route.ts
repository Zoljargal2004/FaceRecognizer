import { sendEmail } from "@/lib/emailer";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const client = await clientPromise;
    const db = client.db("fitness");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const old_OTP = await db
      .collection("OTP")
      .findOne({ email }, { sort: { createdAt: -1 } });

    if (old_OTP) {
      const lastCreated = new Date(old_OTP.createdAt);
      const nextAllowed = new Date(lastCreated.getTime() + 10 * 60 * 1000); // 10 min later

      if (nextAllowed > new Date()) {
        const waitMinutes = Math.ceil(
          (nextAllowed.getTime() - Date.now()) / 60000
        );
        return NextResponse.json(
          {
            error: `Please wait ${waitMinutes} minute(s) before requesting a new OTP`,
            allow: nextAllowed
          },
          { status: 429 }
        ); // 429 = Too Many Requests
      }
    }

    const number = Math.floor(Math.random() * 9000 + 1000);
    const res = await sendEmail(`OTP: ${number}`, email);

    if (!res) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    await db.collection("OTP").insertOne({
      email,
      otp: number,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
