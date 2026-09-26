import LearningForm from "./components/LearningForm";

const steps = [
  ["01", "AI 기초", "생성형 AI의 원리와 한계를 이해합니다."],
  ["02", "Next.js", "웹에서 아이디어를 직접 구현합니다."],
  ["03", "AI API", "사용자의 질문에 답하는 기능을 연결합니다."],
  ["04", "Vercel", "완성한 결과물을 세상에 공개합니다."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">LEARN · BUILD · SHARE</p>
        <h1>
          AI를 배우는 가장 좋은 방법은
          <span>직접 만들어보는 것.</span>
        </h1>
        <p className="intro">
          AI Playground는 Next.js로 작은 실험을 만들고, 기록하고,
          배포하는 학습 프로젝트입니다.
        </p>
        <a className="button" href="#learn">
          지금 시작하기
        </a>
      </section>

      <section className="learn" id="learn" aria-labelledby="learn-title">
        <div className="sectionHeading">
          <p>LEARNING REQUEST</p>
          <h2 id="learn-title">궁금한 것을 학습 요청으로</h2>
        </div>
        <LearningForm />
      </section>

      <section className="roadmap" id="roadmap" aria-labelledby="roadmap-title">
        <div className="sectionHeading">
          <p>4주 로드맵</p>
          <h2 id="roadmap-title">아이디어에서 배포까지</h2>
        </div>
        <div className="grid">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
