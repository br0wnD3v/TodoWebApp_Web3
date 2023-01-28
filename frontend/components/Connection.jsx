import { useState, useEffect, useContext } from "react";
import { ChainContext, SignerContext } from "../contexts/context";

import { ethers } from "ethers";

export default function Connection() {
  const { setSigner } = useContext(SignerContext);
  const { onHardhat, setOnHardhat } = useContext(ChainContext);

  const targetNetworkId = "31337";

  async function execute() {
    await connect();
  }

  useEffect(() => {
    if (window.ethereum) execute();
  }, []);

  async function checkNetwork() {
    const currentChainId = await ethereum.request({
      method: "eth_chainId",
    });

    if (currentChainId == targetNetworkId) return true;
    else return false;
  }

  async function changeChains() {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }],
      });
      setOnHardhat(true);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                chainName: "Hardhat Testnet",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: [""],
              },
            ],
          });
          setOnHardhat(true);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }

  async function connect() {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []).catch((error) => {
        if (error.code == 4001) console.error("User denied connection.");
      });
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setSigner(address);

      setOnHardhat(await checkNetwork());
      if (!onHardhat) changeChains();
    } catch (err) {
      console.error(err);
    }
  }

  // function handleAccounts(accounts) {
  //   if (accounts.length > 0) setSigner(accounts[0]);

  // }

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((accounts) => handleAccounts(accounts))
  //       .catch((error) => {
  //         if (error.code == 4001) console.error("User denied connection.");
  //       });
  //   }
  // }, []);

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length == 0) window.location.reload();
      else setSigner(accounts[0]);
    });
  });

  return (
    <>
      <button
        style={{ margin: "20px", padding: "10px", borderRadius: "5px" }}
        onClick={() => connect()}
      >
        Connect
      </button>
    </>
  );
}
