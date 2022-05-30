### Create simple smart contract that implements a token that can be transferred.
1. We're going to create a simple smart contract that implements a token that can be transferred. 
Token contracts are most frequently used to exchange or store value.
* There is a fixed total supply of tokens that can't be changed.
* The entire supply is assigned to the address that deploys the contract. 
* Anyone can receive tokens. 
* Anyone with at least one token can transfer tokens. 
* The token is non-divisible. You can transfer 1, 2, 3 or 37 tokens but not 2.5.

2. Start by creating a new directory called contracts and create a file inside the directory called Token.sol.

3. Compile contracts
```bash
npx hardhat compile
```

4. The compiled artifacts will be saved in the `artifacts/` directory by default, 
or whatever your configured artifacts path is

* **Artifacts And Debug files**
  Compiling with Hardhat generates two files per compiled contract (not each .sol file): an artifact and a debug file.
An artifact has all the information that is necessary to deploy and interact with the contract. 
These are compatible with most tools, including Truffle's artifact format. 
Each artifact consists of a json with the following properties:

The debug file has all the information that is necessary to reproduce the compilation and to debug the contracts: 
this includes the original solc input and output, and the solc version used to compile it.