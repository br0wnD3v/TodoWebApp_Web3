// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "hardhat/console.sol";

error Todo_InvalidID();

contract Todo is Context {
    event TaskAdded(address indexed, uint indexed);
    event TaskStatusChanged(address indexed, uint indexed, bool status);
    event TaskRemoved(address indexed, uint indexed);

    struct Task {
        uint id;
        string description;
        uint createdAt;
        bool status;
    }

    mapping(address => Task[]) private addressToTasks;

    constructor() {}

    modifier validID(address _addr, uint _id) {
        if (_id >= addressToTasks[_addr].length) revert Todo_InvalidID();
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

    function invertStatus(
        uint _id
    ) public validID(_msgSender(), _id) returns (bool) {
        bool currentStatus = addressToTasks[_msgSender()][_id].status;
        addressToTasks[_msgSender()][_id].status = !currentStatus;
        emit TaskStatusChanged(_msgSender(), _id, !currentStatus);
        return true;
    }

    function getTasks() public view returns (Task[] memory) {
        return addressToTasks[_msgSender()];
    }

    function _add(
        string calldata _description,
        address _addr
    ) private returns (bool) {
        uint _newId = addressToTasks[_addr].length;

        // console.log(_newId);

        Task memory newTask = Task(
            _newId,
            _description,
            block.timestamp,
            false
        );
        addressToTasks[_addr].push(newTask);

        emit TaskAdded(_addr, _newId);
        return true;
    }

    function _removeTask(address _addr, uint _id) private {
        // uint lastIndex = addressToTasks[_addr].length - 1;
        // addressToTasks[_addr][_id] = addressToTasks[_addr][lastIndex];
        // addressToTasks[_addr].pop();
        // addressToTasks[_addr][_id].id = _id;
        delete addressToTasks[_addr][_id];
        emit TaskRemoved(_addr, _id);
    }
}
