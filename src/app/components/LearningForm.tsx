"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import LearningResult, { type LearningMaterial } from "./LearningResult";

const MAX_TOPIC_LENGTH = 80;

type Level = "beginner" | "intermediate";
type RequestStatus = "idle" | "loading" | "success" | "error";

function isLearningMaterial(value: unknown): value is LearningMaterial {
  if (!value || typeof value !== "object") return false;

  const material = value as Partial<LearningMaterial>;
  return (
    typeof material.explanation === "string" &&
    typeof material.example === "string" &&
    Array.isArray(material.quiz) &&
    material.quiz.every(
      (item) =>
        item &&
        typeof item.question === "string" &&
        typeof item.answer === "string",
    )
  );
}

function getErrorMessage(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }

  return "학습 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function LearningForm() {
  const topicId = useId();
  const errorId = useId();
  const topicInputRef = useRef<HTMLInputElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [fieldError, setFieldError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [material, setMaterial] = useState<LearningMaterial | null>(null);

  useEffect(() => {
    return () => requestControllerRef.current?.abort();
  }, []);

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

  function clearResponse() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setRequestError("");
    setMaterial(null);
    setStatus("idle");
  }

  async function createLearningMaterial(requestTopic: string, requestLevel: Level) {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    setRequestError("");
    setMaterial(null);
    setStatus("loading");

    try {
      const response = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: requestTopic, level: requestLevel }),
        signal: controller.signal,
      });

      const responseBody: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(responseBody));
      }

      if (!isLearningMaterial(responseBody)) {
        throw new Error("학습 자료의 형식을 확인할 수 없습니다. 다시 시도해 주세요.");
      }

      setMaterial(responseBody);
      setStatus("success");
    } catch (error) {
      if (controller.signal.aborted) return;

      setRequestError(
        error instanceof Error
          ? error.message
          : "학습 자료를 불러오지 못했습니다. 다시 시도해 주세요.",
      );
      setStatus("error");
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateTopic(topic);
    if (validationError) {
      setFieldError(validationError);
      clearResponse();
      topicInputRef.current?.focus();
      return;
    }

    setFieldError("");
    void createLearningMaterial(topic.trim(), level);
  }

  function handleReset() {
    clearResponse();
    setTopic("");
    setLevel("beginner");
    setFieldError("");
    topicInputRef.current?.focus();
  }

  function handleAskAgain() {
    clearResponse();
    setTopic("");
    setFieldError("");
    topicInputRef.current?.focus();
  }

  return (
    <div className="learningPanel">
      <form
        className="learningForm"
        onSubmit={handleSubmit}
        aria-busy={status === "loading"}
        noValidate
      >
        <div className="formHeader">
          <span className="stepBadge">STEP 04</span>
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
            ref={topicInputRef}
            id={topicId}
            name="topic"
            type="text"
            value={topic}
            maxLength={MAX_TOPIC_LENGTH}
            placeholder="예: 생성형 AI의 토큰"
            aria-describedby={fieldError ? errorId : undefined}
            aria-invalid={Boolean(fieldError)}
            onChange={(event) => {
              setTopic(event.target.value);
              if (fieldError) setFieldError("");
              if (status !== "idle") clearResponse();
            }}
          />
          {fieldError && (
            <p className="fieldError" id={errorId} role="alert">
              {fieldError}
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
                  if (status !== "idle") clearResponse();
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
                  if (status !== "idle") clearResponse();
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
          <button
            className="submitButton"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "학습 자료 만드는 중…" : "학습 자료 만들기"}
          </button>
          <button className="resetButton" type="button" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      <div className="requestPreview" aria-live="polite">
        {status === "idle" && (
          <div className="emptyPreview">
            <span aria-hidden="true">✦</span>
            <p>
              주제를 입력하면
              <br />AI가 학습 자료를 만들어드려요.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="loadingPreview" role="status">
            <span className="loadingMark" aria-hidden="true" />
            <p>설명과 문제를 만들고 있어요.</p>
            <small>잠시만 기다려 주세요.</small>
          </div>
        )}

        {status === "error" && (
          <div className="errorPreview" role="alert">
            <span aria-hidden="true">!</span>
            <h3>자료를 만들지 못했어요</h3>
            <p>{requestError}</p>
            <button
              type="button"
              onClick={() => void createLearningMaterial(topic.trim(), level)}
            >
              다시 시도하기
            </button>
          </div>
        )}

        {status === "success" && material && (
          <LearningResult
            topic={topic.trim()}
            material={material}
            onAskAgain={handleAskAgain}
          />
        )}
      </div>
    </div>
  );
}
