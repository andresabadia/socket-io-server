import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT: number = 3000;

app.get("/", (req, res) => res.send("Express + Typescript!!!"));

io.on("connection", (socket) => {
    console.log("a user connected");
});

server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
