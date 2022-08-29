import type { NextPage } from "next";
import Head from "next/head";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

import Web3 from "web3";
import Web3Modal from "web3modal";
// import { IERC20 } from "../utils/IERC20.json";
import IAxelarGateway from "../utils/IAxelarGateway.json";
import { sdk } from "../utils/bridge";
import {
  assetName,
  chainId,
  chainName,
  contractAddress,
  destinationChain,
  lcdURL,
  privateKey,
  ropstenProvider,
  sourceChain,
  tendermintURL,
} from "../constant";
import { balanceOf } from "../utils/balance";

let web3modal: Web3Modal;
if (typeof window !== "undefined") {
  web3modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });
}

const Home: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [seiAddress, setSeiAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendToken = async () => {
    try {
      setLoading(true);
      const depositAddress = await sdk.getDepositAddress(
        sourceChain,
        destinationChain,
        seiAddress,
        assetName
      );

      const web3 = new Web3(ropstenProvider);

      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(
        IAxelarGateway.abi,
        contractAddress
      );

      console.log("CONTRACT", contract);

      const amountHex = web3.utils.toHex(amount);

      const tx = {
        from: accounts[0],
        to: contractAddress,
        gas: web3.utils.toHex("50000"),
        data: contract.methods
          .sendToken("Ethereum", depositAddress, "aUSDC", amountHex)
          .encodeABI(),
        chainId: 3,
        value: 0,
      };

      const signature = await web3.eth.accounts.signTransaction(tx, privateKey);

      const receipt = await web3.eth.sendSignedTransaction(
        signature.rawTransaction
      );

      console.log(receipt);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const connectMetamask = async () => {
    const provider = await web3modal?.connect();
    const web3 = new Web3(provider);
    const address = await web3.eth.getAccounts();
    if (address.length === 0) {
      console.log("connect an account");
    } else if (address[0] !== account) {
      setAccount(address[0]);
    }
  };

  const connectKeplr = async () => {
    if (!window.getOfflineSigner || !window.keplr) {
      alert("Keplr Wallet not detected, please install extension");
      return {
        accounts: null,
      };
    }
    if (!window.keplr.experimentalSuggestChain) {
      alert(
        "Please use latest version of the Keplr extension to access experimental features"
      );
    }

    const prefix = "sei";
    try {
      await window.keplr.experimentalSuggestChain({
        chainId: chainId,
        chainName: chainName,
        rpc: lcdURL,
        rest: tendermintURL,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "sei",
          bech32PrefixAccPub: "sei" + "pub",
          bech32PrefixValAddr: "sei" + "valoper",
          bech32PrefixValPub: "sei" + "valoperpub",
          bech32PrefixConsAddr: "sei" + "valcons",
          bech32PrefixConsPub: "sei" + "valconspub",
        },
        currencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
          },
          {
            coinDenom: "USDC",
            coinMinimalDenom: "uusdc",
            coinDecimals: 6,
            coinGeckoId: "usd-coin",
          },
          {
            coinDenom: "ATOM",
            coinMinimalDenom: "uatom",
            coinDecimals: 6,
            coinGeckoId: "cosmos",
          },
          {
            coinDenom: "WETH",
            coinMinimalDenom:
              "ibc/C2A89D98873BB55B62CE86700DFACA646EC80352E8D03CC6CF34DD44E46DC75D",
            coinDecimals: 18,
            coinGeckoId: "weth",
          },
          {
            coinDenom: "WBTC",
            coinMinimalDenom:
              "ibc/42BCC21A2B784E813F8878739FD32B4AA2D0A68CAD94F4C88B9EA98609AB0CCD",
            coinDecimals: 8,
            coinGeckoId: "bitcoin",
          },
          {
            coinDenom: "aUSDC",
            coinMinimalDenom:
              "ibc/6D45A5CD1AADE4B527E459025AC1A5AEF41AE99091EF3069F3FEAACAFCECCD21",
            coinDecimals: 6,
            coinGeckoId: "usd-coin",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "SEI",
            coinMinimalDenom: "usei",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "SEI",
          coinMinimalDenom: "usei",
          coinDecimals: 6,
        },
        coinType: 118,
        features: ["stargate", "ibc-transfer", "cosmwasm"],
      });
    } catch {
      alert("Failed to suggest the chain");
    }

    await window.keplr.enable(chainId);

    const sendingSigner = await window.keplr.getOfflineSigner(chainId);
    if (!sendingSigner)
      throw new Error(`Failed to get sendingSigner for ${chainId}`);

    const accounts = await sendingSigner.getAccounts();
    console.log(accounts);
    setSeiAddress(accounts[0].address);
    return { accounts, signer: sendingSigner };
  };

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar connectMetamask={connectMetamask} account={account} />
      <div
        className="flex justify-center items-center bg-slate-600 pb-32 object-contain"
        style={{ background: "url(/bg.jpg)" }}
      >
        <Card
          account={account}
          sendToken={sendToken}
          connectKeplr={connectKeplr}
          loading={loading}
          setAmount={setAmount}
          amount={amount}
          seiAddress={seiAddress}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
