export interface IChain {
  name: string;
  chainId: number;
  rpc: string;
  gateway: string;
  gasReceiver: string;
  tokenName: string;
  tokenSymbol: string;
  executableSample: string;
  constAddressDeployer: string;
  crossChainToken: string;
}
