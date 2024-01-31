import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { UserContext } from "../../../Context/UserContext";

export const IngredientsDataContext = createContext();

const IngredienstsContext = ({ children }) => {
  const { userId } = useContext(UserContext);
  const user = userId;

  const storedIngredients =
    JSON.parse(sessionStorage.getItem("selectedIngredients")) || [];
  const [selectedIngredients, setSelectedIngredients] =
    useState(storedIngredients);

  // useEffect(() => {
  //   // Save selectedIngredients to session storage whenever it changes
  //   sessionStorage.setItem(
  //     `selectedIngredients_${user}`,
  //     JSON.stringify(selectedIngredients)
  //   );
  // }, []);

  return (
    <IngredientsDataContext.Provider
      value={{ selectedIngredients, setSelectedIngredients }}>
      {children}
    </IngredientsDataContext.Provider>
  );
};

export default IngredienstsContext;
