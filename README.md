## LangCrew

한국 사용자를 위한 MCP 크루 서비스입니다.

라이브 미리보기: [https://langcrew.kr](https://langcrew.kr)

![미리보기](./preview.png)

## 빠른 시작

1. 저장소 클론

```bash
git clone <이 저장소 주소>
cd lang-crew
```

2. 의존성 설치

```bash
npm install -g pnpm

pnpm install
```

3. 데이터베이스 준비

[Supabase](https://supabase.com/)에서 데이터베이스를 생성하세요.

`data/install.sql` 파일의 SQL을 실행하세요.

4. 환경 변수 설정

루트 디렉토리에 .env 파일을 생성하고 아래와 같이 입력하세요:

```env
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

NEXT_PUBLIC_WEB_URL="https://langcrew.kr"
```

5. 개발 서버 실행

```bash
pnpm dev
```

6. 사이트 미리보기

브라우저에서 [http://localhost:3000](http://localhost:3000) 또는 [https://langcrew.kr](https://langcrew.kr)로 접속하세요.

## 커뮤니티

- [LangCrew 공식 텔레그램](https://t.me/+N0gv4O9SXio2YWU1)
- [LangCrew 공식 디스코드](https://discord.gg/RsYPRrnyqg)

## 제작자

- [idoubi](https://bento.me/idoubi)
- [트위터 팔로우](https://x.com/idoubicv)
- [커피 후원하기](https://www.buymeacoffee.com/idoubi)

git init

git remote add origin https://github.com/studywithme/lang-crew.git
git add .
git commit -m "프로젝트 최초 커밋"
git branch -M main
git push -u origin main

pnpm build
pnpm start

npm install -g pm2
pm2 start npm --name "lang-crew" -- start
pm2 save
pm2 startup
