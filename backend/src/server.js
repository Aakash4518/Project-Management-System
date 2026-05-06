import http from "http";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/index.js";

const start = async () => {
  await connectDb();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});
