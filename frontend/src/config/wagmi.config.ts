import { http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId,
    }),
  ],
}); 