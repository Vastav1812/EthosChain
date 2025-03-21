<p align="center">
  <img src="frontend/public/ethoschain-logo.svg" alt="EthosChain Logo" width="200">
</p>

<h1 align="center">EthosChain: Transparent Charity Platform</h1>

<p align="center">
  A blockchain-based charity platform enabling transparent donation tracking and verification of charitable organizations
</p>

<p align="center">
  <a href="https://github.com/Vastav1812/EthosChain/actions/workflows/deploy.yml">
    <img src="https://github.com/Vastav1812/EthosChain/actions/workflows/deploy.yml/badge.svg" alt="Deploy to Netlify">
  </a>
  <a href="https://github.com/Vastav1812/EthosChain/actions/workflows/security.yml">
    <img src="https://github.com/Vastav1812/EthosChain/actions/workflows/security.yml/badge.svg" alt="Security Scanning">
  </a>
</p>

<p align="center">
  <a href="https://ethoschain.netlify.app/">✨ Live Demo</a>
</p>

## 🌟 Overview

EthosChain leverages blockchain technology to create a transparent, secure, and efficient platform for charitable giving. Our mission is to restore trust in charitable organizations by providing complete transparency in the donation process and fund usage.

## ✨ Key Features

- **Transparent Donations** - Track every donation on the blockchain
- **Charity Verification** - Verify organizations through external APIs
- **Impact Tracking** - Visualize the impact of your donations
- **Transparency Reports** - See detailed reports on fund usage
- **Cross-Chain Donations** - Donate across multiple blockchain networks
- **Recurring Donations** - Set up automated recurring contributions
- **Dashboard Analytics** - View comprehensive donation analytics
- **Smart Contract Security** - Donations secured by blockchain technology

## 🛠️ Technology Stack

### Frontend
- **Framework:** React with TypeScript
- **UI Library:** Material-UI (MUI)
- **Web3 Integration:** wagmi, viem, RainbowKit
- **State Management:** React Context API
- **Styling:** Emotion, styled-components
- **Build Tool:** Vite

### Blockchain
- **Network:** Ethereum (Sepolia testnet)
- **Smart Contracts:** Solidity
- **Contract Interaction:** Ethers.js

### CI/CD & DevOps
- **CI/CD:** GitHub Actions, Netlify
- **Security:** GitHub CodeQL, npm audit

## 📂 Project Structure

```
EthosChain/
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

## 🚀 Getting Started

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

Run the test suite:

```bash
cd frontend
npm test
```

Run linting:

```bash
npm run lint
```

## 🤝 Contributing

Interested in contributing to EthosChain? Check out our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## 📬 Contact

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

