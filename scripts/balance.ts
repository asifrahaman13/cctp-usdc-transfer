import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import dotenv from 'dotenv';

dotenv.config();

const cirleApiKey = process.env.CIRCLE_CCTP_API_KEY || '';
const entitySecret = process.env.ENTITY_SECRET || '';
console.log(cirleApiKey, entitySecret);

const client = initiateDeveloperControlledWalletsClient({
  apiKey: cirleApiKey,
  entitySecret: entitySecret,
});

async function walletTokenBalance(walletId: string) {
  console.log(walletId);
  const response = await client.getWalletTokenBalance({
    id: walletId,
  });

  return response;
}

async function main() {
  const [senderwalletBalanceAfter, receiverwalletBalanceAfter] =
    await Promise.all([
      walletTokenBalance('84abe70e-157b-5144-988c-f1f66053679f'),
      walletTokenBalance('4248ab47-91b5-55f6-bdd8-96cf170cebf3'),
    ]);
  console.log(senderwalletBalanceAfter.data?.tokenBalances);
  console.log(receiverwalletBalanceAfter.data?.tokenBalances);
}

main();
