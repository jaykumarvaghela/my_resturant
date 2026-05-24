import app from "./app";
import { createServer } from "http";
import { initWebSocket } from "./websocket/socket";
import dotevn from "dotenv";
dotevn.config();

const PORT = process.env.API_PORT ?? 3001;
const httpServer = createServer(app);

initWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
