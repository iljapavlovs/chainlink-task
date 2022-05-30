import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("GetterSetter contract", function () {
  let GetterSetterFactory: ContractFactory;
  let getterSetterContract: Contract;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    GetterSetterFactory = await ethers.getContractFactory("GetterSetter");
    [owner] = await ethers.getSigners();

    getterSetterContract = await GetterSetterFactory.deploy();
    await getterSetterContract.deployed();
  });

  it("Should set and get a value", async function () {
    const tx = await getterSetterContract.setUint256(256);
    await tx.wait();
    expect(await getterSetterContract.getUint256()).to.equal(256);
  });
  it("Should emit an event when setting a value", async function () {
    const byte32text = ethers.utils.formatBytes32String("test");
    await expect(getterSetterContract.setBytes32(byte32text))
      .to.emit(getterSetterContract, "SetBytes32")
      .withArgs(owner.address, byte32text);
  });
});
