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
RUN rm -rf node_modules/.vite node_modules/.cache 2>/dev/null || true
RUN test -f dist/server/server.js
RUN ln -sf server.js dist/server/index.js

# وقت التشغيل: لا تستخدم npm ci --omit=dev هنا؛ خادم TanStack/Nitro قد يحتاج
# حزمًا موجودة وقت البناء ولا توجد كلها ضمن الطبقة المدمجة ⇒ العملية تنهار بصمت قبل الاستماع
# وفشل healthcheck على Railway (503 / service unavailable).
FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
# Nitro (tanstack preset node): NITRO_PORT ← PORT؛ الاستضافة ← NITRO_HOST ← HOST (- يجب 0.0.0.0 على Railway، ليس localhost)
ENV HOST=0.0.0.0
ENV NITRO_HOST=0.0.0.0

EXPOSE 3000

# Railway يحقن PORT تلقائيًا؛ لا تضعي ENV PORT ثابتًا في الصورة.

CMD ["node", "--unhandled-rejections=strict", "dist/server/server.js"]
