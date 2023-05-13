import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { query } from '../db/database.js';

const LocalStrategy = passportLocal.Strategy;

passport.use('local', new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
    session: false
}, async (userName, password, callback) => {
    try {
        const user = await query(`SELECT * FROM Users
        WHERE userName = "${userName}"`);

        if (user.length === 0) {
            return callback(null, false, { message: "Incorrect username or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user[0].pass_word);

        if (!isValidPassword) {
            return callback(null, false, { message: "Incorrect username or password" });
        }

        return callback(null, user[0]);
    } catch (error) {
        throw error;
    }
}));