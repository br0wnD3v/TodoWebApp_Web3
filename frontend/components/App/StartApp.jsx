import { useContext, useState, useEffect } from "react";
import { SignerContext } from "../../contexts/context";
import { ethers } from "ethers";

import Image from "next/image";
import logo from "../../public/logo.png";

import { todoAddress, todoABI } from "../../constants/info";

export default function StartApp() {
  const { signer } = useContext(SignerContext);
  const [mode, setMode] = useState(0);

  async function changeMode(val) {
    setMode(val);
    console.log(val);
  }

  async function getData() {}

  useEffect(() => {
    async function execute() {
      await getData();
    }
    execute();
  }, []);

  return (
    <>
      <main>
        <section
          style={{
            borderBottom: "1px solid white",
            height: "150px",
            clear: "both",
          }}
        >
          <Image
            src={logo}
            height={110}
            width={140}
            alt="Logo"
            style={{ float: "left", display: "inline-block", margin: "20px" }}
          />
          <p style={{ display: "inline-block", margin: "65px 40px" }}>
            TODO Application Powered By Blockchain
          </p>
          <p
            className="goldText"
            style={{
              border: "3px solid #fbbb54",
              borderRadius: "10px",
              float: "right",
              display: "inline-block",
              padding: "20px",
              margin: "40px 25px",
            }}
          >
            {signer.slice(0, 5) + "..." + signer.slice(-4)}
          </p>
        </section>

        <section
          style={{
            display: "inline-block",
            clear: "none",
            alignItems: "center",
            float: "left",
            height: "100vh",
            width: "200px",
            borderRight: "1px solid white",
          }}
        >
          <div
            style={{
              margin: "auto",
              width: "70%",
              height: "max-content",
              margin: "200px auto",
            }}
          >
            <button className="taskButton" onClick={() => changeMode(0)}>
              All
            </button>
            <button className="taskButton" onClick={() => changeMode(1)}>
              Pending
            </button>
            <button className="taskButton" onClick={() => changeMode(2)}>
              Completed
            </button>
          </div>
        </section>
        <section
          style={{ margin: "50px", float: "left", display: "inline-block" }}
        >
          <h1 className="goldText" style={{ fontSize: "500%" }}>
            <i>Tasks</i>
          </h1>
        </section>
      </main>
    </>
  );
}
