const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
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

  describe("Add.", function () {
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

    it("Should update the mapping(address => Task[]) with each new entry.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);

      await Todo.addTask("Task 1");
      await Todo.addTask("Task 2");

      const results = await Todo.getTasks();
      const result = results[1];

      const expectedId = BigNumber.from("1");
      const returnedId = result.id;

      assert.equal(results.length, 2);

      assert(expectedId.eq(returnedId));
      assert.equal(result.description, "Task 2");
      assert.equal(result.status, false);
    });
  });
  describe("Completion.", async function () {
    it("Should update the status of a Task to true when marked.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);

      await Todo.addTask("Task 1");
      var tasks = await Todo.getTasks();
      var task = tasks[0];
      assert.equal(task.status, false);

      await Todo.markCompleted(0);
      tasks = await Todo.getTasks();
      task = tasks[0];
      assert.equal(task.status, true);
    });

    it("Should emit 'TaskCompleted' event with the owner's address and the task id.", async function () {
      const { Todo, owner } = await loadFixture(deploymentFixture);

      await Todo.addTask("Task 1");
      await expect(Todo.markCompleted(0))
        .to.emit(Todo, "TaskCompleted")
        .withArgs(owner.address, 0);
    });

    it("Should revert if the id sent is invalid.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);
      await Todo.addTask("Task 1");
      await expect(Todo.markCompleted(1)).to.be.revertedWithCustomError(
        Todo,
        "Todo_InvalidID"
      );
    });
  });
  describe("Remove.", function () {
    it("Should remove the task and replace it with the task at the end of the list and update its id.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);

      await Todo.addTask("Task 1");
      await Todo.addTask("Task 2");
      await Todo.addTask("Task 3");

      await Todo.removeTask(0);

      const tasks = await Todo.getTasks();
      assert.equal(tasks.length, 2);

      const task = tasks[0];
      assert.equal(task.id, 0);
      assert.equal(task.description, "Task 3");
    });

    it("Should emit 'TaskRemoved' event with the owner's address and the id of the task.", async function () {
      const { Todo, owner } = await loadFixture(deploymentFixture);

      await Todo.addTask("Task 1");
      await Todo.addTask("Task 2");
      await Todo.addTask("Task 3");

      await expect(Todo.removeTask(0))
        .to.emit(Todo, "TaskRemoved")
        .withArgs(owner.address, 0);
    });

    it("Should revert if the id sent is invalid.", async function () {
      const { Todo } = await loadFixture(deploymentFixture);
      await Todo.addTask("Task 1");
      await expect(Todo.removeTask(1)).to.be.revertedWithCustomError(
        Todo,
        "Todo_InvalidID"
      );
    });
  });
});
