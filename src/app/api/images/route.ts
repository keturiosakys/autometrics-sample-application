import { NextRequest, NextResponse } from "next/server";
import * as dateFns from "date-fns";
import { mkdir, stat, writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const uploadDir = `./public/uploads/${dateFns.format(
    new Date(),
    "yyyy-MM-dd",
  )}`;

  try {
    await stat(uploadDir);
  } catch (e: unknown) {
    if (e instanceof Error && e.stack?.includes("ENOENT")) {
      await mkdir(uploadDir, { recursive: true });
    } else {
      return NextResponse.json(
        { error: "Error creating upload directory" },
        { status: 500 },
      );
    }
  }

  const fileName = `${Math.random().toString(36).substring(2, 15)}.${file.name
    .split(".")
    .pop()}`;

  const filePath = `${uploadDir}/${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    await writeFile(filePath, fileBuffer);
		const retFilePath = filePath.slice(8); // remove ./public from path before returning 
    return NextResponse.json({ retFilePath }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error writing file" }, { status: 500 });
  }
}
