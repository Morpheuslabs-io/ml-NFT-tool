// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MorpheusNftManagerInfo is Ownable {
    
    // One user address can create multiple NFT contract addresses
    mapping(address => address[]) public collectionList;

    // Extend for itemList
    
    function add(address userAddr_, address contractAddr_) public {
        collectionList[userAddr_].push(contractAddr_);
    }

    function get(address userAddr_) public view returns (address[] memory) {
        return collectionList[userAddr_];
    }

    function clear(address userAddr_) public onlyOwner {
        address[] memory empty;
        collectionList[userAddr_] = empty;
    }
}
