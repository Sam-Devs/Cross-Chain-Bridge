import { Contract, ethers, getDefaultProvider, providers } from "ethers";
import {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";

import AxelarGatewayContract from "./IAxelarGateway.json";
import IERC20 from "./IERC20.json";
import { isTestnet, wallet } from "../config/constants";
import { sleep } from "./sleep";
import { getTransferFee } from "./getTransferFee";

// let chains = isTestnet ? require('../config/testnet.json') : require('../config/local.json');

const ethereumChain = {
  name: "Ethereum",
  chainId: 3,
  rpc: "https://ropsten.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605",
  gateway: "0xBC6fcce7c5487d43830a219CA6E7B83238B41e71",
  gasReceiver: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  tokenName: "Ether",
  tokenSymbol: "ETH",
  executableSample: "0x2033aE7406a0dAdbe1dd256Fe2894c57cc907d6c",
  constAddressDeployer: "0xd5bf7311032fe5dde956de6f2916f135a140e7dd",
  crossChainToken: "0xb5ADB662B1DebDCc96c4d7c406aDF20F310aEe0B",
};

const avalancheChain = {
  name: "Avalanche",
  chainId: 43113,
  rpc: "https://api.avax-test.network/ext/bc/C/rpc",
  gateway: "0xC249632c2D40b9001FE907806902f63038B737Ab",
  gasReceiver: "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
  tokenName: "Avax",
  tokenSymbol: "AVAX",
  executableSample: "0x9372350Abb3B5c10DB1BB858e0bCf91eFa74d946",
  constAddressDeployer: "0xd5bf7311032fe5dde956de6f2916f135a140e7dd",
  crossChainToken: "0xb5ADB662B1DebDCc96c4d7c406aDF20F310aEe0B",
};

const useMetamask = false; // typeof window === 'object';

const moonbeamProvider = useMetamask
  ? new providers.Web3Provider((window as any).ethereum)
  : getDefaultProvider(moonbeamChain.rpc);
const moonbeamConnectedWallet = useMetamask
  ? (moonbeamProvider as providers.Web3Provider).getSigner()
  : wallet.connect(moonbeamProvider);
const avalancheProvider = getDefaultProvider(avalancheChain.rpc);
const avalancheConnectedWallet = wallet.connect(avalancheProvider);

const srcGatewayContract = new Contract(
  avalancheChain.gateway,
  AxelarGatewayContract.abi,
  avalancheConnectedWallet
);
const destGatewayContract = new Contract(
  moonbeamChain.gateway,
  AxelarGatewayContract.abi,
  moonbeamConnectedWallet
);

export async function gatewaySendToken(
  amount: string,
  recipientAddress: string,
  onSent: (data: { txHash: string; transferFee: number }) => void
) {
  // Get token address from the gateway contract for the src chain
  const srcTokenAddress = await srcGatewayContract.tokenAddresses("aUSDC");
  const srcErc20 = new Contract(
    srcTokenAddress,
    IERC20.abi,
    avalancheConnectedWallet
  );

  // Get token address from the gateway contract for the destination chain
  const destinationTokenAddress = await destGatewayContract.tokenAddresses(
    "aUSDC"
  );
  const destERC20 = new Contract(
    destinationTokenAddress,
    IERC20.abi,
    moonbeamConnectedWallet
  );

  const destBalance = await destERC20.balanceOf(recipientAddress);

  const transferFee: number = await getTransferFee(
    "avalanche",
    "moonbeam",
    "aUSDC",
    amount
  );

  // Approve the token for the amount to be sent
  await srcErc20
    .approve(srcGatewayContract.address, ethers.utils.parseUnits(amount, 6))
    .then((tx: any) => tx.wait());

  // Send the token
  const txHash: string = await srcGatewayContract
    .sendToken(
      "Moonbeam",
      recipientAddress,
      "aUSDC",
      ethers.utils.parseUnits(amount, 6)
    )
    .then((tx: any) => tx.wait())
    .then((receipt: any) => receipt.transactionHash);

  console.log({ txHash });
  onSent({ txHash, transferFee });

  // Wait destination contract to execute the transaction.
  return new Promise(async (resolve, reject) => {
    while (true) {
      const newBalance = await destERC20.balanceOf(recipientAddress);
      if (BigInt(destBalance) != BigInt(newBalance)) break;
      await sleep(2000);
    }
    resolve(null);
  });
}
