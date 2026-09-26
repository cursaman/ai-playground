"use client";

import { FormEvent, useId, useState } from "react";

const MAX_TOPIC_LENGTH = 80;

type Level = "beginner" | "intermediate";

type LearningRequest = {
  topic: string;
  level: Level;
};

const levelLabels: Record<Level, string> = {
  beginner: "입문",
  intermediate: "중급",
};

export default function LearningForm() {
  const topicId = useId();
  const errorId = useId();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [error, setError] = useState("");
  const [request, setRequest] = useState<LearningRequest | null>(null);

  function validateTopic(value: string) {
    const trimmedTopic = value.trim();

    if (!trimmedTopic) {
      return "배우고 싶은 주제를 입력해 주세요.";
    }

    if (trimmedTopic.length < 2) {
      return "주제를 두 글자 이상 입력해 주세요.";
    }

    if (trimmedTopic.length > MAX_TOPIC_LENGTH) {
      return `주제는 ${MAX_TOPIC_LENGTH}자 이내로 입력해 주세요.`;
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateTopic(topic);
    if (validationError) {
      setError(validationError);
      setRequest(null);
      return;
    }

    setError("");
    setRequest({ topic: topic.trim(), level });
  }

  function handleReset() {
    setTopic("");
    setLevel("beginner");
    setError("");
    setRequest(null);
  }

  return (
    <div className="learningPanel">
      <form className="learningForm" onSubmit={handleSubmit} noValidate>
        <div className="formHeader">
          <span className="stepBadge">STEP 02</span>
          <h3>오늘은 무엇을 배워볼까요?</h3>
          <p>궁금한 주제와 현재 난이도를 선택해 주세요.</p>
        </div>

        <div className="fieldGroup">
          <div className="labelRow">
            <label htmlFor={topicId}>학습 주제</label>
            <span aria-live="polite">
              {topic.length}/{MAX_TOPIC_LENGTH}
            </span>
          </div>
          <input
            id={topicId}
            name="topic"
            type="text"
            value={topic}
            maxLength={MAX_TOPIC_LENGTH}
            placeholder="예: 생성형 AI의 토큰"
            aria-describedby={error ? errorId : undefined}
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setTopic(event.target.value);
              if (error) setError("");
              if (request) setRequest(null);
            }}
          />
          {error && (
            <p className="fieldError" id={errorId} role="alert">
              {error}
            </p>
          )}
        </div>

        <fieldset className="levelFieldset">
          <legend>현재 난이도</legend>
          <div className="levelOptions">
            <label className={level === "beginner" ? "isSelected" : ""}>
              <input
                type="radio"
                name="level"
                value="beginner"
                checked={level === "beginner"}
                onChange={() => {
                  setLevel("beginner");
                  setRequest(null);
                }}
              />
              <span>
                <strong>입문</strong>
                <small>처음 배우는 주제예요</small>
              </span>
            </label>
            <label className={level === "intermediate" ? "isSelected" : ""}>
              <input
                type="radio"
                name="level"
                value="intermediate"
                checked={level === "intermediate"}
                onChange={() => {
                  setLevel("intermediate");
                  setRequest(null);
                }}
              />
              <span>
                <strong>중급</strong>
                <small>기초 개념은 알고 있어요</small>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="formActions">
          <button className="submitButton" type="submit">
            학습 요청 만들기
          </button>
          <button className="resetButton" type="button" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      <div className="requestPreview" aria-live="polite">
        {request ? (
          <div className="previewContent">
            <p className="previewLabel">학습 요청 미리보기</p>
            <h3>{request.topic}</h3>
            <dl>
              <div>
                <dt>난이도</dt>
                <dd>{levelLabels[request.level]}</dd>
              </div>
              <div>
                <dt>답변 구성</dt>
                <dd>쉬운 설명 · 예시 · 확인 문제</dd>
              </div>
            </dl>
            <p className="previewNote">
              다음 단계에서 AI API를 연결하면 이 요청으로 학습 자료를 만들 수
              있어요.
            </p>
          </div>
        ) : (
          <div className="emptyPreview">
            <span aria-hidden="true">✦</span>
            <p>주제를 입력하면<br />학습 요청을 미리 보여드려요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
