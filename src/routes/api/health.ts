import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          ok: true,
          service: "althuraya-api",
          timestamp: new Date().toISOString(),
          configured: {
            contactWebhook: Boolean(process.env.CONTACT_WEBHOOK_URL),
            databaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
            encryptionAtRest: Boolean(process.env.DATA_ENCRYPTION_KEY?.trim()),
          },
        });
      },
    },
  },
});
