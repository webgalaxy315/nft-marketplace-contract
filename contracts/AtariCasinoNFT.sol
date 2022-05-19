// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "./utils/access/Ownable.sol";
import "./ERC721/ERC721.sol";
import "./ERC20/IERC20.sol";

contract AtariCasinoNFT is Ownable, ERC721 {
    event ItemCreated(
        address indexed owner,
        uint256 indexed tokenId
    );

    /* --------------- tokenInfos --------------- */

    mapping(uint => string) _tokenMetadatas;
    mapping(uint => uint) public initialPrices;

    uint256 private _totalSupply;

    address public AtariTokenAddress;

    bool public presale;



    /* --------------- functions --------------- */

    constructor (string memory _name, string memory _symbol, address _tokenAddress)
        Ownable()
        ERC721(_name, _symbol)
    {
        _totalSupply = 0;
        presale = true;
        AtariTokenAddress = _tokenAddress;
    }

    function setPresale(bool _presale) onlyOwner external {
        presale = _presale;
    }

    function create(string memory _tokenURI, uint price) onlyOwner public {
        _create(address(this), _tokenURI, price);
    }

    function _create(address _owner, string memory _tokenURI, uint _initialPrice)
        internal
        returns (uint256 tokenId)
    {
        tokenId = _totalSupply;
        _totalSupply = _totalSupply + 1;

        /// Mint new NFT
        _mint(_owner, tokenId);
        _tokenMetadatas[tokenId] = _tokenURI;
        initialPrices[tokenId] = _initialPrice;

        emit ItemCreated(_owner, tokenId);
    }

    /* ------------- view ---------------*/

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenMetadatas[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /* ------------- Update -------------- */

    function setAcceptedToken(address _tokenAddress) external onlyOwner {
        AtariTokenAddress = _tokenAddress;
    }

    function setPrice(uint tokenId, uint newPrice) onlyOwner external {
        initialPrices[tokenId] = newPrice;
    }

    function setURI(uint tokenId, string memory _tokenURI) onlyOwner external {
        _tokenMetadatas[tokenId] = _tokenURI;
    }

    function batchCreates(string[] memory _tokenURIs, uint[] memory _prices)
        external
        onlyOwner
    {
        uint totalNum = _tokenURIs.length;
        for(uint i = 0; i < totalNum; i++)
            _create(address(this), _tokenURIs[i], _prices[i]);
    }


    /* ------------- sale --------------- */

    function buy(uint tokenId) external {
        require(presale,"presale ended");
        require(ownerOf(tokenId) == address(this),"already saled");

        IERC20(AtariTokenAddress).transferFrom(msg.sender, owner(), initialPrices[tokenId]);
        _transfer(address(this), msg.sender, tokenId);
    }

    /* ------------- multi call -------------- */
    
    function getPriceInfos(uint256[] memory _tokenIds) external view returns (uint[] memory _initialPrices){
        _initialPrices = new uint[](_tokenIds.length);
        
        for (uint256 i=0; i<_tokenIds.length; i++){
            _initialPrices[i] = initialPrices[_tokenIds[i]];
        }
    }
}
