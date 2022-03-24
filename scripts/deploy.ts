import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as fs from "fs";

async function main() {
  const GetterSetter = await ethers.getContractFactory("GetterSetter");
  const getterSetter = await GetterSetter.deploy();
  const [owner]: SignerWithAddress[] = await ethers.getSigners();
  const LOG_FILE_NAME = "log.json";
  await getterSetter.deployed();

  console.log("Deployer address:", owner.address);

  console.log("GetterSetter Contract deployed to:", getterSetter.address);
  const uint256 = BigNumber.from(1111111111111);
  const bytes32 = ethers.utils.formatBytes32String("test32");
  const bytes = ethers.utils.formatBytes32String("test");

  console.log("Setting `uint256` variable with ", uint256.toString());
  const txUint256 = await getterSetter.setUint256(uint256);
  console.log("Setting `bytes32` variable with ", bytes32);
  const txBytes32 = await getterSetter.setBytes32(bytes32);
  console.log("Setting `bytes` variable with ", bytes);
  const txBytes = await getterSetter.setBytes(bytes);

  console.log("Waiting until all transactions will complete...");
  await txUint256.wait();
  await txBytes32.wait();
  await txBytes.wait();
  console.log("Transactions completed!");

  const uint256FromContract = await getterSetter.getUint256();
  const bytes32FromContract = await getterSetter.getBytes32();
  const bytesFromContract = await getterSetter.getBytes();
  console.log("Value of `uint256` variable = %s", uint256FromContract);
  console.log("Value of `txBytes32` variable = %s", bytes32FromContract);
  console.log("Value of `txBytes` variable = %s", bytesFromContract);
  const data = {
    contractAddress: getterSetter.address,
    deployerAddress: owner.address,
    uint256VariableSet: uint256FromContract,
    bytes32VariableSet: bytes32FromContract,
    bytesVariableSet: bytesFromContract,
  };

  try {
    fs.writeFileSync(LOG_FILE_NAME, JSON.stringify(data, null, 2), "utf8");
    console.log(`Data successfully saved to ${LOG_FILE_NAME}`);
  } catch (error) {
    console.log("An error has occurred while writing data to JSON file", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
