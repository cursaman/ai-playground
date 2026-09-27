import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import LearningForm from "./LearningForm";

const learningMaterial = {
  explanation: "토큰은 AI가 글을 처리할 때 사용하는 작은 단위입니다.",
  example: "긴 단어 하나가 여러 토큰으로 나뉠 수 있습니다.",
  quiz: [
    {
      question: "토큰은 무엇인가요?",
      answer: "AI가 텍스트를 처리하는 작은 단위입니다.",
    },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LearningForm", () => {
  it("빈 주제를 제출하면 입력 오류를 안내한다", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<LearningForm />);

    await user.click(screen.getByRole("button", { name: "학습 자료 만들기" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "배우고 싶은 주제를 입력해 주세요.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("성공한 API 응답을 설명, 예시, 문제로 표시한다", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(learningMaterial), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<LearningForm />);

    await user.type(
      screen.getByRole("textbox", { name: "학습 주제" }),
      "생성형 AI의 토큰",
    );
    await user.click(screen.getByRole("radio", { name: /중급/ }));
    await user.click(screen.getByRole("button", { name: "학습 자료 만들기" }));

    expect(await screen.findByText(learningMaterial.explanation)).toBeVisible();
    expect(screen.getByText(learningMaterial.example)).toBeVisible();
    expect(screen.getByText(learningMaterial.quiz[0].question)).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/learn",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          topic: "생성형 AI의 토큰",
          level: "intermediate",
        }),
      }),
    );
  });

  it("요청 중에는 제출 버튼을 비활성화해 중복 요청을 막는다", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    vi.stubGlobal("fetch", fetchMock);
    render(<LearningForm />);

    await user.type(
      screen.getByRole("textbox", { name: "학습 주제" }),
      "딥러닝",
    );
    await user.click(screen.getByRole("button", { name: "학습 자료 만들기" }));

    const loadingButton = screen.getByRole("button", {
      name: "학습 자료 만드는 중…",
    });
    expect(loadingButton).toBeDisabled();

    await user.click(loadingButton);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("서버 오류 메시지를 표시하고 다시 시도할 수 있다", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ error: "AI 서비스가 아직 설정되지 않았습니다." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<LearningForm />);

    await user.type(
      screen.getByRole("textbox", { name: "학습 주제" }),
      "머신러닝",
    );
    await user.click(screen.getByRole("button", { name: "학습 자료 만들기" }));

    expect(
      await screen.findByText("AI 서비스가 아직 설정되지 않았습니다."),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다시 시도하기" }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
