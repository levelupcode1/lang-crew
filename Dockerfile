FROM node:20-alpine AS base

# 의존성 설치
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# 개발 이미지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV development
ENV PORT 3000

# 글로벌로 pnpm 설치
RUN npm install -g pnpm

# 소스 코드 복사
COPY . .
# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

# 개발 서버 실행 - shell 형식으로 변경
CMD ["sh", "-c", "pnpm dev"]