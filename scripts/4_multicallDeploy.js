const hre = require("hardhat");

const deployMulticall =async  ()=>{

    const Multicall = await hre.ethers.getContractFactory("multicall");
    const multicall = await Multicall.deploy();

    await multicall.deployed();
    
    console.log("multicall deployed to:", multicall.address);
    
    return multicall;
}

module.exports = {deployMulticall}