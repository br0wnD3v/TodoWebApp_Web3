require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: { chainId: 31337 },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
