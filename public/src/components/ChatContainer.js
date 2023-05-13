import React from 'react';

import { FaPowerOff } from "react-icons/fa";

import ChatInput from './ChatInput.js';
import Messages from './Messages.js';

function ChatContainer({ currentChat, currentUser, socket, useNavigate }) {
    const [user, setUser] = React.useState({}),
        [messages, setMessages] = React.useState([]),
        [arrivalMessage, setArrivalMessage] = React.useState(),
        navigate = useNavigate();

    React.useEffect(() => {
        try {
            const getUser = async () => {
                const response = await fetch(`http://localhost:5000/users/${currentChat}`),
                    data = await response.json();

                if (data.success) {
                    setUser(data.user);
                }
            };

            getUser();
        } catch (error) {
            console.log(error);
        }
    }, [currentChat]);

    React.useEffect(() => {
        try {
            const getMessages = async () => {
                if (currentChat && currentUser) {
                    const getChats = await fetch(`http://localhost:5000/chats/getChats`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "users": [currentUser, currentChat]
                        })
                    }),
                        chats = await getChats.json();

                    if (chats.success) {
                        setMessages(chats.messages);
                    }
                }
            };

            getMessages();
        } catch (error) {
            console.log(error);
        }
    }, [currentChat]);

    async function sendMessage(message) {
        try {
            const response = await fetch(`http://localhost:5000/chats`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "sender": currentUser,
                    "reciever": currentChat,
                    "message": message
                }),
            });

            socket.current.emit("sendMessage", {
                from: currentUser,
                to: currentChat,
                message: message
            });

            setMessages(prevMessages => [...prevMessages, {
                sender: currentUser,
                reciever: currentChat,
                message: message
            }]);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        if (socket.current) {
            socket.current.on("recieveMessage", (message) => {
                setArrivalMessage({
                    sender: currentChat,
                    reciever: currentUser,
                    message: message
                });
            });
        }
    }, []);

    React.useEffect(() => {
        arrivalMessage && setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }, [arrivalMessage]);

    async function logOutUser() {
        try {
            const response = await fetch(`http://localhost:5000/users/logout`, {
                method: 'GET',
                credentials: "include"
            });

            // if (response.ok) {
            //     navigate('/login');
            // } 
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="chat box-border w-full h-[85vh] flex flex-col justify-between items-center rounded-br-xl">
            <div className="chat-header box-border w-full h-[10%] flex items-center justify-between px-6 py-2">
                <div className="user-details flex items-center">
                    <img src={user.avatar} alt="Avatar" className="w-12" />
                    <h3 className="font-bold capitalize ml-5 text-lg">{user.userName}</h3>
                </div>

                <button className="btnLogOut bg-[#997af0] hover:bg-[#4e0eff] p-2 rounded-xl" onClick={logOutUser}>
                    <FaPowerOff />
                </button>
            </div>

            <Messages messages={messages} currentUser={currentUser} />

            <ChatInput sendMessage={sendMessage} />
        </div>
    );
}

export default ChatContainer;