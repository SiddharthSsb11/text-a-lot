import React, {useContext} from 'react';
import ChatContext from "../Context/chat-context";
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { Box } from '@chakra-ui/react';

const ChatPage = () => {

  const { user } = useContext(ChatContext);

  return (
    <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box d='flex' justifyContent='space-between' width='100%' h='91.5vh' p='12px'>
          {user && <MyChats/>}
          {user && <ChatBox/>}
        </Box>
    </div>
  )
}

export default ChatPage;


