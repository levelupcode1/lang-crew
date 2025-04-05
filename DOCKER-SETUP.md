# MCP Directory Docker 설정 가이드

이 가이드는 Docker와 Docker Compose를 사용하여 MCP Directory를 설정하고 실행하는 방법을 설명합니다.

## 사전 요구사항

- Docker가 설치되어 있어야 합니다.
- Docker Compose가 설치되어 있어야 합니다.

## 환경 변수 설정

1. 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```sh
# Supabase 설정
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 서버 삭제 비밀번호
SERVER_DELETE_PASSWORD=your_password

# 기타 필요한 환경 변수들
```

## Docker Compose로 실행하기

1. 프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다.

```sh
docker-compose up -d
```

이 명령어는 백그라운드에서 컨테이너를 빌드하고 실행합니다.

2. 개발 서버가 시작되면 다음 명령어로 로그를 확인할 수 있습니다.

```sh
docker-compose logs -f
```

3. 개발 서버 실행

Docker 컨테이너 내부에서 자동으로 `pnpm dev` 명령어가 실행되어 개발 서버가 시작됩니다.

4. 사이트 미리보기

브라우저에서 `http://localhost:3001`으로 접속하여 사이트를 미리볼 수 있습니다.

## 컨테이너 중지하기

애플리케이션을 중지하려면 다음 명령어를 실행합니다.

```sh
docker-compose down
```

## 환경 변수 작동 방식

- Docker Compose는 프로젝트 루트 디렉토리의 `.env` 파일을 자동으로 로드합니다.
- `docker-compose.yml` 파일의 `env_file` 설정을 통해 컨테이너 내부에서 .env 파일의 모든 변수에 접근할 수 있습니다.

## 주의사항

- 프로덕션 환경에서는 민감한 정보가 포함된 `.env` 파일을 Git 저장소에 포함시키지 마세요.
- `.env` 파일은 `.gitignore`에 추가되어 있어야 합니다.
- 보안을 위해 프로덕션 환경에서는 더 강력한 비밀번호를 설정하세요.

## 문제 해결

1. **포트 충돌**: 3001 포트가 이미 사용 중인 경우, `docker-compose.yml` 파일에서 포트 매핑을 변경할 수 있습니다.

```yaml
ports:
  - "다른포트:3000"
```

2. **환경 변수 문제**: 환경 변수가 제대로 로드되지 않는 경우, 컨테이너 내부에서 확인할 수 있습니다.

```sh
docker-compose exec web printenv
```

## 프로덕션 환경으로 전환하기

개발이 완료되면 프로덕션 환경으로 전환할 수 있습니다.
1. Dockerfile에서 NODE_ENV를 'production'으로 변경
2. CMD를 ["node", "server.js"]로 변경
3. 빌드 단계 추가

자세한 내용은 프로젝트의 배포 문서를 참조하세요.

## 데이터베이스 마이그레이션

Supabase를 사용하는 경우 추가적인 설정이 필요할 수 있습니다. `README-SERVER-CONFIG.md` 파일을 참고하여 필요한 SQL 스크립트를 실행하세요. 