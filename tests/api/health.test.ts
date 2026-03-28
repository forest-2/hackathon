import { describe, expect, it, vi } from "vitest";

// Mock the Supabase server client before importing the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock next/headers (required by server.ts)
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

import { createClient } from "@/lib/supabase/server";

describe("GET /api/health", () => {
  it("returns 200 with status:ok and timestamp when DB is reachable", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null });
    const mockFrom = vi.fn(() => ({ select: vi.fn(() => ({ limit: mockSelect })) }));
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
    expect(() => new Date(body.timestamp)).not.toThrow();
  });

  it("returns 503 with status:error when DB throws", async () => {
    const mockSelect = vi
      .fn()
      .mockResolvedValue({ data: null, error: new Error("Connection refused") });
    const mockFrom = vi.fn(() => ({ select: vi.fn(() => ({ limit: mockSelect })) }));
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    vi.resetModules();
    vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("error");
    expect(typeof body.message).toBe("string");
    // Must not expose raw error details
    expect(body.message).not.toContain("Connection refused");
  });

  it("response body matches api-health.md contract shape on success", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null });
    const mockFrom = vi.fn(() => ({ select: vi.fn(() => ({ limit: mockSelect })) }));
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    vi.resetModules();
    vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const body = await response.json();

    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("timestamp");
    expect(Object.keys(body)).toHaveLength(2);
  });
});
