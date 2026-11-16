# The Labot Frontend

건설 현장 근로자 투입부터 정산까지, 노무관리를 한 곳에서 처리하는 서비스의 본사 웹과 현장 앱.

[백엔드](https://github.com/The-Labot/the-labot-backend) · [조직 소개](https://github.com/The-Labot)

| 폴더 | 대상 | 기술 |
|---|---|---|
| [`react/`](react) | 본사 웹 | React 19, TypeScript, Vite 7, Tailwind CSS 4 |
| [`reactNative/`](reactNative) | 현장 앱(현장 관리자·근로자) | React Native 0.82, TypeScript, react-native-maps |

## 본사 웹

- 본사 가입·로그인, 현장 생성·수정(주소를 카카오 API로 좌표로 바꿔 출퇴근 반경 기준으로 쓴다)
- 현장 관리자 지정, 근로자 관리, 근무 현황
- 근로자별 급여표, 현장별 대시보드

## 현장 앱

| 사용자 | 화면 |
|---|---|
| 현장 관리자 | 근로자 등록(신분증·근로계약서 촬영 후 OCR), 공지, 안전교육과 참석 서명, 위험 신고 처리, 작업일보, 현장 지도 |
| 근로자 | 위치 기반 출퇴근과 이력, 공지, 위험 신고, 현장 지도 |

## 배포

- 웹은 `main`에 머지하면 GitHub Actions가 빌드한 이미지를 Docker Hub에 올리고, EC2에서 compose로 띄운다.
- 웹 이미지의 nginx가 HTTPS를 맡고 `/api` 요청을 백엔드로 넘긴다. 인증서는 certbot 컨테이너가 갱신한다.
- 앱은 안드로이드 릴리스 빌드를 만든다. 릴리스 빌드는 운영 API, 개발 빌드는 로컬 API를 바라본다.

## 로컬 실행

<details>
<summary>실행 방법</summary>

웹 (Node.js 20)

```bash
cd react
cat > .env <<'ENV'
VITE_API_BASE_URL=http://localhost:8080/api
VITE_KAKAO_REST_API_KEY=
ENV
npm install
npm run dev
```

앱 (React Native 개발 환경 필요)

```bash
cd reactNative
npm install
npm start          # Metro
npm run android    # 에뮬레이터는 10.0.2.2:8080 으로 로컬 백엔드에 붙는다
```

</details>

## 팀원

| 이름 | 주요 담당 |
|---|---|
| 장근창 | 배포·운영 환경(Docker, CI/CD, HTTPS), S3 파일 저장, OCR 연동 |
| 방성식 | 백엔드 본사·현장·공지·안전교육·위험 신고·작업일보·인증, 본사 웹 화면 |
| 박찬홍 | 백엔드 근로자 관리·출퇴근·OCR 근로자 등록·대시보드 |
| 장동현 | 현장 앱(관리자·근로자 화면), 본사 웹 공통 컴포넌트 |
