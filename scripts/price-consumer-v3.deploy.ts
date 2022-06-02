import { ethers } from "hardhat";

async function main() {
  const PriceConsumerV3Factory = await ethers.getContractFactory(
    "PriceConsumerV3"
  );

  const priceConsumerV3Contract = await PriceConsumerV3Factory.deploy();

  // 3. Wait until Contract is deployed
  await priceConsumerV3Contract.deployed();

  // NO NEED to .wait() since this function is `view` function which does not create tx
  const ethUsdLatestPrice = await priceConsumerV3Contract.getLatestPrice();

  console.log("ethUsdLatestPrice: " + ethUsdLatestPrice);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
