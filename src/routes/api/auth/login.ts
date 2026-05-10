import { createFileRoute } from "@tanstack/react-router";

import { loginBodySchema } from "@/lib/server/auth/schemas";
import {
  createSessionForUser,
  getSessionUserFromRequest,
} from "@/lib/server/auth/session-service";
import { verifyUserCredentials } from "@/lib/server/auth/user-service";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const existing = await getSessionUserFromRequest(request).catch(
          () => null,
        );
        if (existing) {
          return Response.json(
            { ok: false, message: "أنت مسجّل الدخول بالفعل." },
            { status: 400 },
          );
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

        const parsed = loginBodySchema.safeParse(body);
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

        const user = await verifyUserCredentials(
          parsed.data.email,
          parsed.data.password,
        );

        if (!user) {
          return Response.json(
            {
              ok: false,
              message: "البريد أو كلمة المرور غير صحيحة.",
            },
            { status: 401 },
          );
        }

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
            status: 200,
            headers: {
              "set-cookie": session.setCookie,
            },
          },
        );
      },
    },
  },
});
