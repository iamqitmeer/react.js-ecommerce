import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

// Create Context
export const IsUserDataAvailable = createContext();

function IsUserDataAvailableProvider({ children }) {
  const [userData, setUserData] = useState(null); // Holds user data
  const [loading, setLoading] = useState(true); // Indicates loading state

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserData = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Monitor authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // Log user state
      if (user) {
        fetchUserData(user.uid);
      } else {
        // User is signed out
        setUserData(null);
        setLoading(false);
      }
    });

    // Cleanup function to unsubscribe from auth state changes
    return () => unsubscribe();
  }, []);

  // Provide user data and loading state to the rest of the app
  return (
    <IsUserDataAvailable.Provider value={{ userData, loading, setUserData }}>
      {children}
    </IsUserDataAvailable.Provider>
  );
}

export default IsUserDataAvailableProvider;
