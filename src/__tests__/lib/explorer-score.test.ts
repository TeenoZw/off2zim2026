import {
  parseExplorerScore,
  scoreLabel,
} from "@/lib/explorer-score";

describe("parseExplorerScore", () => {
  it("returns zero breakdown for null input", () => {
    const score = parseExplorerScore(null);
    expect(score.total).toBe(0);
    expect(score.completedBookings).toBe(0);
    expect(score.lastMinuteCancellations).toBe(0);
    expect(score.reviewsWritten).toBe(0);
    expect(score.disputesLost).toBe(0);
  });

  it("returns zero breakdown for undefined input", () => {
    const score = parseExplorerScore(undefined);
    expect(score.total).toBe(0);
  });

  it("returns zero breakdown for invalid JSON", () => {
    const score = parseExplorerScore("not-json");
    expect(score.total).toBe(0);
  });

  it("parses a valid score JSON string", () => {
    const raw = JSON.stringify({
      total: 45,
      completedBookings: 3,
      lastMinuteCancellations: 0,
      reviewsWritten: 2,
      disputesLost: 1,
    });
    const score = parseExplorerScore(raw);
    expect(score.total).toBe(45);
    expect(score.completedBookings).toBe(3);
    expect(score.reviewsWritten).toBe(2);
    expect(score.disputesLost).toBe(1);
  });
});

describe("scoreLabel", () => {
  it("returns 'New' for score 0", () => {
    expect(scoreLabel(0)).toBe("New");
  });

  it("returns 'Fair' for score 30", () => {
    expect(scoreLabel(30)).toBe("Fair");
  });

  it("returns 'Good' for score 60", () => {
    expect(scoreLabel(60)).toBe("Good");
  });

  it("returns 'Excellent' for score 100+", () => {
    expect(scoreLabel(100)).toBe("Excellent");
    expect(scoreLabel(200)).toBe("Excellent");
  });

  it("returns 'Fair' for score 29", () => {
    expect(scoreLabel(29)).toBe("New");
  });
});
