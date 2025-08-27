# API


Curl:

```bash
curl -X POST http://localhost:5000/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "senderWalletId": "WALLET_ID_SENDER",
    "recipient": "RECIPIENT_ADDRESS"
  }'

```

Response:

```bash
{
  "approvalTx": "0x<approval_tx_hash>",
  "burnTx": "<burn_transaction_id>",
  "mintTx": "<mint_transaction_id>"
}
```