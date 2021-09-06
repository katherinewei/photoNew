import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request'
import { getToken } from '../../utils/help'
import './index.scss'
import { AtActivityIndicator } from 'taro-ui'

export default class reportDetail extends Component {
  config = {
    navigationBarTitleText: '拍好照',
  }

  componentWillMount() {
    this.state = {loading:false}
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getUser(){
    let that = this;
    this.setState({loading:true})
   const callback = () => {
          Taro.getUserInfo({
            lang:'zh_CN',
            success: function(res) {

                  var userInfo = res.userInfo
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  var province = userInfo.province
                  var city = userInfo.city
                  var country = userInfo.country


                  let data = {nickName,gender:gender == 1 ? 1 : 0,city,province,country,avatarUrl};

                  getToken(() => {
                    Request({
                      url: 'photo-user',
                      method: 'post',
                      data
                    },(res) => {
                      Taro.showToast({
                        title: '获取成功',
                        icon: 'success',
                        mask: true,
                      });
                      that.setState({loading:false})
                     // that.setState({user:{head_pic:data.avatarUrl,userName:data.nickName,address:data.province + ' ' + data.city}})
  
                     Taro.redirectTo({url: '/pages/index/index'})
  
                    })
                  },true)

                  

                }
              })
        }

        Taro.getSetting({
          success(res1) {
            console.log(res1)
            if (!res1.authSetting['scope.userInfo']) {
              Taro.authorize({
                scope: 'scope.userInfo',
                success () {
                  console.log(111)
                  callback()
                }
              })
            } else {
              console.log(2222)
              callback()
            }
          }
        })

}

  render() {
   
    return (
      <View className="login">
          <Image src={require( '../../images/icon/photo.png')} />
          <Text>需要使用您的微信昵称和头像</Text>
        <Button class="loginBtn"  openType='getUserInfo' onGetUserInfo={this.getUser.bind(this)} >点击授权</Button>
        <Button class="loginBtn plain"  onClick={() =>  Taro.redirectTo({ url: `/pages/index/index` })  }  >暂不登录</Button>
         <AtActivityIndicator isOpened={this.state.loading} mode='center'   size={80} ></AtActivityIndicator>
      </View>
    )
  }
}
