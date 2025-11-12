export async function POST(req) {
  try {
    const { code, tags } = await req.json();

    if (!tags && !tags.length && !code) {
      throw new Error("Missing input");
    }

    const client = await clientPromise;
    const db = client.db("fitness");
    const articles = db.collection("articles");

    await articles.insertOne({
      code,
      tags,
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
