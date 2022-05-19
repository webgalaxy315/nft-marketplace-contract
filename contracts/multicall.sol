// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "./utils/access/Ownable.sol";
import "./ERC721/ERC721.sol";

interface INFT is IERC721 {
    function tokenURI(uint256 id) external view returns (string memory);
}

contract multicall {

    function getNFTInfos(address NFTAddress, uint256[] memory _tokenIds)
        external
        view
        returns (
            address[] memory owners,
            address[] memory creators,
            string[] memory tokenURIs
        )
    {
        owners = new address[](_tokenIds.length);
        creators = new address[](_tokenIds.length);
        tokenURIs = new string[](_tokenIds.length);

        INFT NFT = INFT(NFTAddress);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            owners[i] = NFT.ownerOf(_tokenIds[i]);
            creators[i] = NFT.createrOf(_tokenIds[i]);
            tokenURIs[i] = NFT.tokenURI(_tokenIds[i]);
        }
    }
   
    function getNFTInfos_1(address NFTAddress, uint256[] memory _tokenIds)
        external
        view
        returns (
            address[] memory owners,
            string[] memory tokenURIs
        )
    {
        owners = new address[](_tokenIds.length);
        tokenURIs = new string[](_tokenIds.length);

        INFT NFT = INFT(NFTAddress);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            owners[i] = NFT.ownerOf(_tokenIds[i]);
            tokenURIs[i] = NFT.tokenURI(_tokenIds[i]);
        }
    }
}
