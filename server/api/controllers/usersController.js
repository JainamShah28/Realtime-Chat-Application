import { query } from '../../db/database.js';

import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';

import '../../auth/passport.js';

dotenv.config();

const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body,
            hashedPassword = await bcrypt.hash(password, 10),
            user = await query(`SELECT * FROM Users
            WHERE userName = "${userName}" OR emailID = "${email}"`);

        if (user.length !== 0) {
            if (user[0].userName === userName) {
                return res.status(409).json({
                    "success": false,
                    "message": "Username has been already taken"
                });
            } else if (user[0].emailID == email) {
                return res.status(409).json({
                    "success": false,
                    "message": "Email has been already registerd"
                });
            }
        } else {
            await query(`INSERT INTO Users(userName, emailID, pass_word)
            VALUES("${userName}", "${email}", "${hashedPassword}")`);

            const lastInsertedID = await query(`SELECT userID from Users
                WHERE userName = "${userName}"`);

            return res.status(200).json({
                "success": true,
                "message": "User registered successfully",
                "id": lastInsertedID[0].userID
            });
        }
    } catch (error) {
        throw error;
    }
};

const loginUser = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, msg) => {
        if (err || !user) {
            return res.status(401).json({
                "success": false,
                "message": msg
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(500).json({
                    "success": false,
                    "message": "failed"
                });
            }

            const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_TIME
            });

            res.cookie(process.env.COOKIE_NAME, token, {
                httpOnly: true,
                maxAge: process.env.JWT_EXPIRE_TIME
            });

            return res.status(200).json({
                "success": true,
                "id": user.userID
            });
        });
    })(req, res, next);
};

const setProfilePic = async (req, res, next) => {
    try {
        const { avatar } = req.body,
            id = req.params.userID;

        await query(`UPDATE Users SET avatar = "${avatar}"
        WHERE userID = ${id}`);

        const token = jwt.sign({ userID: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE_TIME
        });

        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRE_TIME
        });

        return res.status(200).json({
            "success": true
        });
    } catch (error) {
        return res.status(500).json({
            "success": false
        });
    }
};

const getUsers = async (req, res, next) => {
    try {
        const token = req.cookies.authToken,
            id = jwt_decode(token).userID,
            users = await query(`SELECT userID, userName, avatar FROM Users
                WHERE NOT userID = ${id}`);

        res.status(200).json({
            "success": true,
            "data": users
        });
    } catch (error) {
        res.status(500).json({
            "success": false
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.authToken,
            id = jwt_decode(token).userID,
            user = await query(`SELECT userID, userName, avatar FROM Users
                WHERE userID = ${id}`);

        res.status(200).json({
            "success": true,
            "user": user[0]
        });
    } catch (error) {
        res.status(500).json({
            "success": false
        });
    }
};

const getUserByID = async (req, res) => {
    try {
        const id = req.params.userID,
            user = await query(`SELECT userID, userName, avatar FROM Users
                WHERE userID = ${id}`);

        res.status(200).json({
            "success": true,
            "user": user[0]
        });
    } catch (error) {
        res.status(500).json({
            "success": false
        });
    }
};

const logOutUser = (req, res) => {
    // console.log(req.cookies);

    // res.cookie(process.env.COOKIE_NAME, '', {
    //     maxAge: new Date(0)
    // });

    // res.status(200).json({
    //     "success": true
    // });

    console.log("**");
};

export { registerUser, loginUser, setProfilePic, getUsers, getCurrentUser, getUserByID, logOutUser };