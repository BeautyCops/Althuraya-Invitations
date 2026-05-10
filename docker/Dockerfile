# اختياري (لم يعود في الجذر): بناء الصورة محليًا أو منصّة تطلب Dockerfile صريحة.
# أمثلة: docker build -f docker/Dockerfile .
#
# glibc لتقليل أعطال الـ natives مقارنة بـ Alpine (مثل lightningcss/esbuild على musl).
#
# مرحلتان لتقليل حجم الإيميج وحمل «image push» على Railway (~400MB+ كان يسهّل التعليق).
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build
RUN test -f dist/server/server.js
RUN ln -sf server.js dist/server/index.js

# --- وقت التشغيل: بدون toolchain البناء ---
FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server/server.js"]
