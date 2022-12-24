const { ethers } = require("hardhat");

async function main() {
  const todo = await ethers.getContractFactory("Todo");
  const Todo = await todo.deploy();
  await Todo.deployed();

  const [owner] = await ethers.getSigners();

  console.log(`Deployed Todo at ${Todo.address}`);

  const txn1 = await Todo.addTask("This is My First Task");
  const txn2 = await Todo.addTask("This is My Second Task");
  const txn3 = await Todo.addTask("This is My Third Task");

  const tasks = await Todo.getTasks();
  tasks.forEach((element) => {
    console.log("\n");
    console.log(element.id);
    console.log(element.description);
    console.log(element.status);
  });
}

main()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
