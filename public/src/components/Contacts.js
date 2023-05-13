function Contacts({ contacts, currentChat, handleChatChange }) {
    return (
        <div className="contacts-container w-full h-full box-border overflow-y-auto flex flex-col gap-y-4 px-4">
            {
                contacts.map((contact, index) => {
                    const id = contact.userID;
                    return (
                        <div className={`contact box-border flex items-center rounded-md py-2 px-4 cursor-pointer transition-all duration-300 ease-linear ${currentChat && contact.userID === currentChat ? "bg-[#997af0]" : "bg-[#ffffff39] hover:bg-[#f8eeee1f]"}`} key={index} id={id} onClick={() => handleChatChange(id)}>
                            <img src={contact.avatar} alt="Avatar" className="w-12 box-border" />
                            <p className="capitalize box-border ml-4 font-bold">{contact.userName}</p>
                        </div>
                    );
                })  
            }
        </div>
    );
}

export default Contacts; 