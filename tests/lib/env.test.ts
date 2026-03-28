import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("lib/env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("exports env object when required vars are set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    const { env } = await import("@/lib/env");

    expect(env.supabase.url).toBe("https://test.supabase.co");
    expect(env.supabase.anonKey).toBe("test-anon-key");
  });

  it("throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

    await expect(import("@/lib/env")).rejects.toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  });

  it("throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(import("@/lib/env")).rejects.toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });
});
