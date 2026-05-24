import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

export function initWebSocket(server: HTTPServer) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-kitchen", () => socket.join("kitchen"));
    socket.on("order-update", (data) => io.to("kitchen").emit("new-order", data));
    socket.on("disconnect", () => console.log("Client left:", socket.id));
  });

  return io;
}
