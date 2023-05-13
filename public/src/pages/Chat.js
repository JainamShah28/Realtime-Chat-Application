import Contacts from "../components/Contacts.js";
import Welcome from "../components/Welcome.js";
import ChatContainer from "../components/ChatContainer.js";

import Logo from "../assets/logo.svg";

import React from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const [contacts, setContacts] = React.useState([]),
        [currentUser, setCurrentUser] = React.useState({}),
        [currentChat, setCurrentChat] = React.useState(),
        socket = React.useRef();

    React.useEffect(() => {
        try {
            const getContacts = async () => {
                const response = await fetch(`http://localhost:5000/users`, {
                    method: 'GET',
                    credentials: "include"
                }),
                    data = await response.json();

                if (data.success) {
                    setContacts(data.data);
                }
            }

            getContacts();
        } catch (error) {
            console.log(error);
        }
    }, []);

    React.useEffect(() => {
        try {
            const getCurrentUser = async () => {
                const response = await fetch('http://localhost:5000/users/currentUser', {
                    method: 'GET',
                    credentials: "include"
                }),
                    data = await response.json();

                if (data.success) {
                    setCurrentUser(data.user);
                }
            }

            getCurrentUser();
        } catch (error) {
            console.log(error);
        }
    }, []);

    React.useEffect(() => {
        if (currentUser) {
            socket.current = io('http://localhost:5000');
            socket.current.emit("connection");
            socket.current.emit("getUserID", currentUser.userID);
        }
    }, [currentUser]);

    function handleChatChange(chat) {
        setCurrentChat(chat);
    }

    return (
        <div className="chat-page box-border w-screen h-screen bg-[#131324] flex justify-center items-center text-white font-josefin-sans overflow-hidden">
            <div className="chat-container w-[85vw] h-[85vh] bg-[#00000076] box-border rounded-xl">
                <div className="w-full h-full max-h-[85vh] box-border bg-[#080420] left rounded-l-xl">
                    <div className="app-logo box-border flex items-center w-fit h-full mx-auto">
                        <img src={Logo} alt="Logo" className="w-10" />
                        <h1 className="font-bold uppercase text-lg ml-2 md:ml-3">snappy</h1>
                    </div>

                    <Contacts
                        contacts={contacts}
                        currentChat={currentChat}
                        handleChatChange={handleChatChange}
                    />

                    <div className="current-user box-border w-full h-full bg-[#0d0d30] flex justify-center items-center rounded-bl-xl">
                        <img src={currentUser.avatar} alt="Avatar" className="w-14 box-border" />
                        <p className="font-bold text-lg capitalize ml-4">{currentUser.userName}</p>
                    </div>
                </div>

                <>
                    {
                        currentChat ?
                        <ChatContainer currentChat={currentChat} currentUser={currentUser.userID} socket={socket} useNavigate={useNavigate} /> :
                        <Welcome userName={currentUser.userName} />
                    }
                </>
            </div>
        </div>
    )
}

export default Chat;