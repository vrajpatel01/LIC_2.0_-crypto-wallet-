import { createContext, useContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentChainIcon, setCurrentChainIcon] = useState(null);
  const [currentChainInfo, setCurrentChainInfo] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  return (
    <MainContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        currentChainIcon,
        setCurrentChainIcon,
        currentChainInfo,
        setCurrentChainInfo,
        currentBalance,
        setCurrentBalance,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMainContext = () => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }

  return context;
};
