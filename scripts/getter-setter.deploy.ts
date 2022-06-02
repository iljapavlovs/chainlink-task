import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as fs from "fs";

async function main() {
  // 1. Create a factory for creating contracts
  // (A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  // so Greeter here is a factory for instances of our greeter contract.)
  const GetterSetter = await ethers.getContractFactory("GetterSetter");
  // 2. Deploy  getterSetter contract
  // (Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract.
  // This is the object that has a method for each of your smart contract functions)
  const getterSetter = await GetterSetter.deploy();

  const LOG_FILE_NAME = "log.json";
  // 3. Wait until Contract is deployed
  await getterSetter.deployed();

  // 4. Get all accounts - 1st account from the array of `ethers.getSigners()` is the Account which performed the deployment
  // (A Signer in Ethers.js is an object that represents an Ethereum account.
  // It's used to send transactions to contracts and other accounts.
  // Here we're getting a list of the accounts in the node we're connected to,
  // which in this case is Hardhat Network, and only keeping the first and second ones.)
  const [owner]: SignerWithAddress[] = await ethers.getSigners();

  // Address on the Blockchain of owner Account
  console.log("Deployer address:", owner.address);

  // Address on the Blockchain of the getterSetter Contract
  console.log("GetterSetter Contract deployed to:", getterSetter.address);
  const uint256 = BigNumber.from(1111111111111);
  const bytes32 = ethers.utils.formatBytes32String("test32");
  const bytes = ethers.utils.formatBytes32String("test");

  console.log("Setting `uint256` variable with ", uint256.toString());
  const txUint256 = await getterSetter.setUint256(uint256);
  await txUint256.wait();

  console.log("Setting `bytes32` variable with ", bytes32);
  const txBytes32 = await getterSetter.setBytes32(bytes32);
  await txBytes32.wait();

  console.log("Setting `bytes` variable with ", bytes);
  const txBytes = await getterSetter.setBytes(bytes);
  await txBytes.wait();

  console.log("Waiting until all transactions will complete...");
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
