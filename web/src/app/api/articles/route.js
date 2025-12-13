import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("fitness");
    const articles = db.collection("articles");

    const articlesList = await articles
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ articles: articlesList });
  } catch (err) {
    console.error("Error fetching articles:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

