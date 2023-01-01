module.exports = async ({ getNamedAccounts, deployments, ethers }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Todo", {
    from: deployer,
  });

  const signer = await ethers.getNamedSigner("deployer");

  const Todo = await ethers.getContract("Todo", signer);

  await Todo.addTask("This is My First Task");
  await Todo.addTask("This is My Second Task");
  await Todo.addTask("This is My Third Task");
  await Todo.addTask("This is My Fourth Task");
  await Todo.addTask("This is My Fifth Task");
  await Todo.addTask("This is My Sixth Task");
  await Todo.addTask("This is My Seventh Task");
  await Todo.addTask("This is My Eighth Task");
  await Todo.addTask("This is My Ninth Task");
  await Todo.addTask("This is My Tenth Task");
  await Todo.addTask(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );

  console.log("Deployer Address :", signer.address);
  console.log("Contract Address :", Todo.address);
};
