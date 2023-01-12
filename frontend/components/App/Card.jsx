import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { todoABI, todoAddress } from "../../constants/info";

import { motion } from "framer-motion";

import Image from "next/image";
import bin from "../../public/bin.png";

export default function Card(props) {
  var Todo;

  const moment = require("moment");

  const [serialNumber, setSerialNumber] = useState(-1);
  const [task, setTask] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const [status, setStatus] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);
  const [visibility, setVisibility] = useState(true);

  const delay = (time) => {
    return new Promise((res) => {
      setTimeout(res, time * 1000);
    });
  };

  async function deleteTask() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();

    // const Todo = new ethers.Contract(todoAddress, todoABI, signer);

    const _id = BigNumber.from(serialNumber - 1);
    const txn = await Todo.removeTask(_id);
    const receipt = await txn.wait(1);

    if (receipt.status === 1) {
      setVisibility(false);
    }
  }

  async function changeStatus() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();

    // const Todo = new ethers.Contract(todoAddress, todoABI, signer);

    const _id = BigNumber.from(serialNumber - 1);
    const txn = await Todo.invertStatus(_id);
    const receipt = await txn.wait(1);

    if (receipt.status === 1) {
      setStatus(!status);
    }
  }

  async function updateState() {
    const sn = props.data[0].toNumber();
    setSerialNumber(sn + 1);

    setTask(props.data[1]);

    const epoch = props.data[2];
    let result = moment(epoch).format("D/M/Y");
    setTimeStamp(result);

    setStatus(props.data[3]);

    delay(2).then(() => {
      setDataFetched(true);
    });
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

      await updateState();
    }

    execute();
  }, []);

  return (
    <>
      {dataFetched && visibility ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              ease: "easeInOut",
            }}
            className="card"
            style={
              status
                ? { border: "2px solid #84de5d" }
                : { border: "2px solid #fbbb54" }
            }
          >
            {/* <h2
              style={{
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              {serialNumber}
            </h2> */}
            <p style={{ float: "right" }}>{timeStamp}</p>
            <p
              style={{
                clear: "both",
                marginTop: "50px",
                height: "50%",
                fontSize: "140%",
                overflowX: "hidden",
                overflowY: "scroll",
              }}
            >
              {task}
            </p>

            {status ? (
              <button
                className="taskStatusCompleted"
                onClick={() => changeStatus()}
              >
                Completed
              </button>
            ) : (
              <button className="taskStatus" onClick={() => changeStatus()}>
                Pending
              </button>
            )}
            <button onClick={() => deleteTask()} className="binButton">
              <Image src={bin} height={20} width={20} />
            </button>
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
