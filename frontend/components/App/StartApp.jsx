import Popup from "reactjs-popup";
import CreateTaskCards from "./CreateTaskCards";

import { useContext, useState, useEffect } from "react";
import { SignerContext } from "../../contexts/context";
import { ethers } from "ethers";

import Image from "next/image";
import logo from "../../public/logo.png";
import loading from "../../public/loading.gif";

import { todoAddress, todoABI } from "../../constants/info";

export default function StartApp() {
  var Todo;

  const { signer } = useContext(SignerContext);

  const [mode, setMode] = useState(0);
  const [dataFetched, setDataFetched] = useState([]);
  const [readyToSend, setReadyToSend] = useState(false);

  async function changeMode(val) {
    setMode(val);
    console.log(val);
  }

  const delay = (time) => {
    return new Promise((res) => {
      setTimeout(res, time * 1000);
    });
  };

  useEffect(() => {
    if (dataFetched.length > 0) {
      console.log(dataFetched);
      delay(0.1).then(() => {
        setReadyToSend(true);
      });
    }
  }, [dataFetched]);

  async function getData() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // const Todo = new ethers.Contract(todoAddress, todoABI, signer);

    await Todo.getTasks().then((result) => {
      setDataFetched(result);
    });
  }

  async function addTask() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // await Todo.
  }

  useEffect(() => {
    async function execute() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      Todo = new ethers.Contract(todoAddress, todoABI, signer);
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
            height: "165px",
            clear: "both",
          }}
        >
          <Image
            src={logo}
            height={130}
            width={110}
            alt="Logo"
            style={{
              float: "left",
              display: "inline-block",
              marginLeft: "40px",
              marginTop: "10px",
            }}
          />
          <h1
            style={{
              display: "inline-block",
              marginTop: "65px",
              marginLeft: "30px",
            }}
          >
            <i>Powered By Blockchain</i>
          </h1>
          <p
            className="goldText"
            style={{
              border: "3px solid #fbbb54",
              borderRadius: "10px",
              float: "right",
              display: "inline-block",
              padding: "20px",
              marginTop: "45px",
              marginRight: "25px",
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
            width: "20%",
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
          style={{
            borderLeft: "1px solid white",
            paddingTop: "60px",
            paddingLeft: "60px",
            float: "left",
            display: "inline-block",
            width: "75%",
            minHeight: "100vh",
          }}
        >
          <div>
            <h1
              className="goldText"
              style={{
                display: "inline-block",
                fontSize: "500%",
                marginBottom: "20px",
                marginLeft: "10px",
              }}
            >
              <i>Tasks</i>
            </h1>
            <Popup trigger={<button className="addButton">+ Add</button>} modal>
              <div className="modalBox">
                <div className="modalInner">
                  <form method="POST">
                    <input
                      type="text"
                      name="taskDescription"
                      placeholder="Enter the task..."
                      style={{ overflowY: "scroll" }}
                    />
                    <input type="submit"></input>
                  </form>
                </div>
              </div>
            </Popup>
            {/* <button className="addButton" onClick={() => addTask()}>
              + Add
            </button> */}
          </div>
          {!readyToSend ? (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              <Image src={loading} alt="Loading..." height={200} width={200} />
            </div>
          ) : (
            <CreateTaskCards data={dataFetched} mode={mode} />
          )}
        </section>
      </main>
    </>
  );
}
