# Deployment
To indicate Hardhat to connect to a specific Ethereum network when running any tasks, you can use the --network parameter. Like this:
```bash 
npx hardhat run scripts/deploy.js --network <network-name>
```
In this case, running it without the `--network` parameter would get the code to run against an embedded instance of Hardhat Network, 
so the deployment actually gets lost when Hardhat finishes running,
 but it's still useful to test that our deployment code works: