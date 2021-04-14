// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EIP712MetaTransaction.sol";

contract CustomERC721 is Ownable, ERC721URIStorage, EIP712MetaTransaction {
    
    string private constant DOMAIN_NAME = "morpheuslabs.io";
    string private constant DOMAIN_VERSION = "1";

    string private constant TOKEN_NAME = "Morpheus-MITx";
    string private constant TOKEN_SYMBOL = "MMITx";
    
    uint256 public tokenId = 0;
    
    // Authorized list
    mapping(address => bool) public authorized;
    
    constructor() ERC721(TOKEN_NAME, TOKEN_SYMBOL) EIP712MetaTransaction(DOMAIN_NAME, DOMAIN_VERSION) 
    {}

    modifier isAuthorized() {
        require(
            msg.sender == owner() || authorized[msg.sender] == true, 
            "CustomERC721: unauthorized"
        );
        _;
    }

    function createCollectible(string memory tokenURI) public isAuthorized returns (uint256) {
        tokenId = tokenId + 1;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function addAuthorized(address auth) public onlyOwner {
        authorized[auth] = true;
    }

    function clearAuthorized(address auth) public onlyOwner {
        authorized[auth] = false;
    }

    function checkAuthorized(address auth) public view returns (bool) {
        return authorized[auth];
    }
}
