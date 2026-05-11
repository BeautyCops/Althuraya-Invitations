import { createFileRoute } from "@tanstack/react-router";

import { clearSessionCookieHeader } from "@/lib/server/auth/cookies";
import { requestIsHttps } from "@/lib/server/auth/request-is-https";
import { revokeSessionByRequest } from "@/lib/server/auth/session-service";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await revokeSessionByRequest(request).catch(() => undefined);
        const secure = requestIsHttps(request);
        return Response.json(
          { ok: true },
          {
            status: 200,
            headers: {
              "set-cookie": clearSessionCookieHeader(secure),
            },
          },
        );
      },
    },
  },
});
