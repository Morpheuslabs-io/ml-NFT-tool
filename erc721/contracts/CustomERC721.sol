pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract CustomERC721 is ERC721Token {
    uint256 public tokenId = 0;
    constructor(
        string _name,
        string _symbol,
        address _to,
        string _tokenURI
    ) public ERC721Token(_name, _symbol) {
        super._mint(_to, tokenId);
        super._setTokenURI(tokenId, _tokenURI);
        tokenId = tokenId + 1;
    }

    function createCollectible(string tokenURI) public returns (uint256) {
        super._mint(msg.sender, tokenId);
        super._setTokenURI(tokenId, tokenURI);
        tokenId = tokenId + 1;
        return tokenId;
    }
}
