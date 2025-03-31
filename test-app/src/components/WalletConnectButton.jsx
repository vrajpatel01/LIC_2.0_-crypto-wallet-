import { useState } from "react";
import { ethers } from "ethers";

function ConnectCustomWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        console.log("🟢 Custom wallet detected");

        // First, get the chainId
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("🌐 Connected to chain:", chainId);

        // Then, request accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("🔗 Connected accounts:", accounts);

        if (accounts.length > 0) {
          setAccount(accounts[0]);

          // Use ethers.js with custom provider
          const customProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(customProvider);

          const signer = await customProvider.getSigner();
          console.log("👤 Signer:", signer);

          const address = await signer.getAddress();
          console.log("📍 Wallet Address:", address);
          setAccount(address);
        }
      } else {
        alert("Custom Wallet not detected!");
      }
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Custom Wallet</button>
      {account && <p>Connected: {account}</p>}
    </div>
  );
}

export default ConnectCustomWallet;
