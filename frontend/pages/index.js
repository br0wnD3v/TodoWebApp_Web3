import { useState } from "react";
import { SignerContext } from "../contexts/context";
import Connection from "../components/Connection";
import StartApp from "../components/App/StartApp";

export default function Home() {
  const [signer, setSigner] = useState(null);

  return (
    <>
      <SignerContext.Provider value={{ signer, setSigner }}>
        {!signer ? <Connection /> : <StartApp />}
      </SignerContext.Provider>
    </>
  );
}
