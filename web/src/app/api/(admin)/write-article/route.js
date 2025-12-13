import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, tags, title } = await req.json();

    if ((!tags || !tags.length) && !code && !title) {
      return NextResponse.json(
        { error: "Missing required fields: title, code, and tags" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const articles = db.collection("articles");

    await articles.insertOne({
      title: title || "Untitled",
      code,
      tags: tags || [],
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Article created successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
