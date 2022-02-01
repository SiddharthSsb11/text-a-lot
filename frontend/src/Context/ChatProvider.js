import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import ChatContext from './chat-context';

const ChatProvider = (props) => {

    const [user, setUser] =useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInformation = JSON.parse(localStorage.getItem("userInformation"));
        setUser(userInformation);
    
        if (!userInformation) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);
    
    //console.log(chats, 'chats context')
    return (
        <div>
            <ChatContext.Provider value = {{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}> 
                {props.children}
            </ChatContext.Provider>        
        </div>
    )
}

export default ChatProvider;