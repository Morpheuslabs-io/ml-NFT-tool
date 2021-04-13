// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomERC721 is Ownable, ERC721URIStorage {
    uint256 public tokenId = 0;
    
    // Authorized list
    mapping(address => bool) public authorized;
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _to,
        string memory _tokenURI
    ) ERC721(_name, _symbol) {
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

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
