"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, ThumbsUp } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import { useAuth } from "@/contexts/AuthContext";

interface ForumAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  isGuide: boolean;
}

interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  tags: string[];
  viewCount: number;
  isPinned: boolean;
  answerCount: number;
  createdAt: string;
  author: ForumAuthor;
}

interface ForumAnswer {
  id: string;
  questionId: string;
  body: string;
  isGuideAnswer: boolean;
  upvoteCount: number;
  createdAt: string;
  author: ForumAuthor;
}

export default function AskALocalThreadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<ForumQuestion | null>(null);
  const [answers, setAnswers] = useState<ForumAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerBody, setAnswerBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [upvoting, setUpvoting] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ question: ForumQuestion; answers: ForumAnswer[] }>(`/api/forum/questions/${id}`)
      .then((payload) => {
        setQuestion(payload.question);
        setAnswers(payload.answers);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load question."))
      .finally(() => setLoading(false));
  }, [id]);

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) return;
    setSubmitting(true);
    setAnswerError("");
    try {
      const payload = await apiFetch<{ answer: ForumAnswer }>(
        `/api/forum/questions/${id}/answers`,
        { method: "POST", body: JSON.stringify({ body: answerBody }) }
      );
      setAnswers((prev) => [...prev, payload.answer]);
      setAnswerBody("");
    } catch (err) {
      setAnswerError(err instanceof Error ? err.message : "Unable to post answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUpvote = async (answerId: string) => {
    if (!user || upvoting) return;
    setUpvoting(answerId);
    try {
      const payload = await apiFetch<{ upvoted: boolean }>(
        `/api/forum/answers/${answerId}/upvote`,
        { method: "POST" }
      );
      setUpvotedIds((prev) => {
        const next = new Set(prev);
        payload.upvoted ? next.add(answerId) : next.delete(answerId);
        return next;
      });
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === answerId
            ? { ...a, upvoteCount: a.upvoteCount + (payload.upvoted ? 1 : -1) }
            : a
        )
      );
    } catch {
      // ignore
    } finally {
      setUpvoting(null);
    }
  };

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="theme-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center p-8">
        <div className="theme-panel max-w-sm rounded-[28px] p-6 text-center">
          <p className="theme-muted text-sm">{error || "Question not found."}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-full bg-[#ff5630] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="theme-muted mb-8 flex items-center gap-2 text-sm hover:text-current"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to questions
        </button>

        {/* Question */}
        <div className="theme-panel rounded-[32px] p-6">
          <h1 className="theme-heading text-2xl font-semibold leading-8">{question.title}</h1>
          <p className="theme-muted mt-4 text-sm leading-7">{question.body}</p>

          {question.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/55">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/40">
            <AuthorChip author={question.author} />
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {question.answerCount} answer{question.answerCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Answers */}
        <div className="mt-6 space-y-4">
          <h2 className="theme-heading text-lg font-semibold">
            {answers.length} answer{answers.length !== 1 ? "s" : ""}
          </h2>

          {answers.length === 0 ? (
            <div className="theme-panel rounded-[28px] p-6 text-center">
              <p className="theme-muted text-sm">No answers yet. Be the first to help!</p>
            </div>
          ) : (
            answers.map((answer) => (
              <div
                key={answer.id}
                className={`theme-panel rounded-[24px] p-5 ${
                  answer.isGuideAnswer
                    ? "border border-[#4ade80]/20 bg-[#0a1f13]"
                    : ""
                }`}
              >
                {answer.isGuideAnswer ? (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#0f2a1e] px-3 py-1 text-xs font-medium text-[#4ade80]">
                    Community Guide answer
                  </div>
                ) : null}

                <p className="theme-muted text-sm leading-7">{answer.body}</p>

                <div className="mt-4 flex items-center justify-between">
                  <AuthorChip author={answer.author} />
                  <button
                    onClick={() => toggleUpvote(answer.id)}
                    disabled={!user || upvoting === answer.id || answer.author.id === user?.id}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      upvotedIds.has(answer.id)
                        ? "bg-[#13283a] text-[#8dc9ff]"
                        : "border border-white/10 text-white/50 hover:bg-white/8 disabled:opacity-40"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {answer.upvoteCount}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post answer form */}
        <div className="mt-8">
          <h3 className="theme-heading mb-4 text-lg font-semibold">
            {user ? "Post your answer" : "Sign in to answer"}
          </h3>
          {user ? (
            <form onSubmit={submitAnswer} className="space-y-4">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={5}
                className="theme-input w-full rounded-[20px] px-4 py-3 text-sm resize-none"
                placeholder="Share your knowledge and experience..."
              />
              {answerError ? (
                <div className="rounded-2xl bg-[#2d1714] px-4 py-3 text-sm text-[#ff8a78]">
                  {answerError}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={submitting || answerBody.trim().length < 10}
                className="rounded-full bg-[#ff5630] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post answer"}
              </button>
            </form>
          ) : (
            <a
              href={`/login?redirect=/ask-a-local/${id}`}
              className="inline-flex h-12 items-center rounded-full bg-[#ff5630] px-6 text-sm font-semibold text-white"
            >
              Sign in to answer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthorChip({ author }: { author: ForumAuthor }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-white/50">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
          author.isGuide ? "bg-[#0f2a1e] text-[#4ade80]" : "bg-white/10 text-white/55"
        }`}
      >
        {author.name.charAt(0)}
      </span>
      <span>{author.name}</span>
      {author.isGuide ? (
        <span className="rounded-full bg-[#0f2a1e] px-1.5 py-0.5 text-[10px] text-[#4ade80]">
          Guide
        </span>
      ) : null}
    </span>
  );
}
