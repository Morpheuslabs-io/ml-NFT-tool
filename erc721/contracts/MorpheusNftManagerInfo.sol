// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MorpheusNftManagerInfo is Ownable {
    
    // One user address can create multiple NFT contract addresses
    mapping(address => address[]) public collectionList;

    // One user address can add multiple NFT token items
    mapping(address => string[]) public itemTxList;

    // Extend for itemList
    
    function addCollection(address userAddr_, address contractAddr_) public {
        collectionList[userAddr_].push(contractAddr_);
    }

    function getCollection(address userAddr_) public view returns (address[] memory) {
        return collectionList[userAddr_];
    }

    function addItemTx(address userAddr_, string memory txHash_) public {
        itemTxList[userAddr_].push(txHash_);
    }

    function getItemTx(address userAddr_) public view returns (string[] memory) {
        return itemTxList[userAddr_];
    }
}
