import { AxelarAssetTransfer, Environment } from "@axelar-network/axelarjs-sdk";

export const sdk = new AxelarAssetTransfer({
  environment: Environment.TESTNET,
  auth: "local",
});

