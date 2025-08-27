import Web3 from 'web3';

function encodeAddress(address: string) {
  const web3 = new Web3();
  const encodedDestinationAddress = web3.eth.abi.encodeParameter(
    'address',
    address,
  );

  console.log(encodedDestinationAddress);
  return encodedDestinationAddress;
}

export {encodeAddress}