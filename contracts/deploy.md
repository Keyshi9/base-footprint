# Deploying BaseFootprintNFT Contract

## Option 1: Using Remix (Easiest)

1. **Open Remix**: Go to [remix.ethereum.org](https://remix.ethereum.org)

2. **Create Contract File**:
   - Create a new file called `BaseFootprintNFT.sol`
   - Copy the contract code from `contracts/BaseFootprintNFT.sol`

3. **Install OpenZeppelin**:
   - In Remix, go to the "File Explorer" tab
   - Click the "+" icon and create a `.deps` folder if needed
   - Remix will auto-import OpenZeppelin when you compile

4. **Compile**:
   - Go to "Solidity Compiler" tab
   - Select compiler version `0.8.20` or higher
   - Click "Compile BaseFootprintNFT.sol"

5. **Deploy to Base**:
   - Go to "Deploy & Run Transactions" tab
   - Set Environment to "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to **Base** network
   - Select `BaseFootprintNFT` contract
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. **Copy Contract Address**:
   - After deployment, copy the contract address
   - Update `src/contracts/nftConfig.js` with this address

## Option 2: Using Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Install OpenZeppelin
npm install @openzeppelin/contracts

# Create deployment script in scripts/deploy.js
# Run deployment
npx hardhat run scripts/deploy.js --network base
```

## Base Network Details

**Base Mainnet**:
- RPC URL: `https://mainnet.base.org`
- Chain ID: `8453`
- Block Explorer: `https://basescan.org`

**Base Sepolia (Testnet)**:
- RPC URL: `https://sepolia.base.org`
- Chain ID: `84532`
- Block Explorer: `https://sepolia.basescan.org`
- Faucet: [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

## After Deployment

1. Copy the deployed contract address
2. Update `src/contracts/nftConfig.js`:
   ```javascript
   export const NFT_CONTRACT_ADDRESS = "0xYourContractAddress";
   ```
3. Verify contract on BaseScan (optional but recommended)
4. Test minting from the UI
