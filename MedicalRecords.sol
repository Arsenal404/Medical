// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalRecords {
    struct Record {
        string ipfsHash;
        uint timestamp;
    }

    mapping(address => Record[]) public records;

    event RecordAdded(address indexed patient, string ipfsHash);

    function addRecord(string memory _ipfsHash) public {
        records[msg.sender].push(Record(_ipfsHash, block.timestamp));
        emit RecordAdded(msg.sender, _ipfsHash);
    }

    function getRecords(address _patient) public view returns (Record[] memory) {
        return records[_patient];
    }
}
