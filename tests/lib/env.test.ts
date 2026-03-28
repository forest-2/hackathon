import { describe, expect, it } from "vitest";

describe("lib/env", () => {
  it("exports env with openai config", async () => {
    const { env } = await import("@/lib/env");
    expect(env).toHaveProperty("openai");
    expect(env.openai).toHaveProperty("apiKey");
  });
});
