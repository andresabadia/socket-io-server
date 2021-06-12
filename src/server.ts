import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
const PORT: number = 8080;
let connections: { id: string; isReady: boolean }[] = [];
let controller: string = "";

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

app.get("/", (req, res) => res.send("0.2"));

io.on("connection", (socket) => {
    console.log("a user connected", socket.handshake.auth.token);
    if (socket.handshake.auth.token) {
        controller = socket.id;
        socket.emit("connected", connections);
    } else {
        connections.push({ id: socket.id, isReady: false });
        socket.emit("connected", true);
        if (controller !== "") {
            socket.to(controller).emit("connected", connections);
        }
    }
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        console.log(connections);
        if (socket.id === controller) {
            controller = "";
        } else {
            connections = [
                ...connections.filter(
                    (connection) => socket.id !== connection.id
                ),
            ];
        }
        if (controller !== "") {
            socket.to(controller).emit("connected", connections);
        }
        console.log(connections);
    });
    socket.on("update-pano-view", (panoView) => {
        socket.volatile.broadcast.emit("pano-view-update", panoView);
    });
    socket.on("key-clicked", (key) => {
        socket.broadcast.emit("key-clicked", key);
    });
    socket.on("el-clicked", (el) => {
        socket.broadcast.emit("el-clicked", el);
    });
    socket.on("user-ready", (_isReady) => {
        console.log("user-ready");
        if (controller !== "") {
            const connnectionIndex = connections.findIndex(
                (connection) => connection.id === socket.id
            );
            if (connnectionIndex >= 0) {
                connections[connnectionIndex].isReady = true;
            }
            socket.to(controller).emit("connected", connections);
        }
    });
});

server.listen(process.env.PORT || PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
