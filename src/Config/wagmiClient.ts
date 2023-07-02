import { configureChains, createClient, Chain } from 'wagmi';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  trustWallet,
  injectedWallet,
  rainbowWallet,
  braveWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  imTokenWallet,
  ledgerWallet,
  omniWallet,
} from '@rainbow-me/rainbowkit/wallets';
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
console.log(`projectId: `, projectId);
import { connectorsForWallets } from '@rainbow-me/rainbowkit';



export const getChains = () =>
  import.meta.env.VITE_ENV.toLowerCase() == 'testnet'
    ? [arbitrumGoerli/*,polygonMumbai*/]
    : [arbitrum/*,polygon*/];

const getWallets = (chains: Chain[]) => {
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains, projectId }),
        coinbaseWallet({ chains, appName: 'MuchoFinance-UI' }),
      ],
    },
  ];
  return [
    {
      groupName: bothSupported[0].groupName,
      wallets: [
        ...bothSupported[0].wallets,
        trustWallet({ chains, projectId }),
        injectedWallet({ chains }),
        walletConnectWallet({ chains, projectId }),
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        rainbowWallet({ chains, projectId }),
        imTokenWallet({ chains, projectId }),
        ledgerWallet({ chains, projectId }),
        omniWallet({ chains, projectId }),
        braveWallet({ chains }),
        // argentWallet({ chains }),
      ],
    },
  ];
};

const { chains, provider } = configureChains(getChains(), [publicProvider()]);
const connectors = connectorsForWallets(getWallets(chains));
export { chains };
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;
