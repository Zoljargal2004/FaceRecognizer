import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

export async function DELETE(req, { params }) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const items = db.collection("shop_items");

    const item = await items.findOne({ _id: new ObjectId(id) });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const result = await items.deleteOne({ _id: new ObjectId(id) });

    if (item.imageUrl && item.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(item.imageUrl));
      try {
        await fs.unlink(filePath);
      } catch (err) {
        // file might already be gone; log and continue
        console.warn("Image delete warning:", err?.message);
      }
    }

    return NextResponse.json(
      { message: "Item deleted", deletedCount: result.deletedCount },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete item error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

