const ipfs = require("./ipfs_api");
const fs = require('fs');
const content = require("../../resources/contents.json")

const upload_IFPS =async (Num)=>{
    const basic_ipfs_url = "https://ipfs.io/ipfs/";

    const basic_file_path = "./resources/contents/";
    var ipfsHashes = {};

    var keys = Object.keys(content);
    for (var i = 0; i < keys.length; i++) {
        const contents = fs.readFileSync(basic_file_path+keys[i]+".png");
        console.log(basic_file_path+keys[i]+".png");
        var result = await ipfs.files.add(contents);
        var ipfsHash = "https://ipfs.io/ipfs/"+result[0].hash;
        console.log(ipfsHash);
        ipfsHashes[keys[i]] = ipfsHash;
    } 
    fs.writeFile("./resources/ipfshashes.json",JSON.stringify(ipfsHashes,null,4), function(err,content){
        if (err) throw err;
        console.log('complete');
});
}

upload_IFPS(10)