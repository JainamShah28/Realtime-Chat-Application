import { MdSend, MdSentimentSatisfiedAlt } from 'react-icons/md';
import React from 'react';
import Picker from 'emoji-picker-react';

function ChatInput({ sendMessage }) {
    const [message, setMessage] = React.useState(''),
        [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

    function handleChange(event) {
        setMessage(event.target.value);
    }

    function handleEmojiPickerVisibility() {
        setShowEmojiPicker(prev => !prev);
    }

    function appendEmoji(event, emojiObject) {
       let msg = message + emojiObject.emoji;
       setMessage(msg);
    }

    function handleClick() {
        if (message.length !== 0) {
            sendMessage(message);
            setMessage('');
        }
    }

    return (
        <div className="chat-input w-full h-[10%] box-border flex justify-between items-center bg-[#080420] py-2 rounded-br-xl">
            <div className="emoji-picker box-border relative w-[5%] flex justify-center items-center cursor-pointer" onClick={handleEmojiPickerVisibility}>
                <MdSentimentSatisfiedAlt size="28px" color="#ffff00c8" />

                {
                    showEmojiPicker &&
                    <div className="box-border absolute top-[-350px] left-4">
                        <Picker
                            onEmojiClick={appendEmoji}
                        />
                    </div>
                }
            </div>

            <div className="input-container box-border flex justify-between items-center w-[95%] bg-[#ffffff34] rounded-xl pl-4 mr-2">
                <input type="text" onChange={handleChange} value={message} placeholder="Type your message here" className="box-border w-[93%] bg-transparent focus:outline-none focus:border-none" autoComplete='off' autoFocus={true} />

                <div className="btnSend box-border btn-primary w-[7%] py-2 flex justify-center items-center rounded-xl cursor-pointer" onClick={handleClick}>
                    <MdSend size="20px" />
                </div>
            </div>
        </div>
    )
}

export default ChatInput;