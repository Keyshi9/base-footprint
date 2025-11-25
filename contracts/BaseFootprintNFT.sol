// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseFootprintNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to random seed
    mapping(uint256 => uint256) public tokenSeeds;
    
    constructor() ERC721("Base Footprint", "BFOOT") Ownable(msg.sender) {}
    
    function mint() public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Generate pseudo-random seed using block data
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            tokenId
        )));
        
        tokenSeeds[tokenId] = seed;
        _safeMint(msg.sender, tokenId);
        
        return tokenId;
    }
    
    function getTokenAttributes(uint256 tokenId) public view returns (
        string memory color,
        uint256 number,
        string memory rarity
    ) {
        require(tokenId < _tokenIdCounter, "Token does not exist");
        
        uint256 seed = tokenSeeds[tokenId];
        
        // Generate color
        uint256 colorIndex = seed % 7;
        string[7] memory colors = ["Red", "Blue", "Green", "Purple", "Gold", "Silver", "Rainbow"];
        color = colors[colorIndex];
        
        // Generate number (1-100)
        number = (seed / 7) % 100 + 1;
        
        // Generate rarity
        uint256 rarityValue = (seed / 700) % 100;
        if (rarityValue < 50) {
            rarity = "Common";
        } else if (rarityValue < 80) {
            rarity = "Rare";
        } else if (rarityValue < 95) {
            rarity = "Epic";
        } else {
            rarity = "Legendary";
        }
        
        return (color, number, rarity);
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}
