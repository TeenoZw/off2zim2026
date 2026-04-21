import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiError("No file provided.", 400);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError("Only JPEG, PNG, WebP, and GIF images are allowed.", 415);
    }
    if (file.size > MAX_SIZE) {
      return apiError("Image must be under 5 MB.", 413);
    }

    const result = await saveUploadedFile("avatars", file, user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { image: result.fileUrl },
    });

    return NextResponse.json({ url: result.fileUrl });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Unable to upload avatar.", 500);
  }
}
