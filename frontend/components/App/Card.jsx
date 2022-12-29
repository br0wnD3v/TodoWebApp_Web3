import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { todoABI, todoAddress } from "../../constants/info";

export default function Card(props) {
  const moment = require("moment");

  const [serialNumber, setSerialNumber] = useState(-1);
  const [task, setTask] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const [status, setStatus] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (dataFetched) {
      console.log(serialNumber, task, timeStamp, status);
    }
  }, [dataFetched]);

  const delay = (time) => {
    return new Promise((res) => {
      setTimeout(res, time * 1000);
    });
  };

  async function changeStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const Todo = new ethers.Contract(todoAddress, todoABI, signer);
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
      await updateState();
    }

    execute();
  }, []);

  return (
    <>
      {dataFetched ? (
        <>
          <div
            style={{
              backgroundColor: "black",
              borderRadius: "10px",
              border: "2px solid #fbbb54",
              height: "300px",
              width: "300px",
              display: "inline-block",
              marginLeft: "25px",
              marginRight: "25px",
              marginBottom: "25px",
              padding: "15px",

              position: "relative",
            }}
          >
            <h2
              style={{
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              {serialNumber}
            </h2>
            <p style={{ display: "inline-block", float: "right" }}>
              {timeStamp}
            </p>
            <p
              style={{
                height: "50%",
                fontSize: "140%",
                overflowX: "hidden",
                overflowY: "scroll",
              }}
            >
              {task}
            </p>
            <button className="taskStatus" onClick={() => changeStatus()}>
              {status ? <>Completed</> : <>Pending</>}
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
