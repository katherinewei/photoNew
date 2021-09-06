import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import './index.scss'
import {
  AtList,
  AtListItem,
  AtImagePicker,
  AtTextarea,
  AtButton,
  AtForm,
} from 'taro-ui'

const sexS = ['女', '男']

export default class verificateChecker extends Component {
  config = {
    navigationBarTitleText: '认证验真官',
  }

  state = {
    sex: 0,
    userName: '',
    identityCard: '',
    address: '',
    mobile: '',
    isAgree: true,
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //
  agree() {
    console.log('agree')
    this.setState({ isAgree: !this.state.isAgree })
  }

  //提交
  onSubmit() {
    if (!this.state.isAgree) {
      Taro.showToast({
        title: '请同意服务协议',
        icon: 'none',
        mask: true,
      })
      return false
    }

    const { sex, userName, identityCard, address, mobile } = this.state

    if (!userName || !identityCard || !address || !mobile) {
      Taro.showToast({
        title: '请完善信息',
        icon: 'none',
        mask: true,
      })
      return false
    }

    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Taro.showToast({
        title: '输入正确的手机号码',
        icon: 'none',
        mask: true,
      })
      return false
    }

    const data = { sex, userName, identityCard, address, mobile }

    //  console.log(data)
    // 发送数据
    Request(
      {
        url: 'photo-truth-user',
        method: 'POST',
        data,
      },
      (data) => {
        Taro.redirectTo({
          url: '/pages/verification/success',
        })
      },
    )
  }

  render() {
    return (
      <View className="publishService">
        <View className="title">完成实名信息，成为验真官</View>
        <View className="desc" style={{ marginBottom: '15rpx' }}>
          实名信息仅作认证用，不会向其他用户透露
        </View>

        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <View className="p">姓名</View>

          <Input
            class="input"
            placeholder="请输入姓名"
            value={this.state.userName}
            onInput={(e) => {
              this.setState({ userName: e.target.value })
            }}
          />

          <View className="p">身份证号码</View>

          <Input
            class="input"
            type="idcard"
            placeholder="请输入身份证号码"
            value={this.state.identityCard}
            onInput={(e) => {
              this.setState({ identityCard: e.target.value })
            }}
          />

          <View className="p">性别</View>

          <View className="radio">
            {sexS.map((item, i) => (
              <View
                key={i}
                className={this.state.sex == i && 'active'}
                onClick={() => this.setState({ sex: i })}
              >
                {item}
              </View>
            ))}
          </View>

          <View className="p">通讯录地址</View>

          <Input
            class="input"
            placeholder="请输入通讯录地址"
            value={this.state.address}
            onInput={(e) => {
              this.setState({ address: e.target.value })
            }}
          />

          <View className="p">手机号码</View>

          <Input
            class="input"
            type="number"
            placeholder="请输入手机号码"
            value={this.state.mobile}
            onInput={(e) => {
              this.setState({ mobile: e.target.value })
            }}
          />

          <AtButton type="primary" formType="submit">
            下一步
          </AtButton>

          <View
            className={'agreement ' + (this.state.isAgree ? 'true' : 'false')}
            
          >
            <View onClick={() => this.agree()}>已仔细阅读并同意</View><View onClick={() => Taro.navigateTo({  url: '/pages/publish/agreement',  })}>《拍好照平台服务协议》</View>
          </View>
        </AtForm>
      </View>
    )
  }
}
