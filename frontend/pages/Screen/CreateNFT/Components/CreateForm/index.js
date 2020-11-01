import React from 'react'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Button, Form, Input, Tooltip, Spin, Alert } from 'antd'
import { Erc721Contract } from 'contract-api'
import { scrollTop, showNotification, checkIsSigned } from 'common/function'
import SwitchNotification from 'pages/Components/SwitchNotification'
import Web3Service from 'controller/Web3'
import './style.scss'

const etherscanLink = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  42: 'https://kovan.etherscan.io',
}

class CreateForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      createdDataNFT: null,
      networkID: null,
    }
    this.formRef = React.createRef()
    this.erc721Contract = new Erc721Contract()
  }
  componentDidMount() {
    scrollTop && scrollTop()
    Web3Service.getNetWorkId().then((networkID) => {
      console.log(`networkID:${networkID}`)
      this.setState({ networkID })
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
  onFinish = async (values) => {
    const callbackOnFinish = async () => {
      this.setState({
        loading: true,
      })
      const { nftName, nftSymbol, nftID, nftOwner, nftLink } = values
      const result = await this.erc721Contract.create({
        name: nftName,
        symbol: nftSymbol,
        to: nftOwner,
        tokenID: nftID,
        tokenURI: nftLink,
      })
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
    const isSigned = checkIsSigned(this.props.userData, this.props.metamaskRedux)
    if (!isSigned) {
      showNotification(
        <SwitchNotification
          type={'no-login'}
          callback={callbackOnFinish}
          locale={this.props.locale}
        />,
      )
    } else {
      callbackOnFinish()
    }
  }
  generateNumber = (min = 1, max = 10000) => {
    const rand = Math.floor(Math.random() * (max - min + 1) + min)
    return rand
  }
  render() {
    const { loading, createdDataNFT, networkID } = this.state
    const layout = {
      labelCol: { span: 13 },
      wrapperCol: { span: 11 },
    }
    const defaultAttributeFields = [{ key: 0, name: '', value: '' }]

    return (
      <div className="create-form-container">
        <div className="wrapper">
          <h2 className="page-title" style={{ textAlign: 'left', color: '#665eba' }}>
            Launch NFT
          </h2>
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
            }}
            onFinish={this.onFinish}
            onValuesChange={(changedValues, allValues) => {
              this.setState({
                formData: allValues,
              })
            }}
          >
            <Tooltip placement="rightTop" title="This is your NFT name">
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

            <Tooltip placement="rightTop" title="This is your NFT symbol">
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

            <Tooltip placement="rightTop" title="This is your NFT ID (auto generated)">
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">ID</div>}
                name="nftID"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Tooltip>

            <Tooltip placement="rightTop" title="This is Ethereum address as the NFT owner">
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

            <Tooltip
              placement="rightTop"
              title="This is your NFT link that can be to some website or some image"
            >
              <Form.Item
                label={<div className="text text-bold text-color-4 text-size-3x">Link</div>}
                name="nftLink"
                rules={[
                  {
                    required: true,
                    message: 'NFT link is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Tooltip>

            <Form.Item xs={24} md={24}>
              <Button type="primary" htmlType="submit" className="ant-big-btn" disabled={loading}>
                {loading ? <Spin /> : 'Submit'}
              </Button>
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
              message={`NFT Token Address: ${etherscanLink[networkID]}/token/${createdDataNFT.address}`}
              description={`Transaction Link: ${etherscanLink[networkID]}/tx/${createdDataNFT.tx}`}
              type="success"
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
