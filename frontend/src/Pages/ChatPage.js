import React, {useState, useContext, useEffect, useCallback,} from 'react';
import ChatContext from "../Context/chat-context";
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { Box } from '@chakra-ui/react';
import { useNavigate,  } from "react-router-dom";
import { useHelper } from '../config/helper-hook';

const ChatPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useContext(ChatContext);

  return (
    <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box d='flex' justifyContent='space-between' width='100%' h='90.5vh' p='12px'>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
    </div>
  )
}

export default ChatPage;


