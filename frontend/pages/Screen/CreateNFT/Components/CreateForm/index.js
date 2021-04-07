import React from 'react'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Button, Form, Input, Tooltip, Spin, Alert, notification, Select, Upload, Tag } from 'antd'
import ImgCrop from 'antd-img-crop'
const { Option } = Select
import Erc721Contract from 'contract-api/Erc721Contract'
import Erc1155Contract from 'contract-api/Erc1155Contract'
import Web3Service from 'controller/Web3'
import IPFS from 'ipfs-http-client'
import axios from 'axios'
import './style.scss'

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const DEFAULT_GAS_PRICE = 50 // GWei
const explorerLink = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  5: 'https://goerli.etherscan.io',
  42: 'https://kovan.etherscan.io',
  80001: 'https://mumbai-explorer.matic.today',
  137: 'https://explorer.matic.network',
}

const networkName = {
  1: 'Ethereum Mainnet',
  3: 'Ethereum Testnet Ropsten',
  4: 'Ethereum Testnet Rinkeby',
  5: 'Ethereum Testnet Goerli',
  42: 'Ethereum Testnet Kovan',
  80001: 'Matic Mumbai Testnet',
  137: 'Matic Mainnet',
}

class CreateForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imgLoading: false,
      imgBase64: null,
      nftOpResult: null,
      networkID: null,
      address: null,
      selectedNftStandard: 'ERC721',
      isCreateCollection: true,
      nftColelctionName: null,
    }
    this.formRef = React.createRef()
  }
  componentDidMount() {
    if (window.ethereum) {
      window.ethereum
        .enable()
        .then((accounts) => {
          const defaultAddress = accounts[0]
          this.erc721Contract = new Erc721Contract(defaultAddress)
          this.erc1155Contract = new Erc1155Contract(defaultAddress)
          Web3Service.getNetWorkId().then((networkID) => {
            console.log(`defaultAddress:${defaultAddress}`)
            this.setState({ networkID, address: defaultAddress })
          })
        })
        .catch((error) => {
          console.error('window.ethereum.enable - Error:', error)
        })
    }
  }

  handleSelectChange = (value) => {
    // value: create_collection or create_item
    this.setState({
      isCreateCollection: value === 'create_collection',
      nftColelctionName: null,
    })
  }

  onChangeSwitch = (value) => {
    this.setState(
      {
        enableSend: value,
      },
      () => {
        this.onChangeKeyAndValue('enableSend', value)
      },
    )
  }
  onChangeOwnerMessage = (value) => {
    this.setState({
      ownerMessage: value,
    })
    this.onChangeKeyAndValue('ownerMessage', value)
  }
  queryGasPrice = async () => {
    return new Promise((resolve, reject) => {
      axios
        .get('https://ethgasstation.info/json/ethgasAPI.json')
        .then((res) => {
          const gasPrice = Number(res.data.average) / 10
          resolve(gasPrice)
        })
        .catch((err) => {
          resolve(DEFAULT_GAS_PRICE)
        })
    })
  }
  onFinish = async (values) => {
    const callbackOnFinish = async () => {
      this.setState({
        loading: true,
        nftOpResult: null,
      })
      const {
        nftName,
        nftSymbol,
        nftColelctionAddress,
        nftDescription,
        nftExternalLink,
        nftImage,
      } = values
      const { imgBase64, address, isCreateCollection } = this.state

      // let retrievedNftName
      // if (!isCreateCollection) {
      //   retrievedNftName = await this.erc721Contract.name(nftColelctionAddress)
      //   if (!retrievedNftName) {
      //     notification.open({
      //       message: 'Collection address not found',
      //       description: `Please ensure collection address is valid on ${
      //         networkName[this.state.networkID] || '...'
      //       }`,
      //     })
      //     this.setState({ nftColelctionName: null })
      //     return
      //   }
      //   this.setState({ nftColelctionName: retrievedNftName })
      //   console.log('retrievedNftName:', retrievedNftName)
      // }

      // Upload to IPFS
      let ipfsResult = await ipfs.add(Buffer(imgBase64))
      const ipfsHash = ipfsResult[0].hash
      let external_url = nftExternalLink !== '' ? nftExternalLink : null
      const image = `ipfs://${ipfsHash}`
      console.log('nftExternalLink:', nftExternalLink)

      // This is only the content that the tokenURI returns
      const tokenURIContent = JSON.stringify({
        name: nftName,
        description: nftDescription,
        external_url,
        image,
      })

      // Upload the entire JSON to get the tokenURI
      ipfsResult = await ipfs.add(Buffer(tokenURIContent))
      const tokenURI = ipfsResult[0].hash
      console.log('tokenURI:', tokenURI)

      let gasPrice = await this.queryGasPrice()
      gasPrice = gasPrice * Math.pow(10, 9)

      if (isCreateCollection) {
        let result
        if (this.state.selectedNftStandard === 'ERC721') {
          result = await this.erc721Contract.create({
            name: nftName,
            symbol: nftSymbol,
            to: address,
            tokenURI,
            gasPrice,
          })
        } else {
          result = await this.erc1155Contract.create({
            name: nftName,
            symbol: nftSymbol,
            to: address,
            tokenURI: nftImage,
          })
        }
        this.setState({
          loading: false,
          nftOpResult: result
            ? {
                address: result.address,
                tx: result.transactionHash,
              }
            : null,
        })
      } else {
        let result
        if (this.state.selectedNftStandard === 'ERC721') {
          result = await this.erc721Contract.createCollectible({
            contractAddress: nftColelctionAddress,
            tokenURI,
            gasPrice,
          })
        } else {
          // result = await this.erc1155Contract.create({
          //   name: nftName,
          //   symbol: nftSymbol,
          //   to: address,
          //   tokenURI: nftImage,
          // })
        }
        console.log('result:', result)
        this.setState({
          loading: false,
          nftOpResult: result
            ? {
                // address: result.address,
                tx: result.tx,
              }
            : null,
        })
      }
    }
    const isSigned = this.state.address !== null
    if (!isSigned) {
      notification.open({
        message: 'Metamask is locked',
        description: 'Please click the Metamask to unlock it',
        onClick: () => {
          console.log('Notification Clicked!')
        },
      })
    } else {
      callbackOnFinish()
    }
  }
  generateNumber = (min = 1, max = 10000) => {
    // const rand = Math.floor(Math.random() * (max - min + 1) + min)
    // return rand
    return 1
  }

  getCurrAddress = async () => {
    return new Promise((resolve) => {
      window.ethereum
        .enable()
        .then((accounts) => {
          const defaultAddress = accounts[0]
          return resolve(defaultAddress)
        })
        .catch((e) => {
          console.error(e)
        })
    })
  }
  onNftStandardChange = (e) => {
    if (this.state.selectedNftStandard !== e) {
      this.setState({ selectedNftStandard: e })
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ imgLoading: true })
      return
    }
    if (info.file.status === 'done') {
      const reader = new FileReader()
      reader.readAsArrayBuffer(info.file.originFileObj) // convert file to array for buffer
      reader.onloadend = () => {
        this.setState({ imgBase64: Buffer(reader.result), imgLoading: false })
      }
    }
  }

  onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow.document.write(image.outerHTML)
  }

  onBlur = async (e) => {
    if (e.target && e.target.value !== '' && this.erc721Contract) {
      const retrievedNftName = await this.erc721Contract.name(e.target.value)
      if (!retrievedNftName) {
        notification.open({
          message: 'Collection address not found',
          description: `Please ensure collection address is valid on ${
            networkName[this.state.networkID] || '...'
          }`,
        })
        this.setState({ nftColelctionName: null })
        return
      }
      this.setState({ nftColelctionName: retrievedNftName })
    }
  }

  render() {
    const { nftOpResult, networkID, selectedNftStandard, nftColelctionName } = this.state
    const layout = {
      labelCol: { span: 13 },
      wrapperCol: { span: 11 },
    }

    const { loading, imgBase64, isCreateCollection } = this.state

    return (
      <div className="create-form-container">
        <div className="wrapper">
          <div
            className="page-title"
            style={{ textAlign: 'center', color: '#ffffff', padding: '40px' }}
          >
            {`NFT Launch Pad for ${networkName[networkID] || '...'}`}
          </div>
          <Form
            ref={this.formRef}
            {...layout}
            name="create-nft"
            labelAlign="left"
            initialValues={{
              numberOfIssuing: 1,
              remember: true,
              nftDescription: '',
              nftExternalLink: 'https://',
              enableSend: true,
              ownerMessage: '',
              nftID: this.generateNumber(),
              // nftOwner: '',
              nftStandard: 'ERC721',
              nftColelctionAddress: '',
            }}
            onFinish={this.onFinish}
          >
            <Form.Item>
              <Select defaultValue="create_collection" onChange={this.handleSelectChange}>
                <Option value="create_collection">Create new collection</Option>
                <Option value="create_item">Add item to an existing collection</Option>
              </Select>
            </Form.Item>

            <Tooltip title="Select NFT token standard">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Standard</div>}
                name="nftStandard"
                rules={[
                  {
                    required: true,
                    message: 'NFT token standard is required',
                  },
                ]}
              >
                <Select defaultValue="ERC721" onChange={this.onNftStandardChange}>
                  <Option value="ERC721">ERC721</Option>
                  <Option value="ERC1155" disabled={true}>
                    ERC1155
                  </Option>
                </Select>
              </Form.Item>
            </Tooltip>

            {/* <Tag color="blue" style={{ fontSize: '16px' }}>
              Your {selectedNftStandard} Token
            </Tag> */}

            {isCreateCollection ? (
              <>
                <Tooltip title="NFT token name">
                  <Form.Item
                    label={<div className="text text-bold text-color-4 text-size-3x">Name</div>}
                    name="nftName"
                    rules={[
                      {
                        required: true,
                        message: 'NFT token name is required',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Tooltip>

                <Tooltip title="NFT token symbol">
                  <Form.Item
                    label={<div className="text text-bold text-color-4 text-size-3x">Symbol</div>}
                    name="nftSymbol"
                    rules={[
                      {
                        required: true,
                        message: 'NFT token symbol is required',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="This is the NFT token address after creating new collection">
                  <Form.Item
                    label={
                      <div className="text text-bold text-color-4 text-size-3x">
                        Collection Address
                      </div>
                    }
                    name="nftColelctionAddress"
                    rules={[
                      {
                        required: true,
                        message: 'NFT token address is required',
                      },
                    ]}
                  >
                    <Input onBlur={(e) => this.onBlur(e)} />
                  </Form.Item>
                </Tooltip>
                {nftColelctionName && (
                  <Tooltip title="This is the NFT token name">
                    <Form.Item
                      label={
                        <div className="text text-bold text-color-4 text-size-3x">
                          Collection Name
                        </div>
                      }
                      name=""
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input defaultValue={nftColelctionName} disabled={true} />
                    </Form.Item>
                  </Tooltip>
                )}
              </>
            )}

            {/* <hr style={{ color: '#f0f0f0' }} /> */}

            {/* <Tag color="blue" style={{ fontSize: '16px' }}>
              Your First {selectedNftStandard} Token
            </Tag> */}

            {/* <Tooltip title="NFT token owner address">
              <Form.Item
                label={
                  <div className="text text-bold text-color-4 text-size-3x">Owner Address</div>
                }
                name="nftOwner"
                rules={[
                  {
                    required: true,
                    message: 'NFT token owner address is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip> */}

            <Tooltip title="NFT token description">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Description</div>}
                name="nftDescription"
                rules={[
                  {
                    required: true,
                    message: 'NFT token description is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <Tooltip title="External link to the NFT token">
              <Form.Item
                label={
                  <div className="text text-bold text-color-4 text-size-3x">External Link</div>
                }
                name="nftExternalLink"
                rules={[
                  {
                    required: false,
                    message: 'NFT token external link is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <Tooltip title="NFT token image">
              <Form.Item
                label={
                  <div className="text text-bold text-color-4 text-size-3x">
                    {selectedNftStandard === 'ERC721' ? 'Image' : 'Base Metadata URI'}
                  </div>
                }
                name="nftImage"
                rules={[
                  {
                    // required: true,
                    // message: 'NFT link is required',
                  },
                ]}
              >
                <ImgCrop rotate>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    onChange={this.handleChange}
                    onPreview={this.onPreview}
                    onRemove={() => {
                      this.setState({ imgBase64: null })
                    }}
                  >
                    {!imgBase64 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Tooltip>
            <Form.Item xs={24} md={24}>
              <Button type="primary" htmlType="submit" className="ant-big-btn" disabled={loading}>
                {loading ? <Spin /> : `${isCreateCollection ? 'Create Collection' : 'Add Item'}`}
              </Button>
              <br />
              {loading && (
                <Alert
                  message={
                    isCreateCollection
                      ? 'NFT Token is being launched'
                      : 'Collection item is being created'
                  }
                  description="Please wait!"
                  type="info"
                />
              )}
            </Form.Item>
            {!loading && nftOpResult !== null && (
              <div style={{ justifyContent: 'center' }}>
                {isCreateCollection ? (
                  <a
                    href={`${explorerLink[networkID]}/token/${nftOpResult.address}`}
                    target="_blank"
                  >
                    NFT Token Address: {nftOpResult.address}
                  </a>
                ) : (
                  <a href={`${explorerLink[networkID]}/tx/${nftOpResult.tx}`} target="_blank">
                    Transaction: {nftOpResult.tx}
                  </a>
                )}
              </div>
            )}
          </Form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

export default withRouter(connect(mapStateToProps, null)(CreateForm))
