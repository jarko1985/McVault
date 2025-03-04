import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";
import fs from "fs";
import path from "path";

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  try {
    const responseHeaders = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name");
    const description = formData.get("description");
    const expiryDate = formData.get("expiryDate");

    if (!file || !name || !description || !expiryDate) {
      return new NextResponse(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: responseHeaders,
      });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define upload path
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Store metadata in MongoDB
    const newDocument = await Document.create({
      name,
      description,
      expiryDate: new Date(expiryDate),
      fileUrl: `/uploads/${file.name}`,
    });

    return NextResponse.json({ message: "File uploaded successfully", document: newDocument }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
