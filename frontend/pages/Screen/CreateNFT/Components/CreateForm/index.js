import React from 'react'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
  Button,
  Form,
  Input,
  Tooltip,
  Spin,
  Alert,
  Select,
  notification,
  Tag,
  Upload,
  message,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
const { Option } = Select
import Erc721Contract from 'contract-api/Erc721Contract'
import Erc1155Contract from 'contract-api/Erc1155Contract'
import Web3Service from 'controller/Web3'
import './style.scss'

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

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}


class CreateForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imageUrl: null,
      createdDataNFT: null,
      networkID: null,
      address: null,
      selectedNftStandard: 'ERC721',
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
            console.log(`networkID:${networkID}`)
            this.setState({ networkID, address: defaultAddress })
          })
        })
        .catch((error) => {
          console.error('window.ethereum.enable - Error:', error)
        })
    }
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
  onFinish = async (values) => {
    const callbackOnFinish = async () => {
      this.setState({
        loading: true,
      })
      const { nftName, nftSymbol, nftID, nftOwner, nftLink } = values

      let result
      if (this.state.selectedNftStandard === 'ERC721') {
        result = await this.erc721Contract.create({
          name: nftName,
          symbol: nftSymbol,
          to: nftOwner,
          tokenID: nftID,
          tokenURI: nftLink,
        })
      } else {
        result = await this.erc1155Contract.create({
          name: nftName,
          symbol: nftSymbol,
          to: nftOwner,
          tokenURI: nftLink,
        })
      }
      this.setState({
        loading: false,
        createdDataNFT: result
          ? {
              address: result.address,
              tx: result.transactionHash,
            }
          : null,
      })
    }
    const isSigned = this.state.address !== null //checkIsSigned(this.props.userData, this.props.metamaskRedux)
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
  onNftStandardChange = (e) => {
    if (this.state.selectedNftStandard !== e) {
      this.setState({ selectedNftStandard: e })
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      )
    }
  }

  onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  render() {
    const { createdDataNFT, networkID, selectedNftStandard } = this.state
    const layout = {
      labelCol: { span: 13 },
      wrapperCol: { span: 11 },
    }
    const defaultAttributeFields = [{ key: 0, name: '', value: '' }]

    const { loading, imageUrl } = this.state

    return (
      <div className="create-form-container">
        <div className="wrapper">
          <div
            className="page-title"
            style={{ textAlign: 'center', color: '#ffffff', padding: '40px' }}
          >
            {`Launch NFT to ${networkName[networkID] || '...'}`}
          </div>
          <Form
            ref={this.formRef}
            {...layout}
            name="create-nft"
            labelAlign="left"
            initialValues={{
              numberOfIssuing: 1,
              remember: true,
              nftDetail: defaultAttributeFields,
              enableSend: true,
              ownerMessage: '',
              nftID: this.generateNumber(),
              nftOwner: this.props.userData ? this.props.userData.address : '',
              nftStandard: 'ERC721',
            }}
            onFinish={this.onFinish}
            onValuesChange={(changedValues, allValues) => {
              this.setState({
                formData: allValues,
              })
            }}
          >
            <Tooltip title="Select a token standard">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Standard</div>}
                name="nftStandard"
                rules={[
                  {
                    required: true,
                    message: 'NFT standard is required',
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

            <Tag color="blue" style={{ fontSize: '16px' }}>
              Your {selectedNftStandard} Token
            </Tag>

            <Tooltip title="This is your NFT name">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Name</div>}
                name="nftName"
                rules={[
                  {
                    required: true,
                    message: 'NFT Name is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <Tooltip title="This is your NFT symbol">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Symbol</div>}
                name="nftSymbol"
                rules={[
                  {
                    required: true,
                    message: 'NFT Symbol is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <hr style={{ color: '#f0f0f0' }} />

            <Tag color="blue" style={{ fontSize: '16px' }}>
              Your First {selectedNftStandard} Token
            </Tag>

            <Tooltip title="This is Ethereum owner address of the NFT token">
              <Form.Item
                label={
                  <div className="text text-bold text-color-4 text-size-3x">Owner Address</div>
                }
                name="nftOwner"
                rules={[
                  {
                    required: true,
                    message: 'Please specify Ethereum address as the NFT owner',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <Tooltip title="Please upload your NFT token image">
              <Form.Item
                label={
                  <div className="text text-bold text-color-4 text-size-3x">
                    {selectedNftStandard === 'ERC721' ? 'Image' : 'Base Metadata URI'}
                  </div>
                }
                name="nftLink"
                rules={[
                  {
                    required: true,
                    message: 'NFT link is required',
                  },
                ]}
              >
                <ImgCrop rotate>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    // showUploadList={false}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    // beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    onPreview={this.onPreview}
                  >
                    {!imageUrl && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Tooltip>

            <Form.Item xs={24} md={24}>
              <Button type="primary" htmlType="submit" className="ant-big-btn" disabled={loading}>
                {loading ? <Spin /> : 'Submit'}
              </Button>
              <br />
              {loading && (
                <Alert
                  message="NFT Token is being launched"
                  description="Please wait!"
                  type="info"
                />
              )}
            </Form.Item>
          </Form>
          {!loading && createdDataNFT !== null && (
            <Alert
              message={`NFT Token Address: ${explorerLink[networkID]}/token/${createdDataNFT.address}`}
              description={`Transaction Link: ${explorerLink[networkID]}/tx/${createdDataNFT.tx}`}
              type="success"
              closable
            />
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  locale: state.locale,
  userData: state.userData,
  metamaskRedux: state.metamaskRedux,
})

export default withRouter(connect(mapStateToProps, null)(CreateForm))
