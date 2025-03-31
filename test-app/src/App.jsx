import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "./wagmiConfig";
import WalletConnectButton from "./components/WalletConnectButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
       <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="App">
            <h1>My Custom Wallet</h1>
          <WalletConnectButton />
        </div>
      </RainbowKitProvider>
       </QueryClientProvider>
   </WagmiProvider>
  );
}

export default App;
