import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

export const IsUserAvailable = createContext();

function IsUserAvailableProvider({ children }) {
  const [isUser, setIsUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setIsUser(user);
      } else {
        setIsUser(null);
      }
    });
  }, []);

  return (
    <IsUserAvailable.Provider value={{ isUser, setIsUser }}>
      {children}
    </IsUserAvailable.Provider>
  );
}

export default IsUserAvailableProvider;
