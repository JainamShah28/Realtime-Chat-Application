import { query } from '../../db/database.js';

const addChat = async (req, res) => {
    try {
        const { sender, reciever, message } = req.body;

        await query(`INSERT INTO Chats(sender, reciever, message)
            VALUES(${sender}, ${reciever}, "${message}")`);

        res.status(200).json({
            "success": true 
        });
    } catch (error) {
        res.status(500).json({
            "success": false 
        });
    }
};

const getChats = async (req, res) => {
    try {
        const users = req.body.users,
            chats = await query(`SELECT * FROM Chats
                WHERE (sender = ${users[0]} AND reciever = ${users[1]}) 
                OR (sender = ${users[1]} AND reciever = ${users[0]})
                ORDER BY curr_time ASC`);

        res.status(200).json({
            "success": true, 
            "messages": chats 
        });
    } catch (error) {
        res.status(500).json({
            "success": false 
        });
    }
};

export { addChat, getChats };