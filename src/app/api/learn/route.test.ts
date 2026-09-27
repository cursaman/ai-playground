// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function createRequest(body: string) {
  return new Request("http://localhost/api/learn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/learn", () => {
  it("JSON이 아니면 400을 반환한다", async () => {
    const response = await POST(createRequest("not-json"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "요청 형식이 올바르지 않습니다.",
    });
  });

  it("주제가 비어 있으면 400을 반환한다", async () => {
    const response = await POST(
      createRequest(JSON.stringify({ topic: "", level: "beginner" })),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "주제를 두 글자 이상 입력해 주세요.",
    });
  });

  it("80자를 넘는 주제는 400을 반환한다", async () => {
    const response = await POST(
      createRequest(
        JSON.stringify({ topic: "가".repeat(81), level: "beginner" }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "주제는 80자 이내로 입력해 주세요.",
    });
  });

  it("API 키가 없으면 안전한 503 안내를 반환한다", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const response = await POST(
      createRequest(
        JSON.stringify({ topic: "생성형 AI", level: "beginner" }),
      ),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "AI 서비스가 아직 설정되지 않았습니다. 관리자에게 문의해 주세요.",
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
