import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { connectToDatabase } from "@/lib/mongodb";
import Document from "@/models/Document";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error("Failed to upload to Supabase: " + error.message);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    if (!publicUrlData.publicUrl) {
      throw new Error("Failed to retrieve file URL from Supabase");
    }

    const newDocument = await Document.create({
      name,
      description,
      expiryDate: new Date(expiryDate),
      fileUrl: publicUrlData.publicUrl,
    });

    return NextResponse.json({ message: "File uploaded successfully", document: newDocument }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file", details: error.message }, { status: 500 });
  }
}
