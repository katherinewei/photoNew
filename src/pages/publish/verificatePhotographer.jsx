import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import './index.scss'
import { AtTextarea, AtButton, AtForm } from 'taro-ui'

const sexS = ['女', '男']

export default class publishService extends Component {
  config = {
    navigationBarTitleText: '认证摄影师',
  }

  state = {
    isAgree: true,
    sex: 0,
    userName: '',
    identityCard: '',
    address: '',
    mobile: '',
    introduction: '',
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //
  agree() {
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

    const {
      sex,
      userName,
      identityCard,
      address,
      mobile,
      introduction,
    } = this.state

    if (!userName || !identityCard || !address || !mobile || !introduction) {
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

    const data = { sex, userName, identityCard, address, mobile, introduction }

    //  console.log(data)
    // 发送数据
    Request(
      {
        url: 'photo-supply',
        method: 'POST',
        data,
      },
      (data) => {
        Taro.showToast({
          title: '申请成功！',
          icon: 'success',
          mask: true,
        })
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/publish/publishTruth`,
          })
        }, 1000)
      },
    )
  }

  render() {
    return (
      <View className="publishService">
        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <View className="title">完成信息填写，成为摄影师</View>
          <View className="desc" style={{ marginBottom: '15rpx' }}>
            实名信息仅作认证用，不会向其他用户透露
          </View>

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

          <View className="p">
            个人简介<Text>（将展示在您所有发布的服务中）</Text>
          </View>

          <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
            maxLength={300}
            placeholder="请输入个人简介"
            value={this.state.introduction}
            onChange={(e) => {
              this.setState({ introduction: e })
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
