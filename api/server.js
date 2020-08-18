const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const userRouter = require("../users/userRouter.js");
const authRouter = require("../auth/authRouter.js");
const dbConnection = require("../database/db-config.js");

const server = express();

const sessionConfiguration = {
    name: "monster",
    secret: "keep it secret, keep it safe!",
    cookie: {
        maxAge: 600000,
        secure: process.env.COOKIE_SECURE || false,
        httpOnly: true, 
    },
    resave: false,
    saveUninitialized: true, 
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 3600000
    }),
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfiguration));

server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
