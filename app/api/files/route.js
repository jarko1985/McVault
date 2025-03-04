import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectToDatabase();
    const documents = await Document.find().sort({ createdAt: -1 });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}