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

  console.log("Deployer Address :", signer.address);
  console.log("Contract Address :", Todo.address);
};
