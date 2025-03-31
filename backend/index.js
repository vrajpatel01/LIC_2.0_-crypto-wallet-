import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Moralis from 'moralis';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Solana connection
const solanaConnection = new Connection(process.env.SOLANA_RPC_URL || 'https://solana-devnet.g.alchemy.com/v2/xGOe71UEWL65ebXRvgj-MkL51ONfefTg');

// Update chain mapping helper to return Moralis chain IDs
const getChainName = (chainId) => {
  // Map hex chain IDs to Moralis chain IDs
  const chainMap = {
    '0x1': '0x1',      // Ethereum Mainnet
    '0x89': '0x89',    // Polygon Mainnet
    'solana': 'solana', // Solana Mainnet
    '0x38': '0x38',    // BSC Mainnet
    '0xaa36a7': '0xaa36a7' // Sepolia Testnet
  };

  if (!chainMap[chainId]) {
    console.warn(`Unknown chain ID: ${chainId}, defaulting to Ethereum Mainnet`);
    return '0x1';
  }

  return chainMap[chainId];
};

const isSolanaAddress = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

app.get('/getTokens', async (req, res) => {
  try {
    const { userAddress, chain } = req.query;
    
    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    if (!chain) {
      return res.status(400).json({ error: 'Chain ID is required' });
    }

    const chainId = getChainName(chain);
    console.log(`Fetching tokens for address ${userAddress} on chain ${chainId}`);

    try {
      if (chainId === 'solana') {
        // Validate Solana address
        if (!isSolanaAddress(userAddress)) {
          return res.status(400).json({
            error: 'Invalid address format',
            message: 'Please provide a valid Solana address'
          });
        }

        // Get Solana account data
        const publicKey = new PublicKey(userAddress);
        const balance = await solanaConnection.getBalance(publicKey);

        // For now, return a simplified response for Solana
        const jsonResponse = {
          tokens: [], // Token list would require SPL token program integration
          nfts: [],  // NFT list would require Metaplex integration
          balance: balance / LAMPORTS_PER_SOL, // Convert lamports to SOL
          chain: 'solana'
        };

        return res.json(jsonResponse);
      } else {
        // Validate Ethereum address
        if (!userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
          return res.status(400).json({
            error: 'Invalid address format',
            message: 'Please provide a valid Ethereum address'
          });
        }

        // Handle EVM chains
        const [tokens, nfts, balance] = await Promise.all([
          Moralis.EvmApi.token.getWalletTokenBalances({
            chain: chainId,
            address: userAddress,
          }),
          Moralis.EvmApi.nft.getWalletNFTs({
            chain: chainId,
            address: userAddress,
            mediaItems: true,
          }),
          Moralis.EvmApi.balance.getNativeBalance({
            chain: chainId,
            address: userAddress
          })
        ]);

        const myNfts = nfts.raw.result
          .filter(e => e?.media?.media_collection?.high?.url && !e.possible_spam && e?.media?.category !== "video")
          .map(e => e.media.media_collection.high.url);

        const jsonResponse = {
          tokens: tokens.raw,
          nfts: myNfts,
          balance: balance.raw.balance / (10 ** 18),
          chain: chainId
        };

        return res.json(jsonResponse);
      }
    } catch (apiError) {
      console.error('API Error:', {
        message: apiError.message,
        details: apiError.details,
        stack: apiError.stack,
        response: apiError.response?.data
      });
      
      return res.status(500).json({
        error: 'API Error',
        message: apiError.message,
        details: apiError.details,
        response: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('Error in /getTokens:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
});

// Initialize Moralis and start server
Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
