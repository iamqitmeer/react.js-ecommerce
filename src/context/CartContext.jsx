import React, { createContext, useState } from "react";
import { json } from "react-router-dom";

export let CartContext = createContext();

function CartContextProvider({ children }) {
  let [cart, setCart] = useState(() => {
    let getItemFromLocalStorage = localStorage.getItem("cartProduct")
    if (getItemFromLocalStorage) {
      return JSON.parse(getItemFromLocalStorage)
      
    }else{
      return []
    }
  });

  localStorage.setItem("cartProduct", JSON.stringify(cart))

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContextProvider