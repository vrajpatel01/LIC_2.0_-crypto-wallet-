import React, { useEffect, useState } from "react";
import {
  Divider,
  Tooltip,
  List,
  Avatar,
  Spin,
  Tabs,
  Input,
  Button,
  message,
} from "antd";
import { LogoutOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import { useMainContext } from "../context/useMainContext";

// Helper function to truncate address
const truncateAddress = (address) => {
  if (!address) return "";
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

// Reusable component for copyable address
const CopyableAddress = ({ address, label }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      message.success("Address copied to clipboard!");
    } catch (err) {
      console.log(err);
      message.error("Failed to copy address");
    }
  };

  return (
    <div style={{ marginTop: "5px" }}>
      <strong>{label}</strong>{" "}
      <Tooltip title="Click to copy full address">
        <span
          onClick={copyToClipboard}
          style={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {truncateAddress(address)}
          <CopyOutlined style={{ fontSize: "14px" }} />
        </span>
      </Tooltip>
    </div>
  );
};

function WalletView({
  wallet,
  // setWallet,
  seedPhrase,
  // setSeedPhrase,
  selectedChain,
  addresses,
  onLogout,
}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const { setCurrentBalance } = useMainContext();

  // Get current chain config or default to Ethereum
  const currentChain = CHAINS_CONFIG[selectedChain || "0x1"];

  const items = [
    {
      key: "3",
      label: `Tokens`,
      children: (
        <>
          {tokens ? (
            <>
              <List
                bordered
                className="tokenList"
                itemLayout="horizontal"
                dataSource={tokens}
                renderItem={(item) => (
                  <List.Item
                    className="tokenName"
                    style={{ textAlign: "left" }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo || logo} />}
                      title={item.symbol}
                      description={item.name}
                    />
                    <div className="tokenAmount">
                      {(
                        Number(item.balance) /
                        10 ** Number(item.decimals)
                      ).toFixed(3)}{" "}
                      Tokens
                    </div>
                  </List.Item>
                )}
              />
            </>
          ) : (
            <>
              <span>You seem to not have any tokens yet</span>
            </>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: `NFTs`,
      children: (
        <>
          {nfts ? (
            <>
              {nfts.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e && <img className="nftImage" alt="nftImage" src={e} />}
                  </React.Fragment>
                );
              })}
            </>
          ) : (
            <>
              <span>You seem to not have any NFTs yet</span>
            </>
          )}
        </>
      ),
    },
    {
      key: "1",
      label: `Transfer`,
      children: (
        <>
          {/* <h3>Native Balance </h3>
          <h1>
            {balance.toFixed(3)} {currentChain?.ticker || "ETH"}
          </h1> */}
          <div className="space-y-3">
            <div className="sendRow">
              <p style={{ width: "90px", textAlign: "left" }}> To:</p>
              <Input
                className="!bg-gray-800 !border-gray-900 !text-gray-300 placeholder:!text-gray-500"
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                placeholder={
                  selectedChain === "solana" ? "Solana address..." : "0x..."
                }
              />
            </div>
            <div className="sendRow">
              <p style={{ width: "90px", textAlign: "left" }}> Amount:</p>
              <Input
                className="!bg-gray-800 !border-gray-900 !text-gray-300 placeholder:!text-gray-500"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                placeholder={`Amount in ${currentChain?.ticker || "ETH"}...`}
              />
            </div>
            <Button
              style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
              type="primary"
              onClick={() => sendTransaction(sendToAddress, amountToSend)}
              disabled={!selectedChain}
            >
              Send Tokens
            </Button>
          </div>
          {processing && (
            <>
              <Spin />
              {hash && (
                <Tooltip title={hash}>
                  <p>Hover For Tx Hash</p>
                </Tooltip>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  async function sendTransaction(to, amount) {
    if (!selectedChain) {
      message.error("Please select a chain first");
      return;
    }

    if (!currentChain) {
      message.error("Invalid chain selected");
      return;
    }

    if (!to || !amount) {
      message.error("Please provide both address and amount");
      return;
    }

    if (selectedChain === "solana") {
      message.info("Solana transfers are view-only in this version");
      return;
    }

    setProcessing(true);
    try {
      // For both Ethereum and BSC networks
      const provider = new ethers.JsonRpcProvider(currentChain.rpcUrl);
      const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
      const wallet = new ethers.Wallet(privateKey, provider);

      const tx = {
        to: to,
        value: ethers.parseEther(amount.toString()),
      };

      // For BSC, we might need to adjust gas settings
      if (selectedChain === "0x38") {
        const gasPrice = await provider.getFeeData();
        tx.gasPrice = gasPrice.gasPrice;
      }

      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        message.success("Transaction successful!");
        getAccountTokens();
      } else {
        message.error("Transaction failed");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      message.error(err.message || "Transaction failed");
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  async function getAccountTokens() {
    if (!wallet || !selectedChain) return;

    setFetching(true);
    try {
      // Handle Solana differently since it doesn't use Moralis
      if (selectedChain === "solana") {
        // For Solana, we'll just show the SOL balance for now
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}getTokens`,
          {
            params: {
              userAddress: wallet,
              chain: selectedChain,
            },
          }
        );

        if (response.data) {
          setTokens([]); // Empty array for now since we're not fetching SPL tokens
          setNfts([]); // Empty array for now since we're not fetching Solana NFTs
          setBalance(response.data.balance);
          setCurrentBalance(response.data.balance);
        }
      } else {
        // For Ethereum and BSC networks
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}getTokens`,
          {
            params: {
              userAddress: addresses.ethereum, // Use Ethereum address format for both ETH and BSC
              chain: selectedChain,
            },
          }
        );

        if (response.data) {
          setTokens(response.data.tokens);
          setNfts(response.data.nfts);
          setBalance(response.data.balance);
        }
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      message.error("Failed to fetch wallet data");
      setTokens(null);
      setNfts(null);
      setBalance(0);
    } finally {
      setFetching(false);
    }
  }

  // function logout() {
  //   onLogout();
  //   navigate("/");
  // }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [wallet, selectedChain]);

  if (!wallet) {
    return null;
  }

  return (
    <>
      <div className="content mt-5 w-full p-5">
        <LogoutOutlined
          className="logoutButton"
          onClick={() => onLogout(navigate)}
        />
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="walletName">Wallet</div>
            <Tooltip title="Click to copy address">
              <div
                className="walletAddress"
                onClick={() => {
                  navigator.clipboard.writeText(wallet);
                  message.success("Address copied to clipboard!");
                }}
                style={{ cursor: "pointer" }}
              >
                {truncateAddress(wallet)}
              </div>
            </Tooltip>
          </div>

          {addresses && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
              <div>Your wallet addresses:</div>
              <CopyableAddress
                label="Ethereum (all networks):"
                address={addresses.ethereum}
              />
              <CopyableAddress label="Solana:" address={addresses.solana} />
            </div>
          )}

          <div className="space-y-1">
            <h3>Native Balance </h3>
            <h1 className="text-3xl font-bold">
              {balance.toFixed(3)} {currentChain?.ticker || "ETH"}
            </h1>
          </div>
        </div>
        {/* <Divider className="bg-white" /> */}

        {fetching ? (
          <Spin />
        ) : (
          <Tabs
            defaultActiveKey="1"
            items={items}
            className="walletView !text-white !mt-5"
          />
        )}
      </div>
    </>
  );
}

export default WalletView;
