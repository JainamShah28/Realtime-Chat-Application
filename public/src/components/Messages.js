import React from 'react';

function Messages({ messages, currentUser }) {
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [messages]);

    return (
        <div className="messages box-border w-full h-[70%] overflow-y-auto flex flex-col gap-4 px-6 py-4">
            {
                messages.map((message, index) => {
                    return (
                        <div className={`message ${message.sender === currentUser ? "sender" : "reciever"}`} key={index}>
                            {message.message}
                            <div ref={messagesEndRef} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages;