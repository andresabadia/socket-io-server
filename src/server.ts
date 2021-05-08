import express from "express";

const server = express();
const PORT = 4050;

server.get("/", (req, res) => res.send("Express + Typescript!!!"));

server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
