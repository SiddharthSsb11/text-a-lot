import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "../../Context/chat-context";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Input, Spinner } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);

  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInformation");
    navigate("/");
  };

  const handleSearch = async() => {

    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}`}
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data, 'searchQuerry keyword response data');

      setLoading(false);
      setSearchResult(data);

    } catch (error) {

      console.log(error.message);
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


  

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      console.log(data, 'access chat response data')
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //already existing check clause

      setSelectedChat(data);
      setLoadingChat(false);
      onClose(); //drawer close afterwards
    } catch (error) {

      console.log(error.message);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <React.Fragment>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderColor="blue.600"
        bg="cyan.300"
        color="black"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" bg ='blue.500' onClick={onOpen} 
            _hover={{ background: "purple.400" }} _active={{ background: "purple.400" }}>
              <i className="fas fa-search"></i>
              <Text d={{ base: "none", md: "flex" }} px={4} fontWeight="bold">
                Search User
              </Text>
          </Button>
        </Tooltip>

        <Text fontSize="3xl" fontFamily="Work sans bold" fontWeight='bold' color="blue.700" >
          Text-A-Lot
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} color="blue.600"/>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="blue.600"  rightIcon={<ChevronDownIcon />}  
              _hover={{ background: "purple.500" }} _active={{ background: "purple.500" }}>
              <Avatar size="sm" cursor="pointer" name={user.name} borderColor="black" borderWidth="2px" bg="yellow.400" color="black"/>
            </MenuButton>
            <MenuList bg = "purple.500" borderColor="black" borderWidth="2px">
              <ProfileModal user={user}>
                <MenuItem fontWeight="bold" color="black" _hover={{background: "yellow.400"}} >
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider/>
              <MenuItem fontWeight="bold" color="black" onClick={logoutHandler} _hover={{background: "yellow.400"}}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => ( //user clicked on for chat
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )} 
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default SideDrawer;
