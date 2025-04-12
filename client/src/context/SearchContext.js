import { createContext, useReducer, useEffect } from "react";

const INITIAL_STATE = {
  dates: JSON.parse(localStorage.getItem("dates")) || [], // Load from localStorage
  options: JSON.parse(localStorage.getItem("options")) || { room: 1 },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(state.dates));
    localStorage.setItem("options", JSON.stringify(state.options));
  }, [state.dates, state.options]);

  return (
    <SearchContext.Provider
      value={{
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
