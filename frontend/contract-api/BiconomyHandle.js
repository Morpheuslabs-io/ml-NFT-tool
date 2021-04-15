import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3 })

const BICONOMY_REGISTER = {
  API_URL: 'https://api.biconomy.io/api/v2/meta-tx/native',
  API_KEY: '5JPFVRvIC.296e1370-db70-433d-8a12-080508ace510',
  customERC721DappApiId: '6f4dd49f-0446-4b37-9823-0b8cb193f702',
}

const DOMAIN_NAME = 'morpheuslabs.io'
const DOMAIN_VERSION = '1'
const CHAIN_ID = 80001 // Matic testnet

const customERC721ContractAddress = '0x21569b5538f2CC5Fa60cD8B6C48D453C31a60bb1'

const forwardMetaTx = async (body) => {
  const { API_URL, API_KEY } = BICONOMY_REGISTER

  return new Promise((resolve, reject) => {
    axios
      .post(API_URL, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
      })
      .then((res) => resolve(res.data.txHash))
      .catch((error) => {
        console.log('forwardMetaTx - Error:', error)
        resolve(null)
      })
  })
}

const signTxData = async (senderAddress, data) => {
  const params = [senderAddress, JSON.stringify(data)]
  return new Promise((resolve, reject) => {
    window.ethereum
      .request({
        method: 'eth_signTypedData_v4',
        params,
        jsonrpc: '2.0',
        id: 999999999999,
        from: senderAddress,
      })
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const getSignatureParameters = (sig) => {
  const oriSig = sig.substring(2)
  const r = '0x' + oriSig.substring(0, 64)
  const s = '0x' + oriSig.substring(64, 128)
  const v = parseInt(oriSig.substring(128, 130), 16)

  return { r, s, v }
}

// Reference:
// https://github.com/nglglhtr/ETHOnline-Workshop/blob/6b615b8a4ef00553c17729c721572529303c8e1b/2-network-agnostic-transfer/meta-tx.js
const getTypedData = (data) => {
  const { name, version, chainId, verifyingContract, nonce, from, functionSignature } = data
  return {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
        {
          name: 'salt',
          type: 'bytes32',
        },
      ],
      MetaTransaction: [
        {
          name: 'nonce',
          type: 'uint256',
        },
        {
          name: 'from',
          type: 'address',
        },
        {
          name: 'functionSignature',
          type: 'bytes',
        },
      ],
    },
    domain: {
      name,
      version,
      verifyingContract,
      salt: '0x' + chainId.toString(16).padStart(64, '0'),
    },
    primaryType: 'MetaTransaction',
    message: {
      nonce: parseInt(nonce),
      from,
      functionSignature,
    },
  }
}

export const createCollectibleMetaTx = async (erc721Contract, senderAddress, tokenURI) => {
  const nonce = await erc721Contract.getSenderNonce(customERC721ContractAddress, senderAddress)

  const functionSignature = await erc721Contract.createCollectibleFuncSig(
    customERC721ContractAddress,
    tokenURI,
  )
  const dataToSign = getTypedData({
    name: DOMAIN_NAME,
    version: DOMAIN_VERSION,
    chainId: CHAIN_ID, //'0x' + CHAIN_ID.toString(16).padStart(64, '0'),
    verifyingContract: customERC721ContractAddress,
    nonce: nonce,
    from: senderAddress,
    functionSignature: functionSignature,
  })

  const signature = await signTxData(senderAddress, dataToSign)

  const { r, s, v } = getSignatureParameters(signature)

  const metaTxData = {
    to: customERC721ContractAddress,
    userAddress: senderAddress,
    apiId: BICONOMY_REGISTER.customERC721DappApiId,
    params: [senderAddress, functionSignature, r, s, v],
  }

  const txHash = await forwardMetaTx(metaTxData)
  return txHash
}
