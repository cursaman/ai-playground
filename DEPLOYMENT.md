# Vercel 배포 안내서

이 문서는 GitHub의 `cursaman/ai-playground` 저장소를 Vercel에 연결해 배포하는 절차입니다. Codex 작업 범위는 GitHub 반영 확인까지이며, 아래 작업은 사용자가 Vercel에서 진행합니다.

## 1. GitHub 자동 검사 확인

GitHub 저장소의 **Actions** 탭에서 `Quality` 작업이 통과했는지 확인합니다. 이 작업은 `main` 브랜치 푸시와 Pull Request마다 다음 검사를 실행합니다.

- TypeScript
- ESLint
- Vitest
- Next.js 프로덕션 빌드

## 2. Vercel 프로젝트 연결

1. Vercel 대시보드에서 새 프로젝트 추가 화면을 엽니다.
2. GitHub 저장소 `cursaman/ai-playground`를 선택해 가져옵니다.
3. Framework Preset이 **Next.js**인지 확인합니다.
4. 저장소 자체가 Next.js 프로젝트이므로 Root Directory는 `.`을 사용합니다.

별도의 `vercel.json`이나 빌드 명령 변경은 필요하지 않습니다.

## 3. 환경변수 등록

Vercel 프로젝트의 Environment Variables에 다음 값을 등록합니다.

| 이름 | 유형 | 대상 | 값 |
|---|---|---|---|
| `OPENAI_API_KEY` | Secret | Production | 실제 OpenAI API 키 |
| `OPENAI_MODEL` | Config | Production | `gpt-6-astra` 또는 사용할 모델 |

Preview 배포에서도 AI 기능을 시험하려면 두 변수에 Preview 대상도 추가합니다.

중요 사항:

- `OPENAI_API_KEY`에는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.
- API 키를 GitHub, 코드, 빌드 로그에 입력하지 않습니다.
- 환경변수를 추가하거나 변경한 후에는 새로 배포해야 적용됩니다.

## 4. 첫 배포 확인

배포가 완료되면 공개 URL에서 다음 순서로 확인합니다.

1. 첫 화면이 정상적으로 표시된다.
2. 학습 주제를 입력할 수 있다.
3. 입문 또는 중급 난이도를 선택할 수 있다.
4. `학습 자료 만들기`를 누르면 로딩 상태가 표시된다.
5. 설명, 예시, 확인 문제가 표시된다.
6. 정답과 해설을 펼칠 수 있다.
7. `다른 주제 배우기`가 동작한다.
8. 모바일 화면에서 가로 스크롤이 생기지 않는다.

## 5. 오류별 확인 방법

| 화면 메시지 또는 상태 | 확인할 내용 |
|---|---|
| AI 서비스가 아직 설정되지 않음 | `OPENAI_API_KEY`가 Production에 등록됐는지 확인 후 재배포 |
| AI 서비스 설정 확인 필요 | API 키가 유효한지 확인 |
| 요청이 많음 | 잠시 기다린 뒤 재시도하고 API 사용 한도 확인 |
| 학습 자료 생성 중 오류 | Vercel Functions 로그에서 상태 코드와 오류 종류 확인 |

서버 로그는 API 키나 사용자 질문을 기록하지 않도록 구성되어 있습니다.

## 6. 이후 배포

Vercel과 GitHub 연결이 완료되면 `main` 브랜치의 새 커밋이 Production 배포를 시작합니다. 기능 작업은 다음 흐름으로 진행합니다.

```text
코드 변경 → 자동 검사 → GitHub main 푸시
→ GitHub Actions 통과 확인 → 사용자 Vercel 배포 확인
```
