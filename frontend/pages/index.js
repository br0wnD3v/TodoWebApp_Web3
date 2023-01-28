import { useState } from "react";
import { SignerContext, ChainContext } from "../contexts/context";
import Connection from "../components/Connection";
import StartApp from "../components/App/StartApp";

export default function Home() {
  const [signer, setSigner] = useState(null);
  const [onHardhat, setOnHardhat] = useState(false);

  return (
    <>
      <SignerContext.Provider value={{ signer, setSigner }}>
        <ChainContext.Provider value={{ onHardhat, setOnHardhat }}>
          {!signer || !onHardhat ? <Connection /> : <StartApp />}
        </ChainContext.Provider>
      </SignerContext.Provider>
    </>
  );
}
