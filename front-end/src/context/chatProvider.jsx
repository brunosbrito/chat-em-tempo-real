import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import ChatContext from './chatContext';

function ChatProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState([]);
  

  const value = useMemo(() => ({
      loggedUser,
      setLoggedUser
    }),
    [loggedUser, setLoggedUser],
  );
  return (
    <ChatContext.Provider value={ value }>
      {children}
    </ChatContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChatProvider;