import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { getSessionTokenFromHeaders, getUserBySessionToken } from "@/lib/auth";
import { inferMimeType, readStoredUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireDocumentAccess(relativePath: string, request: NextRequest) {
  const sessionToken = await getSessionTokenFromHeaders();
  if (!sessionToken) {
    return false;
  }

  const user = await getUserBySessionToken(sessionToken);
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  const fileUrl = new URL(request.url).pathname;
  const document = await prisma.providerDocument.findFirst({
    where: {
      fileUrl,
      company: {
        ownerUserId: user.id,
      },
    },
    select: { id: true },
  });

  return Boolean(document && relativePath.startsWith("provider-documents/"));
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { bucket: string; segments: string[] };
  }
) {
  try {
    const relativePath = [params.bucket, ...(params.segments || [])].join("/");

    if (params.bucket === "provider-documents") {
      const allowed = await requireDocumentAccess(relativePath, request);
      if (!allowed) {
        return apiError("Unauthorized", 401);
      }
    }

    const { absolutePath, data } = await readStoredUpload(relativePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": inferMimeType(absolutePath),
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    return apiError("File not found.", 404);
  }
}
