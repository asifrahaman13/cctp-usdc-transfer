# CCTP Cross-Chain USDC Transfer: Sepolia ↔ Polygon Amoy

This project enables cross-chain USDC transfers between Ethereum Sepolia and Polygon PoS Amoy testnets using Circle's Cross-Chain Transfer Protocol (CCTP). It consists of:

- **Backend**: Node.js/Express API for orchestrating CCTP transfers.
- **Frontend**: Next.js app (in the `web/` folder) for user interaction.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Notes](#notes)
- [Resources](#resources)

---

## Overview

Circle's CCTP enables secure, efficient USDC transfers between blockchains via a native burn-and-mint process. This project demonstrates CCTP between Sepolia (Ethereum testnet) and Polygon Amoy (Polygon testnet).

---

## Architecture

- **Backend (`src/`)**: Handles contract interactions, Circle API calls, and exposes REST endpoints.
- **Frontend (`web/`)**: Next.js app for initiating transfers and viewing status.

---

## Prerequisites

- Node.js (v18+ recommended)
- npm
- Testnet USDC on Sepolia and Polygon Amoy
- ETH (Sepolia) and MATIC (Amoy) for gas fees
- Circle API credentials (CCTP API Key, Entity Secret)
- Infura Project ID

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root:
   ```
   CIRCLE_CCTP_API_KEY=your_circle_api_key
   ENTITY_SECRET=your_entity_secret
   INFURA_PROJECT_ID=your_infura_project_id
   PORT=3001
   ```

3. **Start the backend server:**
   ```bash
   npm run start
   ```
   The API will run on the port specified in `.env` (default: 3001).

---

## Frontend Setup (`web/`)

1. **Navigate to the frontend folder:**
   ```bash
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in `web/`:
   ```
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
   NEXT_PUBLIC_WALLET_PRIVATE_KEY=your_wallet_private_key
   NEXT_PUBLIC_CIRCLE_API_KEY=your_circle_api_key
   ```

4. **Start the Next.js app:**
   ```bash
   npm run dev
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

---

## How It Works

### Backend Flow

1. **Approve USDC**: The sender wallet approves the Token Messenger contract to burn USDC.
2. **Burn USDC**: USDC is burned on Sepolia via the Token Messenger contract.
3. **Attestation**: The backend polls Circle's attestation service for proof of burn.
4. **Mint USDC**: The backend calls the mint function on Polygon Amoy, releasing USDC to the recipient.

### Frontend Flow

- Users input transfer details (amount, recipient address).
- The frontend calls the backend API to initiate the transfer.
- Status and transaction hashes are displayed.

---

## API Reference

### POST `/api/transaction`

Initiates a cross-chain USDC transfer.

**Request Body:**
```json
{
  "senderWalletId": "string",
  "recipientAddress": "string",
  "amount": "string" // USDC amount (decimal, 6 decimals)
}
```

**Response:**
```json
{
  "approvalTx": "0x...", // Approval transaction hash
  "burnTx": "0x...",     // Burn transaction ID
  "mintTx": "0x..."      // Mint transaction ID
}
```

### GET `/api/health`

Returns API health status.

---

## Notes

- Only testnet environments are supported (Sepolia, Polygon Amoy).
- Ensure wallets have sufficient USDC and gas tokens.
- Private keys and secrets must be handled securely.
- Contract addresses and ABIs are set in `src/config/config.ts`.

---

## Resources

- [Circle CCTP Documentation](https://developers.circle.com/stablecoins/docs/cctp-getting-started)
- [CCTP Supported Blockchains](https://developers.circle.com/stablecoins/cctp-supported-blockchains)
- [CCTP FAQ](https://developers.circle.com/stablecoins/docs/cctp-faq)

---

## License

MIT
