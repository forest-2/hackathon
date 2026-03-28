import { DatabaseStatus } from "@/components/features/DatabaseStatus";
import type { DemoItem } from "@/types";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const mockItems: DemoItem[] = [
  { id: 1, title: "Welcome to your hackathon starter!", created_at: "2026-02-23T00:00:00Z" },
  { id: 2, title: "Connected to Supabase ✓", created_at: "2026-02-23T00:00:00Z" },
];

describe("DatabaseStatus", () => {
  it("renders success state with items list when items are provided", () => {
    render(<DatabaseStatus items={mockItems} error={null} />);

    expect(screen.getByRole("heading", { name: /connected/i })).toBeInTheDocument();
    expect(screen.getByText("Welcome to your hackathon starter!")).toBeInTheDocument();
    expect(screen.getByText("Connected to Supabase ✓")).toBeInTheDocument();
  });

  it("renders error state with message when error prop is set", () => {
    render(<DatabaseStatus items={null} error="Database connection failed" />);

    expect(screen.getByText(/database connection failed/i)).toBeInTheDocument();
    // Should not show items list in error state
    expect(screen.queryByText("Welcome to your hackathon starter!")).not.toBeInTheDocument();
  });

  it("renders empty state message when items array is empty", () => {
    render(<DatabaseStatus items={[]} error={null} />);

    expect(screen.getByText(/no demo items found/i)).toBeInTheDocument();
  });

  it("does not show error indicator in success state", () => {
    render(<DatabaseStatus items={mockItems} error={null} />);

    // No error indicators in success state
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
