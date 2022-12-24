// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "hardhat/console.sol";

error Todo_InvalidID();

contract Todo is Context {
    event TaskAdded(address indexed, uint indexed);
    event TaskCompleted(address indexed, uint indexed);
    event TaskRemoved(address indexed, uint indexed);

    struct Task {
        uint id;
        string description;
        bool status;
    }

    mapping(address => Task[]) private addressToTasks;

    constructor() {}

    modifier validID(address _addr, uint _id) {
        uint _upperBound = addressToTasks[_addr].length;
        if (_id > _upperBound) revert Todo_InvalidID();
        _;
    }

    function addTask(string calldata _description) public returns (bool) {
        if (_add(_description, _msgSender())) return true;
        else return false;
    }

    function removeTask(
        uint _id
    ) public validID(_msgSender(), _id) returns (bool) {
        _removeTask(_msgSender(), _id);
        return true;
    }

    function completeTask(
        uint _id
    ) public validID(_msgSender(), _id) returns (bool) {
        addressToTasks[_msgSender()][_id].status = true;
        return true;
    }

    function getTasks(address _addr) public view returns (Task[] memory) {
        return addressToTasks[_addr];
    }

    function _add(
        string calldata _description,
        address _addr
    ) private returns (bool) {
        uint _newId = addressToTasks[_addr].length;

        // console.log(_newId);

        Task memory newTask = Task(_newId, _description, false);
        addressToTasks[_addr].push(newTask);

        emit TaskAdded(_addr, _newId);
        return true;
    }

    function _removeTask(address _addr, uint _id) private {
        uint lastIndex = addressToTasks[_addr].length - 1;
        addressToTasks[_addr][_id] = addressToTasks[_addr][lastIndex];
        addressToTasks[_addr].pop();
        addressToTasks[_addr][_id].id = _id;
        emit TaskRemoved(_addr, _id);
    }
}
