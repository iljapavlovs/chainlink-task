#!/bin/sh
echo "Installing all needed dependencies..."
npm ci
echo "Starting deployment of GetterSetter contract"
npx hardhat run scripts/deploy.ts
echo "Deployment process finished successfully!"