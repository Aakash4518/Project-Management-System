import http from "http";
import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./socket/index.js";

const start = async () => {
  await connectDb();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.port, '0.0.0.0', () => {
    console.log(`API running on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});