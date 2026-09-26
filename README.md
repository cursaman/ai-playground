# AI Playground

Next.js로 AI 기능을 배우고 직접 만들어보는 실험 프로젝트입니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 기술 구성

- Next.js (App Router)
- React + TypeScript
- Vercel 배포

## 학습 계획

- [4주 AI 입문 계획표](LEARNING_PLAN.md)
- [1주차 상세 계획과 실습](WEEK_1.md)
- [개발 계획표](DEVELOPMENT_PLAN.md)

## Vercel 배포

1. 변경 사항을 GitHub의 `main` 브랜치에 푸시합니다.
2. Vercel에서 GitHub 저장소 `cursaman/ai-playground`를 가져옵니다.
3. Framework Preset이 `Next.js`인지 확인하고 배포합니다.
4. AI API 키가 생기면 Vercel 프로젝트의 Environment Variables에 등록합니다.

`.env` 파일과 API 키는 Git에 커밋하지 않습니다.
