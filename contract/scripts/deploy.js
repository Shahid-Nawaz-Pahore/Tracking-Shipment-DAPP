const hre = require("hardhat");
async function main() {

  
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
 const unlockTime = currentTimestampInSeconds + 60;
   const lockedAmount = hre.ethers.utils.parseEther("0.001");
  const Tracking_Shipment = await hre.ethers.deployContract("Tracking_Shipment");
  await Tracking_Shipment.deployed()
  console.log(
    `Tracking Shipment smart  contract with ${hre.ethers.utils.formatEther(
      lockedAmount
    )} ETH and  timestamp ${unlockTime} is deployed to ${Tracking_Shipment.address}`
  );
  console.log("verification process...")

  await run("verify:verify", {
    address: Tracking_Shipment.address,
    contract: "contracts/tracking_shipment.sol:Tracking_Shipment", 
    constructorArguments: [],
});
 
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
