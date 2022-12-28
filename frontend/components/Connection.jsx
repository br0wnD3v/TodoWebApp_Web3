import { useEffect, useContext } from "react";
import { SignerContext } from "../contexts/context";

export default function Connection() {
  const { signer, setSigner } = useContext(SignerContext);

  function handleAccounts(accounts) {
    if (accounts.length > 0) setSigner(accounts[0]);
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => handleAccounts(accounts))
        .catch((error) => {
          if (error.code == 4001) console.error("User denied connection.");
        });
    }
  }, []);

  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length == 0) window.location.reload();
      else setSigner(accounts[0]);
    });
  });

  return;
}
