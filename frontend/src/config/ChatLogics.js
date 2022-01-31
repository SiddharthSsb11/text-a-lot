export const getSender = (loggedUser, users) => {
  //return console.log('id')
  //1on1 chatName
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
  //eye icon ProfileModal
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};