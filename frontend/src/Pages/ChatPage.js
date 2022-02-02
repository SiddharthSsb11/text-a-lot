import React, { useState, useContext} from "react";
import ChatContext from "../Context/chat-context";
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { Box } from '@chakra-ui/react';


const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useContext(ChatContext);

  /*  const navigate = useNavigate();
  const isRefreshingRef = useIsRefreshingRef() */

  //navigate('/chats');

  return (
    <div style={{ width: "100%" }}>
     
          {user && <SideDrawer />}
          <Box d="flex" justifyContent="space-between" width="100%" h="90.5vh" p="12px">
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && ( <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
          </Box>
      
    </div>
  );
};

export default ChatPage;
