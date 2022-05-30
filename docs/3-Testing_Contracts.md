#

```bash
npx hardhat test
```

Writing automated tests when building smart contracts is of crucial importance, 
as your user's money is what's at stake. 
For this we're going to use Hardhat Network, 
a local Ethereum network designed for development that is built-in and the default network in Hardhat.
You don't need to setup anything to use it.
In our tests we're going to use ethers.js to interact with the Ethereum contract we built in the previous section, 
and Mocha (opens new window)as our test runner.

## Ethers.js
```js
const [owner] = await ethers.getSigners();//gettting all accounts that we have access to. run `npx hardhat accounts` to see all accounts that are started in Hardhhat
```
A Signer in ethers.js is an object that represents an Ethereum account. 
It's used to send transactions to contracts and other accounts. 
Here we're getting a list of the accounts in the node we're connected to, which in this case is Hardhat Network, and only keeping the first one.

