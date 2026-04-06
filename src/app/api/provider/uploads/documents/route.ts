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
      return apiError("Only providers can upload verification documents.", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const documentType = String(formData.get("documentType") || "verification_document");

    if (!(file instanceof File)) {
      return apiError("A verification document file is required.", 422);
    }

    const uploaded = await saveUploadedFile("provider-documents", file, user.id);

    return NextResponse.json({
      asset: {
        type: documentType,
        fileName: uploaded.fileName,
        fileUrl: uploaded.fileUrl,
        contentType: uploaded.contentType,
        size: uploaded.size,
      },
    });
  } catch (error) {
    console.error("Provider document upload error:", error);
    return apiError("Unable to upload the verification document right now.", 500);
  }
}
