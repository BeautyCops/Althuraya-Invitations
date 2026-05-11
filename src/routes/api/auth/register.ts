import { createFileRoute } from "@tanstack/react-router";

import { registerBodySchema } from "@/lib/server/auth/schemas";
import {
  createSessionForUser,
  getSessionUserFromRequest,
  revokeSessionByRequest,
} from "@/lib/server/auth/session-service";
import { createUser } from "@/lib/server/auth/user-service";

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const existing = await getSessionUserFromRequest(request).catch(
          () => null,
        );
        if (existing) {
          await revokeSessionByRequest(request).catch(() => undefined);
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { ok: false, message: "جسم الطلب غير صالح." },
            { status: 400 },
          );
        }

        const parsed = registerBodySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              ok: false,
              message: "تحقق من الحقول.",
              errors: parsed.error.flatten(),
            },
            { status: 400 },
          );
        }

        try {
          const user = await createUser(parsed.data);
          const session = await createSessionForUser(request, user.id);
          return Response.json(
            {
              ok: true,
              user: {
                id: user.id,
                email: user.email,
                role: user.role,
              },
            },
            {
              status: 201,
              headers: {
                "set-cookie": session.setCookie,
              },
            },
          );
        } catch (e: unknown) {
          const err = e as { code?: string };
          if (err.code === "23505") {
            return Response.json(
              { ok: false, message: "هذا البريد مسجّل مسبقًا." },
              { status: 409 },
            );
          }
          console.error("[auth/register]", e);
          return Response.json(
            { ok: false, message: "تعذر إنشاء الحساب. حاول لاحقًا." },
            { status: 500 },
          );
        }
      },
    },
  },
});
