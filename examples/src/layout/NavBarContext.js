import React, { useContext } from 'react';

export const NavBarContext = React.createContext(null);
export const useNavBarContext = () => useContext(NavBarContext);
