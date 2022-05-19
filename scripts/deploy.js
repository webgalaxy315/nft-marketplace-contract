const fs = require("fs");

const { deployAtariCoin } = require("./1_atariCoinDeploy");
const { deployAtariNFT } = require("./2_atariNFTDeploy");
const { deployMarketplace } = require("./3_marketplaceDeploy");
const { deployMulticall } = require("./4_multicallDeploy.js");

const AtariCoinAbi = require("../artifacts/contracts/atariCoin.sol/AtariCoin.json").abi;
const AtariNFTAbi = require("../artifacts/contracts/AtariCasinoNFT.sol/AtariCasinoNFT.json").abi;
const MarketPlaceAbi = require("../artifacts/contracts/Marketplace.sol/Marketplace.json").abi;
const MulticallAbi = require("../artifacts/contracts/multicall.sol/multicall.json").abi;

const { ethers, waffle } = require("hardhat");

async function main() {

	var [owner] = await ethers.getSigners();

	const provider = waffle.provider;
	const { chainId } = await provider.getNetwork()

	console.log(chainId, owner.address);

	// local test

	var atariCoin = await deployAtariCoin();
	// var atariCoin = process.env.ATARICOIN;

	var AtariNFT = await deployAtariNFT(atariCoin.address);

	var market = await deployMarketplace(atariCoin.address);

	var multicall = await deployMulticall();

	//object
	var atariToken = { address: atariCoin.address, abi: AtariCoinAbi };
	var atariNFT = { address: AtariNFT.address, abi: AtariNFTAbi };
	var marketPlace = { address: market.address, abi: MarketPlaceAbi };
	var multiCall = { address: multicall.address, abi: MulticallAbi };

	var contractObject = { atariToken, atariNFT, marketPlace, multiCall };

	fs.writeFile(
		`./exports/${chainId}.json`,
		JSON.stringify(contractObject, null, 4),
		function (err, content) {
			if (err) throw err;
			console.log("complete");
		}
	);
}

main()
	.then(() => {
		// process.exit(0)
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
