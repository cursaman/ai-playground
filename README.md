# AI Playground

Next.js로 AI 기능을 배우고 직접 만들어보는 실험 프로젝트입니다.

## 테스트 방법

이 프로젝트는 로컬 개발 서버 대신 Vercel 배포 URL에서 테스트합니다. Codex 작업 범위는 GitHub 반영 확인까지이며, 배포 확인과 기능 테스트는 사용자가 진행합니다.

1. 코드 작성 및 자동 검사
2. GitHub `main` 브랜치에 푸시
3. GitHub에서 최신 커밋 반영 확인
4. 사용자가 Vercel 배포 URL에서 기능 테스트

## 기술 구성

- Next.js (App Router)
- React + TypeScript
- Vercel 배포

## 학습 계획

- [4주 AI 입문 계획표](LEARNING_PLAN.md)
- [1주차 상세 계획과 실습](WEEK_1.md)
- [개발 계획표](DEVELOPMENT_PLAN.md)

## Vercel 배포

1. Vercel에서 GitHub 저장소 `cursaman/ai-playground`를 한 번 연결합니다.
2. Framework Preset이 `Next.js`인지 확인하고 첫 배포를 실행합니다.
3. 이후 `main` 브랜치가 갱신되면 Vercel이 자동으로 프로덕션을 배포합니다.
4. AI API 키가 생기면 Vercel 프로젝트의 Environment Variables에 등록합니다.

`.env` 파일과 API 키는 Git에 커밋하지 않습니다.
