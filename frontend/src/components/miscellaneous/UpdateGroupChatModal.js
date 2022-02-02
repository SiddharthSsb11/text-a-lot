import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext } from "react";
import ChatContext from "../../Context/chat-context";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({  fetchAgain, setFetchAgain, fetchMessages }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);


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

      console.log(data, 'user search response');
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      
      console.log(error.message)  
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { 
          headers: { Authorization: `Bearer ${user.token}`}
        };

      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName, //local state
        },
        config
      );

      console.log(data._id, data, "renaming group chat resposne");
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain); //window.location.reload()
      setRenameLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName(""); //reseting the new name field 
  };

  const handleAddUser = async (userToBeAdded) => {

    if (selectedChat.users.find((existingUser) => existingUser._id === userToBeAdded._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) { //admin is not loggedIn user clause
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}`},
      };

      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );

      setSelectedChat(data);
      console.log(data, 'added user data response');

      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {

      console.log(error.message);

      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (userToBeRemoved) => {

    if (selectedChat.groupAdmin._id !== user._id && userToBeRemoved._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );

      userToBeRemoved._id === user._id ? setSelectedChat() : setSelectedChat(data); 
      //leaveGroup clause //self UserBadgeItem cross

      setFetchAgain(!fetchAgain);
      fetchMessages(); //prop passsed down from singlechat //opt 
      setLoading(false);
    } catch (error) {
        
      console.log(error.message);  
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((selectedSearcheduser) => (
                <UserListItem
                  key={selectedSearcheduser._id}
                  user={selectedSearcheduser}
                  handleFunction={() => handleAddUser(selectedSearcheduser)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;