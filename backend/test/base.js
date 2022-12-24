const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");

describe("Setting Up...", function () {
  async function deploymentFixture() {
    const todo = await ethers.getContractFactory("Todo");
    const [owner] = await ethers.getSigners();

    const Todo = await todo.deploy();
    await Todo.deployed();

    return { Todo, owner };
  }

  describe("Adding.", function () {
    it("Should add a task.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);

      const txn = await Todo.addTask("Task 1");
      const receipt = await txn.wait(1);

      assert.equal(receipt.status, 1);
    });

    it("Should emit 'TaskAdded' event with owner's address and increasing task id with each new task.", async function () {
      const { Todo, owner } = await loadFixture(deploymentFixture);

      await expect(Todo.addTask("Task 1"))
        .to.emit(Todo, "TaskAdded")
        .withArgs(owner.address, 0);

      await expect(Todo.addTask("Task 2"))
        .to.emit(Todo, "TaskAdded")
        .withArgs(owner.address, 1);

      await expect(Todo.addTask("Task 3"))
        .to.emit(Todo, "TaskAdded")
        .withArgs(owner.address, 2);
    });

    it("Should update the mapping(address => Task[]) with each new entry.", async function () {});
  });
});
