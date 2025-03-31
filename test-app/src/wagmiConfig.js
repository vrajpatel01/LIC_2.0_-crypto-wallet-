import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, goerli, polygon, optimism, arbitrum } from 'wagmi/chains';

const chains = [mainnet, goerli, polygon, optimism, arbitrum];

export const wagmiConfig = getDefaultConfig({
  appName: 'My Custom Wallet',
  projectId: 'YOUR_PROJECT_ID', // Get one at https://cloud.walletconnect.com
  chains,
  ssr: false // Required for Vite
});
