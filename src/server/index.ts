import Fastify from "fastify";

export const startServer = () => {
  const app = Fastify();
  app.get("/", async () => ({ status: "Bot is running" }));
  app.listen({ port: 3000 }, (err) => {
    if (err) console.error(err);
  });
};
