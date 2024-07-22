import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  arbitrumGoerli
} from 'wagmi/chains';
import {
  QueryClient,
} from "@tanstack/react-query";


const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const wagmiConfig = getDefaultConfig({
  appName: 'Mucho.Finance',
  projectId: projectId,
  chains: [arbitrum],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
export const wagmiQueryClient = new QueryClient();

/*-------------------------------------------*/

export const getChains = () =>
  import.meta.env.VITE_ENV.toLowerCase() == 'testnet'
    ? [arbitrumGoerli]
    : [arbitrum];
/*
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
        //ledgerWallet({ chains, projectId }),
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
*/