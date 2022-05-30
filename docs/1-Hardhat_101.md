```bash
mkdir hardhat-tutorial
cd hardhat-tutorial
npm init --yes
npm install --save-dev hardhat
```

## Create project hardhat project
1.
```bash
npx hardhat
```
### Hardhat Configuration file
When Hardhat is run, it searches for the closest `hardhat.config.js` file starting from the current working directory.
This file normally lives in the root of your project and an empty hardhat.config.js is enough for Hardhat to work. 
The entirety of your setup is contained in this file.

Select "Create an empty hardhat.config.js"
2. **Installing Plugins**

```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

* Hardhat is a development environment that helps developers compile, deploy, test, and debug their Ethereum applications
* ether.js - interacting with the Ethereum Blockchain from FE code
* waffle - Sweet tool for smart contracts testing 
* hardhat-waffle - Hardhat plugin for integration with Waffle
  
## Hardhat's architecture
  Hardhat is designed around the concepts of tasks and plugins. 
  The bulk of Hardhat's functionality comes from plugins, which as a developer you're free to choose the ones you want to use.

### Tasks
Every time you're running Hardhat from the CLI you're running a task.
e.g. `npx hardhat compile` is running the _compile_ task. 
To see the currently available tasks in your project, `run npx hardhat`. 

### Plugins
For this tutorial we are going to use the Ethers.js and Waffle plugins. They'll allow you to interact with Ethereum and to test your contracts
```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
```

