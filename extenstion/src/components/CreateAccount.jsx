import React from "react";
import { Button, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
// import bs58 from "bs58";
import * as bip39 from "bip39";
// import { derivePath } from "ed25519-hd-key";

function CreateAccount({ setWallet, setSeedPhrase, selectedChain }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();

  function generateWallet() {
    try {
      // Generate a single seed phrase for both Ethereum and Solana
      const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      // Normalize the mnemonic
      const normalizedMnemonic = mnemonic.trim().toLowerCase();
      console.log("Generated mnemonic:", normalizedMnemonic);
      setNewSeedPhrase(normalizedMnemonic);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  }

  function setWalletAndMnemonic() {
    try {
      if (!newSeedPhrase) {
        console.error("No seed phrase provided");
        return;
      }

      setSeedPhrase(newSeedPhrase);

      if (selectedChain === "solana") {
        // Generate Solana wallet from the same seed phrase
        const seed = bip39.mnemonicToSeedSync(newSeedPhrase);
        // Use first 32 bytes of the seed for Solana
        const keypair = Keypair.fromSeed(seed.slice(0, 32));
        setWallet(keypair.publicKey.toString());
      } else {
        // Set Ethereum wallet from the same seed phrase - works for all Ethereum networks
        const wallet = ethers.Wallet.fromPhrase(newSeedPhrase);
        setWallet(wallet.address);
      }
      navigate("/yourwallet");
    } catch (error) {
      console.error("Error setting wallet:", error);
    }
  }

  return (
    <>
      <div className="content p-3 flex flex-col justify-between min-h-[400px] h-full gap-5">
        {/* <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            <p>
              Once you generate the seed phrase, save it securely. This single seed phrase will create your wallet that works across all networks.
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              {selectedChain === 'solana' 
                ? "Your Solana address will be different from your Ethereum address due to different network requirements, but they're part of the same wallet."
                : "This address will work across all Ethereum networks (Mainnet, Sepolia, etc). Your Solana address will be different but controlled by the same seed phrase."}
            </p>
          </div>
        </div> */}
        <div className="mnemonic mt-10">
          <ExclamationCircleOutlined
            className="mt-1"
            style={{ fontSize: "22px" }}
          />
          <div>
            <p>
              {selectedChain === "solana"
                ? "Generate a new Solana wallet. Save the private key securely."
                : "Generate a new Ethereum wallet. Save the seed phrase securely."}
            </p>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
              {selectedChain === "solana"
                ? "This will create your Solana wallet with a unique address."
                : "This address will work across all Ethereum networks (Mainnet, Sepolia, etc)."}
            </p>
          </div>
        </div>
        {newSeedPhrase && (
          <Card className="seedPhraseContainer !bg-gray-800 !border-gray-900">
            {newSeedPhrase && (
              <>
                <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>
                  {newSeedPhrase}
                </pre>
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}
                >
                  <p>
                    Make sure to save these 12 words in the exact order shown
                    above.
                  </p>
                  <p>
                    This seed phrase controls all your addresses across
                    different networks.
                  </p>
                </div>
              </>
            )}
          </Card>
        )}
        {/* <Button
          className="frontPageButton"
          type="primary"
          onClick={() => generateWallet()}
        >
          Generate Seed Phrase
        </Button>

        <Button
          className="frontPageButton"
          type="default"
          onClick={() => setWalletAndMnemonic()}
          disabled={!newSeedPhrase}
        >
          Open Your New Wallet
        </Button>
        <p className="frontPageBottom" onClick={() => navigate("/")}>
          Back Home
        </p> */}
        <div className="flex flex-col space-y-5 w-full mb-5">
          {/* code generate button */}
          <Button
            className="frontPageButton frontPageButton !bg-blue-600 hover:!bg-white hover:!text-blue-600 !text-white !font-bold w-full !py-5 !rounded-full !border-none"
            type="primary"
            onClick={() => generateWallet()}
          >
            {selectedChain === "solana"
              ? "Generate Solana Wallet"
              : "Generate Seed Phrase"}
          </Button>
          <div className="grid grid-cols-2 gap-2 justify-center items-center">
            <p
              className="frontPageBottom cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Back Home
            </p>
            <Button
              className="frontPageButton !bg-white hover:!bg-blue-600 hover:!text-white !text-blue-600 !font-bold w-full !py-5 !rounded-full !border-none"
              type="default"
              onClick={() => setWalletAndMnemonic()}
              disabled={!newSeedPhrase}
            >
              Open Your New Wallet
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;
