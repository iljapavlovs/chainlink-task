#!/bin/sh
echo "Installing all needed dependencies..."
npm install
echo "Starting deployment of GetterSetter contract"
npx hardhat run scripts/getter-setter.deploy.ts --network kovan
echo "Deployment process finished successfully!"