// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomERC721Repo is Ownable {
    
    // One user address can create multiple NFT contract addresses
    mapping(address => address[]) public data;
    
    function add(address userAddr_, address contractAddr_) public {
        data[userAddr_].push(contractAddr_);
    }

    function get(address userAddr_) public view returns (address[] memory) {
        return data[userAddr_];
    }

    function clear(address userAddr_) public onlyOwner {
        address[] memory empty;
        data[userAddr_] = empty;
    }
}
