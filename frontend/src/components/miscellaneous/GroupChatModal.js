import React, { useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import ChatContext from "../../Context/chat-context";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = useContext(ChatContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();  
  

  const selectedGroupHandler = (userToAdd) => {
    
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}`}
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data, 'users search response from server');
      
      setLoading(false);
      setSearchResult(data);

    } catch (error) {

      console.error(error.message);  
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== delUser._id));
  };

  const submitHandler = async () => {

    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {/* "Content-type": "application/json", */ Authorization: `Bearer ${user.token}`}//already body jsonType
      };
      
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((selectedUser) => selectedUser._id)), 
          //server side req.body accepts stringify array of user id
        },
        config
      );

      setChats([data, ...chats]); //recently created chat first
      console.log(data, 'group chat added/created respopnse');
      onClose(); //modal close on success

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

    } catch (error) {
      
      console.error(error.message);  
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <React.Fragment>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Kohli, Ganguli, Dhoni"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((selectedUser) => (
                <UserBadgeItem
                  key={selectedUser._id}
                  user={selectedUser}
                  handleFunction={() => handleDelete(selectedUser)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : ( //top 4 results
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => selectedGroupHandler(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={submitHandler} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default GroupChatModal;
