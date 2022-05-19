const hre = require("hardhat");
const ipfsHashes = require("../resources/ipfshashes.json");
const contents = require("../resources/contents.json");

const getInitialData = () => {

	/**  contract interface
	/*	_tokenURIs : {
		image : "",
		name : "",
		description : "",
		type : "",
		property : {},
		external_url : {},
		attributes : [
			"trait_type": "Base", 
      		"value": "Starfish"
		],
		traits : [
			"trait_type": "Base", 
      		"value": "Starfish"
		]
	}
	/* price : Number
	*/

	var tokenURIS = [];
	var prices = [];

	var keys = Object.keys(contents);
	keys.map((key, index) => {
		var type = contents[key]["type"];

		if (type == "building") {
			var tokenURI = { attributes: {} };

			tokenURI.image = ipfsHashes[key];
			tokenURI.name = contents[key]["name"];
			tokenURI.description = contents[key]["description"];
			tokenURI.type = contents[key]["type"];

			tokenURI.attributes.id = contents[key]["id"];
			tokenURI.attributes.locate_x = contents[key]["locate_x"];
			tokenURI.attributes.locate_y = contents[key]["locate_y"];

			console.log("tokenURI :", JSON.stringify(tokenURI));

			tokenURIS.push(JSON.stringify(tokenURI));
			prices.push(ethers.utils.parseUnits(contents[key]["price"], 0));
		}
		else if (type == "apartment") {
			for (let i = 0; i < 20; i++) {
				var tokenURI = { attributes: {} };

				tokenURI.image = ipfsHashes[key];
				tokenURI.name = contents[key]["name"];
				tokenURI.description = contents[key]["description"];
				tokenURI.type = contents[key]["type"];

				tokenURI.attributes.locate = contents[key]["locate"];
				tokenURI.attributes.roomId = (Math.floor(i / 4 + 1) + "0" + i % 4);
				tokenURIS.push(JSON.stringify(tokenURI));
				prices.push(ethers.utils.parseUnits(contents[key]["price"], 0));
			}
		}
		else if (type == "villa") {
			var tokenURI = { attributes: {} };

			tokenURI.image = ipfsHashes[key];
			tokenURI.name = contents[key]["name"];
			tokenURI.description = contents[key]["description"];
			tokenURI.type = contents[key]["type"];

			tokenURI.attributes.locate_x = contents[key]["locate_x"];
			tokenURI.attributes.locate_y = contents[key]["locate_y"];

			tokenURIS.push(JSON.stringify(tokenURI));
			prices.push(ethers.utils.parseUnits(contents[key]["price"], 0));
		}
		else if (type == "land") {
			for (let i = 0; i < 20; i++) {
				var tokenURI = { attributes: {} };

				tokenURI.image = ipfsHashes[key];
				tokenURI.name = contents[key]["name"];
				tokenURI.description = contents[key]["description"];
				tokenURI.type = contents[key]["type"];

				tokenURI.attributes.randId = i;

				tokenURIS.push(JSON.stringify(tokenURI));

				// console.log("price" + i + Math.floor(i / 10))
				prices.push(ethers.utils.parseUnits(contents[key]["price" + Math.floor(i / 10)], 0));

			}
		}
	})

	return {
		tokenURIS,
		prices
	}
}

const deployAtariNFT = async (atariCoin) => {
	const ICICBNFT = await hre.ethers.getContractFactory("AtariCasinoNFT");
	const icicbNFT = await ICICBNFT.deploy("Atari Casino NFT", "ACNFT", atariCoin);
	await icicbNFT.deployed();

	console.log("icicbNFT deployed to:", icicbNFT.address);

	//config

	const { tokenURIS, prices } = getInitialData();
	console.log(tokenURIS[1], prices[1]);

	var i, j, _tokenURIS, _prices, chunk = 20;

	for (i = 0, j = tokenURIS.length; i < j; i += chunk) {
		_tokenURIS = tokenURIS.slice(i, i + chunk);
		_prices = prices.slice(i, i + chunk);
		
		var tx = await icicbNFT.batchCreates(_tokenURIS, _prices);
		await tx.wait();
	}

	return icicbNFT;
};

module.exports = { deployAtariNFT };