import axios from 'axios';
import Web3 from 'web3';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import {
  CIRCLE_CCTP_API_KEY,
  ENTITY_SECRET,
  INFURA_PROJECT_ID,
  SepoliaTokenMessageContract,
  TokenMessengerContract,
  MessageTransmitter,
} from '../../config/config';
import { delay } from '../../utils/asyncHelper';

const web3 = new Web3(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);

const client = initiateDeveloperControlledWalletsClient({
  apiKey: CIRCLE_CCTP_API_KEY,
  entitySecret: ENTITY_SECRET,
});

async function approveUSDC(senderWalletId: string, amount: string) {
  const response = await client.createContractExecutionTransaction({
    walletId: senderWalletId,
    abiFunctionSignature: 'approve(address,uint256)',
    abiParameters: [SepoliaTokenMessageContract, amount],
    contractAddress: TokenMessengerContract,
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  return response.data?.id;
}

async function depositForBurn(
  senderWalletId: string,
  recipientAddress: string,
  amount: string,
) {
  const response = await client.createContractExecutionTransaction({
    walletId: senderWalletId,
    abiFunctionSignature: 'depositForBurn(uint256,uint32,bytes32,address)',
    abiParameters: [amount, 7, recipientAddress, TokenMessengerContract],
    contractAddress: SepoliaTokenMessageContract,
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  return response.data;
}

async function waitForTransaction(id: string) {
  let status = 'pending';
  let txHash = null;

  while (status !== 'CONFIRMED' && status !== 'FAILED') {
    const response = await client.getTransaction({ id });
    const tx = response?.data?.transaction;
    status = tx?.state || 'pending';
    txHash = tx?.txHash;

    console.log(`Transaction ${id} status: ${status}`);

    if (status === 'CONFIRMED') {
      return txHash;
    }
    if (status === 'FAILED') {
      throw new Error(`Transaction ${id} failed: ${tx?.errorReason}`);
    }
    await delay(3000);
  }
}

async function walletIdFromAddress(address: string) {
  const response = await client.listWallets({ address: address });
  const wallets = response.data?.wallets || [];
  if (wallets.length === 0) throw new Error('No wallet found for this address');
  return wallets[0].id;
}

async function mintDestination(id: string, receiverWalletId: string) {
  const response = await client.getTransaction({ id });
  const transaction = response?.data?.transaction;

  if (!transaction?.txHash) {
    throw new Error('Transaction hash is missing');
  }

  const receipt = await web3.eth.getTransactionReceipt(transaction.txHash);
  const eventTopic = web3.utils.keccak256('MessageSent(bytes)');
  const log = receipt.logs.find((l: any) => l.topics[0] === eventTopic);
  if (!log || !log.data) throw new Error('MessageSent log not found');

  const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log.data)[0];
  const messageHash = web3.utils.keccak256(messageBytes as string);

  let attestationResponse = { status: 'pending', attestation: '' };
  while (attestationResponse.status !== 'complete') {
    const { data } = await axios.get(
      `https://iris-api-sandbox.circle.com/attestations/${messageHash}`,
    );
    attestationResponse = data;
    await delay(2000);
  }

  const mintResponse = await client.createContractExecutionTransaction({
    walletId: receiverWalletId,
    abiFunctionSignature: 'receiveMessage(bytes,bytes)',
    abiParameters: [messageBytes, attestationResponse.attestation],
    contractAddress: MessageTransmitter,
    fee: { type: 'level', config: { feeLevel: 'MEDIUM' } },
  });
  return mintResponse.data;
}

export {
  approveUSDC,
  depositForBurn,
  waitForTransaction,
  walletIdFromAddress,
  mintDestination,
};
