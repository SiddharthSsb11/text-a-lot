export const getSender = (loggedUser, users) => {
  //return console.log('id')
  //1on1 chatName
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
  //eye icon ProfileModal
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

//separating user's and sender's text in chatbox
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

//padding between same user's/sender's texts
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

//displaying avatar on sender's last message
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};


