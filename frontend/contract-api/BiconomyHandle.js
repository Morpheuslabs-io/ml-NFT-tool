import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3 })

let biconomyApiURL
let biconomyApiKey
let biconomy_morpheusNftManagerDappApiId
let domainName
let domainVersion

const forwardMetaTx = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(biconomyApiURL, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': biconomyApiKey,
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
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
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
      chainId: Number(chainId),
      verifyingContract,
    },
    primaryType: 'MetaTransaction',
    message: {
      nonce: Number(nonce),
      from,
      functionSignature,
    },
  }
}

export const setBiconomyEnv = (
  biconomyApiURL_,
  biconomyApiKey_,
  biconomy_morpheusNftManagerDappApiId_,
  domainName_,
  domainVersion_,
) => {
  biconomyApiURL = biconomyApiURL_
  biconomyApiKey = biconomyApiKey_
  biconomy_morpheusNftManagerDappApiId = biconomy_morpheusNftManagerDappApiId_
  domainName = domainName_
  domainVersion = domainVersion_
}

// erc721Contract
export const createCollectibleMetaTx = async (
  erc721Contract,
  erc721ContractAddress,
  senderAddress,
  chainId,
  tokenURI,
) => {
  const nonce = await erc721Contract.getSenderNonce(erc721ContractAddress, senderAddress)

  const functionSignature = await erc721Contract.createCollectibleFuncSig(
    erc721ContractAddress,
    tokenURI,
  )
  const dataToSign = getTypedData({
    name: domainName,
    version: domainVersion,
    chainId,
    verifyingContract: erc721ContractAddress,
    nonce,
    from: senderAddress,
    functionSignature,
  })

  const signature = await signTxData(senderAddress, dataToSign)

  const { r, s, v } = getSignatureParameters(signature)

  const metaTxData = {
    to: erc721ContractAddress,
    userAddress: senderAddress,
    apiId: biconomy_morpheusNftManagerDappApiId,
    params: [senderAddress, functionSignature, r, s, v],
  }

  const txHash = await forwardMetaTx(metaTxData)
  return txHash
}

// erc721Contract
export const addAuthorizedMetaTx = async (
  erc721Contract,
  erc721ContractAddress,
  senderAddress,
  chainId,
  userWalletAddress,
) => {
  const nonce = await erc721Contract.getSenderNonce(erc721ContractAddress, senderAddress)

  const functionSignature = await erc721Contract.addAuthorizedFuncSig(
    erc721ContractAddress,
    userWalletAddress,
  )
  const dataToSign = getTypedData({
    name: domainName,
    version: domainVersion,
    chainId,
    verifyingContract: erc721ContractAddress,
    nonce,
    from: senderAddress,
    functionSignature,
  })

  const signature = await signTxData(senderAddress, dataToSign)

  const { r, s, v } = getSignatureParameters(signature)

  const metaTxData = {
    to: erc721ContractAddress,
    userAddress: senderAddress,
    apiId: biconomy_morpheusNftManagerDappApiId,
    params: [senderAddress, functionSignature, r, s, v],
  }

  const txHash = await forwardMetaTx(metaTxData)
  return txHash
}
