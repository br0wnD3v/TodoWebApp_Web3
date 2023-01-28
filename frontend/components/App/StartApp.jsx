import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import { motion } from "framer-motion";

import CreateTaskCards from "./CreateTaskCards";

import { SignerContext } from "../../contexts/context";
import { ethers } from "ethers";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import loading from "../../public/loading.gif";

import { todoAddress, todoABI } from "../../constants/info";

export default function StartApp() {
  var Todo;

  const { signer } = useContext(SignerContext);

  const [mode, setMode] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dataFetched, setDataFetched] = useState([]);
  const [readyToSend, setReadyToSend] = useState(false);

  const inputStyle = {
    marginTop: "35px",
    marginLeft: "85px",
    width: "70%",
    borderRadius: "5px",
    padding: "15px",
  };

  const contentDiv = {
    height: "200px",
    width: "600px",
    borderRadius: "10px",
  };

  const successStyle = {
    color: "black",
    marginTop: "71px",
    marginLeft: "215px",
  };

  function changeMode(val) {
    if (!Todo) {
      execute().then(() => {
        setMode(val);
      });
    }
  }

  const delay = (time) => {
    return new Promise((res) => {
      setTimeout(res, time * 1000);
    });
  };

  useEffect(() => {
    if (dataFetched.length > 0) {
      delay(0.1).then(() => {
        setReadyToSend(true);
      });
    }
  }, [dataFetched]);

  async function getData() {
    await Todo.getTasks().then((result) => {
      setDataFetched(result);
    });
  }

  const addTask = async (event) => {
    event.preventDefault();

    if (!Todo) {
      execute().then(async () => {
        var desc = event.target.task.value;
        desc = desc.toString();

        const txn = await Todo.addTask(desc);
        const receipt = await txn.wait(1);

        if (receipt.status == 1) {
          setSubmitted(true);
          await delay(5);
          setSubmitted(false);
        }
      });
    }
  };

  async function execute() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    Todo = new ethers.Contract(todoAddress, todoABI, signer);
    await getData();
  }

  useEffect(() => {
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
            <Popup
              contentStyle={contentDiv}
              trigger={<button className="addButton">+ Add</button>}
              modal
            >
              <div className="modal">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                  className="content"
                >
                  {!submitted ? (
                    <>
                      <form method="POST" onSubmit={addTask}>
                        <input
                          style={inputStyle}
                          type="text"
                          name="task"
                          placeholder="Enter the task..."
                          required
                        />
                        <br />
                        <input
                          type="submit"
                          className="submitButton"
                          value="Submit"
                        ></input>
                      </form>
                    </>
                  ) : (
                    <>
                      <h1 style={successStyle}>Success!</h1>
                    </>
                  )}
                </motion.div>
              </div>
            </Popup>
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
