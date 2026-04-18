import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/http";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — public list of forum questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get("destinationId") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const search = searchParams.get("q") ?? undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const cursor = searchParams.get("cursor") ?? undefined;

    const questions = await prisma.forumQuestion.findMany({
      where: {
        isRemoved: false,
        ...(destinationId ? { destinationId } : {}),
        ...(tag
          ? { tags: { contains: tag } }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { body: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, name: true, image: true, role: true },
        },
        _count: { select: { answers: { where: { isRemoved: false } } } },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const nextCursor =
      questions.length === limit ? questions[questions.length - 1]?.id : null;

    return NextResponse.json({
      questions: questions.map(serializeQuestion),
      nextCursor,
    });
  } catch (error) {
    console.error("Forum questions error:", error);
    return apiError("Unable to load questions.", 500);
  }
}

const createQuestionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  body: z.string().min(20, "Question must be at least 20 characters."),
  tags: z.array(z.string()).max(5).default([]),
  destinationId: z.string().optional(),
});

// POST — authenticated user creates a question
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireSessionUser();
    const payload = createQuestionSchema.parse(await request.json());

    const question = await prisma.forumQuestion.create({
      data: {
        authorId: user.id,
        title: payload.title,
        body: payload.body,
        tags: JSON.stringify(payload.tags),
        destinationId: payload.destinationId ?? null,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, name: true, image: true, role: true },
        },
        _count: { select: { answers: { where: { isRemoved: false } } } },
      },
    });

    return NextResponse.json({ question: serializeQuestion(question) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid question.", 422);
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    console.error("Create forum question error:", error);
    return apiError("Unable to post question.", 500);
  }
}

export function serializeQuestion(question: {
  id: string;
  authorId: string;
  title: string;
  body: string;
  tags: string;
  destinationId: string | null;
  viewCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; firstName: string | null; lastName: string | null; name: string | null; image: string | null; role: string };
  _count: { answers: number };
}) {
  return {
    id: question.id,
    title: question.title,
    body: question.body,
    tags: safeJsonParse<string[]>(question.tags, []),
    destinationId: question.destinationId,
    viewCount: question.viewCount,
    isPinned: question.isPinned,
    answerCount: question._count.answers,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
    author: {
      id: question.author.id,
      name:
        [question.author.firstName, question.author.lastName].filter(Boolean).join(" ").trim() ||
        question.author.name ||
        "Explorer",
      avatarUrl: question.author.image,
      isGuide: question.author.role === "guide",
    },
  };
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
