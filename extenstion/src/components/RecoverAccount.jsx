import React from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
// import bs58 from 'bs58';
import * as bip39 from "bip39";
// import { derivePath } from "ed25519-hd-key";

function RecoverAccount({ setWallet, setSeedPhrase, selectedChain }) {
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function seedRecovery() {
    setError("");
    try {
      // Trim whitespace and normalize the phrase
      const normalizedPhrase = phrase.trim().toLowerCase();

      // First try to validate as an Ethereum wallet
      try {
        const wallet = ethers.Wallet.fromPhrase(normalizedPhrase);
        setSeedPhrase(normalizedPhrase);

        if (selectedChain === "solana") {
          // Generate Solana wallet from seed phrase
          const seed = bip39.mnemonicToSeedSync(normalizedPhrase);
          // Use first 32 bytes of the seed for Solana
          const keypair = Keypair.fromSeed(seed.slice(0, 32));
          setWallet(keypair.publicKey.toString());
        } else {
          // Set Ethereum wallet - same address works for all Ethereum networks
          setWallet(wallet.address);
        }
        navigate("/yourwallet");
      } catch (e) {
        console.error("Recovery error:", e);
        setError(
          "Invalid seed phrase. Please make sure it's 12 words from the BIP39 wordlist."
        );
      }
    } catch (error) {
      console.error("Recovery error:", error);
      setError("Error recovering wallet: " + error.message);
    }
  }

  return (
    <>
      <div className="content mt-10 flex flex-col justify-end items-center h-full w-full gap-5">
        {/* <div className="mnemonic">
          <Input.TextArea
            placeholder="Enter your 12-word seed phrase (words separated by spaces)"
            onChange={(e) => setPhrase(e.target.value)}
            rows={3}
            style={{ marginBottom: "10px" }}
          />
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <div
            style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
          >
            <p>
              Enter your 12-word seed phrase to recover your wallet across all
              networks.
            </p>
            <p>
              {selectedChain === "solana"
                ? "This will recover your Solana address. The same seed phrase can also recover your Ethereum address on other networks."
                : "This will recover your Ethereum address (works across all Ethereum networks). The same seed phrase can also recover your Solana address."}
            </p>
          </div>
        </div> */}
        <div className="mnemonic">
          <Input.TextArea
            className="!bg-gray-800 !border-gray-900 !text-white placeholder:!text-gray-500"
            placeholder={
              selectedChain === "solana"
                ? "Enter your Solana private key"
                : "Enter your 12-word seed phrase"
            }
            onChange={(e) => setPhrase(e.target.value)}
            rows={3}
            style={{ marginBottom: "10px" }}
          />
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <div
            style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
          >
            {selectedChain === "solana"
              ? "Enter your Solana private key to recover your wallet."
              : "Enter your 12 words in the correct order, separated by spaces."}
          </div>
        </div>
        {/* <Button
          className="frontPageButton"
          type="primary"
          onClick={() => seedRecovery()}
          disabled={!phrase.trim()}
        >
          Recover Wallet
        </Button>
        <p className="frontPageBottom" onClick={() => navigate("/")}>
          Back Home
        </p> */}
        <div className="space-y-2">
          <Button
            className="frontPageButton !bg-white hover:!bg-blue-600 hover:!text-white !text-blue-600 !font-bold w-full !py-5 !rounded-full !border-none"
            type="primary"
            onClick={() => seedRecovery()}
            disabled={!phrase.trim()}
          >
            Recover Wallet
          </Button>
          <p
            className="frontPageBottom cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Back Home
          </p>
        </div>
      </div>
    </>
  );
}

export default RecoverAccount;
