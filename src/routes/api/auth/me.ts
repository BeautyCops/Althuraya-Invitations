import { createFileRoute } from "@tanstack/react-router";

import { getSessionUserFromRequest } from "@/lib/server/auth/session-service";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await getSessionUserFromRequest(request);
          if (!user) {
            return Response.json(
              { ok: false, authenticated: false },
              { status: 401 },
            );
          }
          return Response.json({
            ok: true,
            authenticated: true,
            user,
          });
        } catch (e) {
          console.error("[auth/me]", e);
          return Response.json(
            { ok: false, message: "تعذر التحقق من الجلسة." },
            { status: 503 },
          );
        }
      },
    },
  },
});
