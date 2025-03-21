# EthosChain - Transparent Blockchain Charity

![EthosChain Logo](frontend/public/ethoschain-logo.svg)

EthosChain is a transparent blockchain-based charity platform built on Ethereum that ensures complete transparency and accountability for donations.

## Visit EthosChain

Check out the live demo by visiting the site:
[EthosChain Demo](https://ethoschain.netlify.app/)

## Features

- Create and manage charities with full transparency
- Create organizations to receive and distribute funds
- Make direct donations to charities
- View transaction history in real-time
- Connect with MetaMask or other Ethereum wallets
- Support for Sepolia testnet

## Tech Stack

- **Frontend:** React, TypeScript, Material UI, RainbowKit
- **Smart Contracts:** Solidity, Truffle
- **Blockchain Interaction:** wagmi, viem
- **CI/CD:** GitHub Actions, Netlify

## Project Structure

```
ethoschain/
├── contracts/            # Solidity smart contracts
├── frontend/             # React frontend application
├── migrations/           # Truffle migration scripts
├── test/                 # Smart contract tests
└── .github/workflows/    # CI/CD configuration
```

## Local Development

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension
- Truffle (for smart contract development)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Vastav1812/EthosChain.git
   cd EthosChain
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend
   npm install
   ```

3. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Blockchain Development

1. Compile smart contracts:
   ```
   truffle compile
   ```

2. Deploy to local network:
   ```
   truffle migrate
   ```

3. Deploy to testnet:
   ```
   truffle migrate --network sepolia
   ```

## Deployment

The application is automatically deployed to Netlify using GitHub Actions when changes are pushed to the main branch.

### Manual Deployment

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Deploy to Netlify:
   ```
   npx netlify deploy --prod
   ```

## Setting Up CI/CD

To set up the CI/CD pipeline, you need to add the following secrets to your GitHub repository:

1. `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
2. `NETLIFY_SITE_ID`: The ID of your Netlify site

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Features ✨
- **Donate ETH** to the charity with a single click.
- **Withdraw funds** (admin-only) with full transaction history.
- **View all transactions** (donations/withdrawals) in real-time.
- **Immutable records** stored on the Ethereum blockchain.

## Tech Stack 🛠️
- **Smart Contracts**: Solidity, Truffle, Ganache
- **Frontend**: React, TypeScript, Web3.js
- **Testing**: Truffle (Mocha/Chai), React Testing Library
- **Deployment**: Ethereum Testnet (Goerli), Vercel/Netlify

## Prerequisites 📋
- MetaMask browser extension
- Node.js ≥ v16
- Truffle Suite: `npm install -g truffle`
- Ganache (local blockchain)

## Installation 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/blockchain-charity-platform.git
cd blockchain-charity-platform
```
### 2. Start Local Blockchain
- Open Ganache and create a new workspace.
- Update truffle-config.js to match Ganache's RPC server (port 7545).

