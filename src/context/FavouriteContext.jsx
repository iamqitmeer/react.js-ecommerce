import React, { createContext, useState } from "react";
import { json } from "react-router-dom";

export let FavouriteContext = createContext();

function FavouriteContextProvider({ children }) {
  let [favourite, setFavourite] = useState(() => {
    let getItemFromLocalStorage = localStorage.getItem("FavouriteProduct")
    if (getItemFromLocalStorage) {
      return JSON.parse(getItemFromLocalStorage)
      
    }else{
      return []
    }
  });

  localStorage.setItem("FavouriteProduct", JSON.stringify(favourite))

  return (
    <FavouriteContext.Provider value={{favourite, setFavourite}}>
      {children}
    </FavouriteContext.Provider>
  );
}

export default FavouriteContextProvider