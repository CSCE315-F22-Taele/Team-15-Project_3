import { createContext, useContext, useState } from "react";

const UserInfoContext = createContext();
const UserInfoUpdateContext = createContext();
/**
 * Gets the user context for memory
 * @returns user context react context
 */
export function useUserInfo() {
  return useContext(UserInfoContext);
}
/**
 * Gets the user information update
 * @returns user context of info update react context
 */
export function useUserInfoUpdate() {
  return useContext(UserInfoUpdateContext);
}
/**
 * Using the provided children, gets the user info context
 * @param {*} param0 
 * @returns returns the user info context component of the userInfo
 */
export function UserInfoProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  function updateUserInfo(info) {
    setUserInfo(info);
  }

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoUpdateContext.Provider value={updateUserInfo}>
        {children}
      </UserInfoUpdateContext.Provider>
    </UserInfoContext.Provider>
  );
}
