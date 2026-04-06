import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    if (user.role !== "provider") {
      return apiError("Only providers can upload listing media.", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const contentType = String(formData.get("contentType") || "listing");
    const contentId = String(formData.get("contentId") || user.id);

    if (!(file instanceof File)) {
      return apiError("A content image file is required.", 422);
    }

    const uploaded = await saveUploadedFile(
      "provider-content",
      file,
      `${contentType}-${contentId}`
    );

    return NextResponse.json({
      asset: {
        fileName: uploaded.fileName,
        fileUrl: uploaded.fileUrl,
        contentType: uploaded.contentType,
        size: uploaded.size,
      },
    });
  } catch (error) {
    console.error("Provider content upload error:", error);
    return apiError("Unable to upload the content image right now.", 500);
  }
}
