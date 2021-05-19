import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
const PORT: number = 8080;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.get("/", (req, res) => res.send("Express + Typescript!!!"));

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("connected", true);
    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
    socket.on("update-pano-view", (panoView) => {
        socket.volatile.broadcast.emit("pano-view-update", panoView);
    });
});

server.listen(process.env.PORT || PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
