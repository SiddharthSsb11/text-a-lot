import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
//import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
//import { useHelper } from '../config/helper-hook';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ChatContext from "../Context/chat-context";
/* const ENDPOINT = "http://localhost:5000"; // "https://textalot.herokuapp.com"; -> After deployment
var socket, selectedChatCompare; */

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);
  //console.log(selectedChat, "selectedChat in chatBox");
  //const {getSender}=useHelper();


  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  } 

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);

      const { data } = await axios.get( `/api/message/${selectedChat._id}`, config );

      setMessages(data);
      setLoading(false);
      console.log(data, "fetched messsages of the selected chat data");

    } catch (error) {

      console.log(error.message);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {

    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        //setNewMessage("");
        setMessages([...messages, data]);
        console.log(data, "sent message response data");

      } catch (error) {

        console.log(error.message);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    //whwnever selctedChat changes, fetchAllMessages again for new selectedChat._id
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
