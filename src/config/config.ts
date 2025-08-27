import dotenv from 'dotenv';

dotenv.config();

const CIRCLE_CCTP_API_KEY = process.env.CIRCLE_CCTP_API_KEY || '';
const ENTITY_SECRET = process.env.ENTITY_SECRET || '';
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || '';
const PORT = parseInt(process.env.PORT || '');
console.log('The port', PORT);

const TokenMessengerContract = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const SepoliaTokenMessageContract =
  '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5';
const MessageTransmitter = '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD';

export { PORT, CIRCLE_CCTP_API_KEY, ENTITY_SECRET, INFURA_PROJECT_ID, TokenMessengerContract, SepoliaTokenMessageContract, MessageTransmitter };
