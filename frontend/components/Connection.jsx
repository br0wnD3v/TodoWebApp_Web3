import { useState, useEffect, useContext } from "react";
import { SignerContext } from "../contexts/context";

export default function Connection() {
  const { signer, setSigner } = useContext(SignerContext);
  const [onGoerli, setOnGoerli] = useState(false);

  const targetNetworkId = "5";

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
        params: [{ chainId: "0x05" }],
      });
      setOnGoerli(true);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x05",
                chainName: "Goerli Testnet",
                rpcUrls: ["https://goerli.infura.io/v3/"],
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli.etherscan.io"],
              },
            ],
          });
          setOnGoerli(true);
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
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setSigner(address);

      setOnGoerli(await checkNetwork());
      if (!onGoerli) changeChains();
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
        style={{ margin: "20px", padding: "20px", borderRadius: "5px" }}
        onClick={() => connect()}
      >
        Connect
      </button>
    </>
  );
}
