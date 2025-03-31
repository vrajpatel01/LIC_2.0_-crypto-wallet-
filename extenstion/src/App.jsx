import "./App.css";
import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import ethereumLogo from "./ethereumLogo.svg";
import solanaLogo from "./solanaLogo.svg";
import bscLogo from "./bscLogo.svg";
import { Select } from "antd";
import { Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import RecoverAccount from "./components/RecoverAccount";
import WalletView from "./components/WalletView";
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { LogoutOutlined } from "@ant-design/icons";
import { useMainContext } from "./context/useMainContext";

// Add Buffer to window object
window.Buffer = window.Buffer || Buffer;

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1");
  const [addresses, setAddresses] = useState(null);
  const {
    walletAddress,
    // setCurrentChainIcon,
    // currentChainIcon,
    currentBalance,
    // currentChainInfo,
  } = useMainContext();

  // Helper function to determine if a chain is Ethereum-based
  const isEthereumChain = (chain) => {
    return chain === "0x1" || chain === "0xaa36a7" || chain === "0x38"; // Added BSC
  };

  // Load saved state from Chrome storage when extension opens
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const result = await chrome.storage.local.get([
          "wallet",
          "seedPhrase",
          "selectedChain",
          "addresses",
        ]);
        console.log("Loaded state:", result); // Debug log

        // Set each state independently if it exists
        if (result.wallet) setWallet(result.wallet);
        if (result.seedPhrase) setSeedPhrase(result.seedPhrase);
        if (result.selectedChain) setSelectedChain(result.selectedChain);
        if (result.addresses) setAddresses(result.addresses);
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    };

    loadSavedState();
  }, []);

  // Save state to Chrome storage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      // Only save if we have either a wallet or seedPhrase
      if (wallet || seedPhrase) {
        try {
          const stateToSave = {
            wallet,
            seedPhrase,
            selectedChain,
            addresses,
          };
          console.log("Saving state:", stateToSave); // Debug log
          await chrome.storage.local.set(stateToSave);
        } catch (error) {
          console.error("Error saving state:", error);
        }
      }
    };

    saveState();
  }, [wallet, seedPhrase, selectedChain, addresses]);

  // When seed phrase changes, generate both addresses
  useEffect(() => {
    if (seedPhrase) {
      try {
        // Generate Ethereum address
        const ethWallet = ethers.Wallet.fromPhrase(seedPhrase);
        const ethAddress = ethWallet.address;

        // Generate Solana address
        const seed = bip39.mnemonicToSeedSync(seedPhrase);
        // Use first 32 bytes of the seed for Solana
        const solanaKeypair = Keypair.fromSeed(seed.slice(0, 32));
        const solanaAddress = solanaKeypair.publicKey.toString();

        // Store both addresses
        setAddresses({
          ethereum: ethAddress,
          solana: solanaAddress,
        });

        // Set current wallet based on selected chain
        setWallet(isEthereumChain(selectedChain) ? ethAddress : solanaAddress);
      } catch (error) {
        console.error("Error generating addresses:", error);
      }
    }
  }, [seedPhrase, selectedChain]);

  const getLogo = () => {
    switch (selectedChain) {
      case "solana":
        return solanaLogo;
      case "0x38":
        return bscLogo;
      default:
        return ethereumLogo;
    }
  };

  const handleChainChange = (newChain) => {
    setSelectedChain(newChain);

    if (addresses) {
      // Use the appropriate address for the selected chain
      setWallet(
        isEthereumChain(newChain) ? addresses.ethereum : addresses.solana
      );
    }
  };

  // Function to clear storage and state on logout
  const handleLogout = async (navigate) => {
    try {
      await chrome.storage.local.clear();
      setSeedPhrase(null);
      setWallet(null);
      setAddresses(null);
      // Navigate to home page after logout
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const options = [
    {
      label: "Ethereum",
      value: "0x1",
    },
    {
      label: "Binance Smart Chain",
      value: "0x38",
    },
    {
      label: "Solana",
      value: "solana",
    },
    {
      label: "Sepolia Testnet",
      value: "0xaa36a7",
    },
  ];

  const copy = () => {
    navigator.clipboard.writeText(walletAddress);
  };
  console.log("walletAddress", currentBalance);

  return (
    <div className="App">
      <header className="flex justify-between items-center p-3 w-full">
        <Select
          onChange={handleChainChange}
          value={selectedChain}
          options={options}
          className="homeSelect"
        ></Select>
        <div className="gap-2 flex justify-center items-center">
          <div onClick={copy} className="w-[100px] truncate cursor-pointer">
            {/* {walletAddress ?? ""} */}
          </div>
          <LogoutOutlined />
        </div>
      </header>
      <div className="flex justify-center items-center max-w-[100px] mt-10 space-x-2">
        <img
          src={getLogo()}
          className="headerLogo w-auto h-[80px]"
          alt="chain logo"
        />
        {/* <h1 className="font-bold text-3xl">{currentBalance}</h1> */}
      </div>
      <HashRouter>
        {wallet && seedPhrase ? (
          <Routes>
            <Route path="/" element={<Navigate to="/yourwallet" replace />} />
            <Route
              path="/yourwallet"
              element={
                <WalletView
                  wallet={wallet}
                  setWallet={setWallet}
                  seedPhrase={seedPhrase}
                  setSeedPhrase={setSeedPhrase}
                  selectedChain={selectedChain}
                  addresses={addresses}
                  onLogout={handleLogout}
                />
              }
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/recover"
              element={
                <RecoverAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  selectedChain={selectedChain}
                />
              }
            />
            <Route
              path="/yourwallet"
              element={
                <CreateAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  selectedChain={selectedChain}
                />
              }
            />
          </Routes>
        )}
      </HashRouter>
    </div>
  );
}

export default App;
