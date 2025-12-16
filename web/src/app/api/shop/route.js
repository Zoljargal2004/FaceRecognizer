import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("fitness");
    const items = await db
      .collection("shop_items")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Shop list error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { name, price, amount, imageData } = await req.json();

    if (!name || price === undefined || amount === undefined) {
      return NextResponse.json(
        { error: "Name, price, and amount are required" },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    const numAmount = Number(amount);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        { error: "Price must be a non-negative number" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(numAmount) || numAmount < 0) {
      return NextResponse.json(
        { error: "Amount must be a non-negative integer" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (imageData && imageData.startsWith("data:")) {
      const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json(
          { error: "Invalid image data" },
          { status: 400 }
        );
      }
      const mime = match[1];
      const base64 = match[2];
      const ext = mime.split("/")[1] || "png";
      const filename = `shop-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), Buffer.from(base64, "base64"));
      imageUrl = `/uploads/${filename}`;
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const result = await db.collection("shop_items").insertOne({
      name,
      price: numPrice,
      amount: numAmount,
      imageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Item created", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create item error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

