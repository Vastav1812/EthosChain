# EthosChain: Transparent Charity Platform

A blockchain-based charity platform that enables transparent donation tracking and verification of charity organizations.

[![Deploy to Netlify](https://github.com/Vastav1812/EthosChain/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vastav1812/EthosChain/actions/workflows/deploy.yml)
[![Test and Lint](https://github.com/Vastav1812/EthosChain/actions/workflows/test-and-lint.yml/badge.svg)](https://github.com/Vastav1812/EthosChain/actions/workflows/test-and-lint.yml)
[![Security Scanning](https://github.com/Vastav1812/EthosChain/actions/workflows/security.yml/badge.svg)](https://github.com/Vastav1812/EthosChain/actions/workflows/security.yml)

## Visit EthosChain

Check out the live demo by visiting the site:
[EthosChain Demo](https://ethoschain.netlify.app/)

## Features

- Create and manage charity organizations
- Make transparent donations on the blockchain
- Verify charitable organizations through external APIs
- Track donation impact and charity performance
- Cross-chain donation capabilities
- Recurring donation setup
- Impact tracking and metrics visualization
- Transparency reports for fund usage

## Technology Stack

### Frontend
- **Framework:** React with TypeScript
- **UI Library:** Material-UI (MUI)
- **Web3 Integration:** wagmi, viem, RainbowKit
- **State Management:** React Context API
- **Styling:** Emotion, styled-components
- **Package Manager:** npm
- **Build Tool:** Vite

### Backend/Blockchain
- **Network:** Ethereum (Sepolia testnet)
- **Smart Contracts:** Solidity
- **Contract Interaction:** Ethers.js

### CI/CD & DevOps
- **CI/CD:** GitHub Actions, Netlify
- **Testing:** Vitest, React Testing Library
- **Code Quality:** ESLint, TypeScript
- **Security:** GitHub CodeQL, npm audit

## Project Structure

```
blockchain-charity-platform/
├── .github/workflows/    # CI/CD configuration
├── frontend/             # React frontend application
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API and service functions
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Entry point
├── contracts/            # Solidity smart contracts
└── scripts/              # Deployment and utility scripts
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- MetaMask or another Ethereum wallet extension

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vastav1812/EthosChain.git
cd EthosChain
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file in the frontend directory with required environment variables:
```
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_CONTRACT_ADDRESS=your_contract_address
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Continuous Integration & Deployment

The project uses GitHub Actions for CI/CD pipelines:

### Workflows

1. **Deploy to Netlify** (`.github/workflows/deploy.yml`)
   - Triggered on pushes to the main branch affecting frontend code
   - Builds the application and deploys to Netlify production

2. **Test and Lint** (`.github/workflows/test-and-lint.yml`)
   - Runs on pushes and pull requests to verify code quality
   - Executes linting, type checking, and unit tests

3. **Security Scanning** (`.github/workflows/security.yml`)
   - Runs on pushes, pull requests, and weekly schedule
   - Performs npm audit, GitHub CodeQL analysis, and dependency review

### Deployment

The application is automatically deployed to Netlify using GitHub Actions when changes are pushed to the main branch. The deployment configuration can be found in `.github/workflows/deploy.yml`.

### Setting Up Secrets

To set up the CI/CD pipeline, you need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository > Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - `VITE_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
   - `VITE_CONTRACT_ADDRESS`: Your deployed contract address

## Manual Deployment

If you need to deploy manually:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Netlify using the Netlify CLI:
```bash
npx netlify deploy --prod
```

## Testing

Run the test suite:

```bash
cd frontend
npm test
```

Run linting:

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Link: [https://github.com/Vastav1812/EthosChain](https://github.com/Vastav1812/EthosChain)

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

