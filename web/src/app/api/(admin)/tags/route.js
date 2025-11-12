import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("fitness");

    const tags = await db.collection("tags").find().toArray();

    return NextResponse.json({ tags });
  } catch (err) {
    console.error("Getting tag error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
