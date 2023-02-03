import React, { useContext } from "react";

export const NavBarContext = React.createContext<any>(null);
export const useNavBarContext = () => useContext(NavBarContext);
