const hre = require("hardhat");

const deployCoin =async ()=>{

        const ERC20COin = await hre.ethers.getContractFactory("Ritcoin");
        const eRC20COin = await ERC20COin.deploy();

        await eRC20COin.deployed();
        
        console.log("eRC20COin deployed to:", eRC20COin.address);
}

deployCoin();