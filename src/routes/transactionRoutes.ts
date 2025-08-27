import { Router } from 'express';
import { ethers } from 'ethers';
import { encodeAddress } from '../utils/web3Helper';
import {
  approveUSDC,
  waitForTransaction,
  depositForBurn,
  walletIdFromAddress,
  mintDestination,
} from '../core/contracts/contractBridge';

const router = Router();

router.post('/transaction', async (req, res) => {
  try {
    const { senderWalletId, recipientAddress, amount } = req.body;
    if (!senderWalletId || !recipientAddress || !amount) {
      return res.status(400).json({
        error: 'senderWalletId, recipientAddress and amount are required',
      });
    }

    const rawAmount = ethers.parseUnits(amount, 6).toString();

    // Step 1: Approve
    const approvalId = await approveUSDC(senderWalletId, rawAmount);
    if (!approvalId) throw new Error('Approval transaction ID is undefined');
    const approvalHash = await waitForTransaction(approvalId);

    // Step 2: Burn
    const encodedRecipient = encodeAddress(recipientAddress);
    const depositResponse = await depositForBurn(
      senderWalletId,
      encodedRecipient,
      rawAmount,
    );
    const burnId = depositResponse?.id;
    if (!burnId) throw new Error('Burn transaction ID is undefined');
    await waitForTransaction(burnId);

    // Step 3: Mint
    const recipientWalletId = await walletIdFromAddress(recipientAddress);
    if (!recipientWalletId) throw new Error('Recipient wallet ID is undefined');
    const mintResponse = await mintDestination(burnId, recipientWalletId);

    return res.json({
      approvalTx: approvalHash,
      burnTx: burnId,
      mintTx: mintResponse?.id,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

export default router;
