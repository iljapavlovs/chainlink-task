const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    // A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
    // so Token here is a factory for instances of our token contract.
    const Greeter = await ethers.getContractFactory("Greeter");
    // Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract.
    // This is the object that has a method for each of your smart contract functions.
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    // greeter.greet() - performing transaction which will cost some gas
    expect(await greeter.greet()).to.equal("Hello, world!");
    // greeter.setGreeting() - performing transaction which will cost some gas
    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
