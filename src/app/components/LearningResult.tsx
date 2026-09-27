export type LearningMaterial = {
  explanation: string;
  example: string;
  quiz: Array<{
    question: string;
    answer: string;
  }>;
};

type LearningResultProps = {
  topic: string;
  material: LearningMaterial;
  onAskAgain: () => void;
};

export default function LearningResult({
  topic,
  material,
  onAskAgain,
}: LearningResultProps) {
  return (
    <div className="learningResult">
      <p className="resultLabel">AI LEARNING NOTE</p>
      <h3>{topic}</h3>

      <section className="resultSection" aria-labelledby="explanation-title">
        <p className="resultNumber">01</p>
        <h4 id="explanation-title">핵심 설명</h4>
        <p>{material.explanation}</p>
      </section>

      <section className="resultSection" aria-labelledby="example-title">
        <p className="resultNumber">02</p>
        <h4 id="example-title">구체적인 예시</h4>
        <p>{material.example}</p>
      </section>

      <section className="resultSection" aria-labelledby="quiz-title">
        <p className="resultNumber">03</p>
        <h4 id="quiz-title">확인 문제</h4>
        <ol className="quizList">
          {material.quiz.map((item, index) => (
            <li key={`${item.question}-${index}`}>
              <p>{item.question}</p>
              <details>
                <summary>정답과 해설 보기</summary>
                <p>{item.answer}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <button className="askAgainButton" type="button" onClick={onAskAgain}>
        다른 주제 배우기
      </button>
    </div>
  );
}
