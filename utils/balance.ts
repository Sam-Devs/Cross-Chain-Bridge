import Web3 from "web3";
import { ropstenProvider } from "../constant";
import tokenABI from "./tokenABI";
const web3 = new Web3(ropstenProvider);

export const balanceOf = async (address: string) => {
  const tokenInst = new web3.eth.Contract(tokenABI as any, address);

  console.log(tokenInst);
  const balance = await tokenInst.methods.balanceOf(address).call();

  const bal = parseInt(balance) / 10**6;

  return bal;
};
