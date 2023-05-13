import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

import connection from './db/database.js';

import users from './api/routes/users.js';
import chats from './api/routes/chats.js';

dotenv.config();

const app = express(),
    host = process.env.HOST,
    port = process.env.PORT || '5000';

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(passport.initialize());

app.use('/users', users); 
app.use('/chats', chats);

const server = app.listen(port, host, (err) => {
    if (err) {
        console.log("Failed to start the server!");
    } else {
        connection.connect((err) => {
            if (err) {
                console.log("Failed to connect with database!");
            } else {
                console.log(`Server is running at http://${host}:${port}`);
            }
        });
    }
});

const socket = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true 
    }
}), 
    onlineUsers = new Map();

socket.on("connection", (socket) => {
    const socketID = socket.id;

    socket.on("getUserID", (userID) => {
       onlineUsers.set(userID, socketID);
    });

    socket.on("sendMessage", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("recieveMessage", data.message);
        }
    });
});