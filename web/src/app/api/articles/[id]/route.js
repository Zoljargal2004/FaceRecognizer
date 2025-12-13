import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } =await params;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const articles = db.collection("articles");

    const article = await articles.findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (err) {
    console.error("Error fetching article:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

