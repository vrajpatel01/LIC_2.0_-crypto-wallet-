const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL,
  ticker: "ETH",
};

const Solana = {
  hex: "solana",
  name: "Solana",
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  ticker: "SOL",
};

const SepoliaTestnet = {
  hex: "0xaa36a7",
  name: "Sepolia Testnet",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
  ticker: "SepoliaETH",
};

const BSC = {
  hex: "0x38",
  name: "Binance Smart Chain",
  rpcUrl: import.meta.env.VITE_BSC_RPC_URL,
  ticker: "BNB",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "solana": Solana,
  "0xaa36a7": SepoliaTestnet,
  "0x38": BSC,
};
