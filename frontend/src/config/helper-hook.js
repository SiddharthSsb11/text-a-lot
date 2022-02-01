import { useContext} from 'react';
import ChatContext from '../Context/chat-context';


export const useHelper = ()=>{
  
  const {chats, user} = useContext(ChatContext);
  //console.log(chats, 'helper-hook');

  const getSender = (i) => {
    //return console.log('id')
    //1on1 chatName
    /* const personalChat = chats.filter(chat => !chat.isGroupChat);
    console.log(personalChat) */

    const chatName = chats.map((chat)=>{
      return chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name
    });
    //console.log(chatName[i]);
    return chatName[i];
  };

 

  return {getSender,} ;

}