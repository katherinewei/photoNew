import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import { AtAvatar,AtGrid  } from "taro-ui"
import Tabs from '../../components/tab'
import {
  timeString,
  setAccessToken,
  getImageUrl,
  setUserId,
  getToken,
  setUserInfo,
  validateLogin
} from '../../utils/help'
export default class UserComponent extends Component {

    config = {
        navigationBarTitleText: '个人中心',
        navigationBarBackgroundColor: '#fff',
    }



    constructor () {
      super(...arguments)
      this.setState ({
        current: 0,
        index:0,
        nav:4,
        user:{},
        serviceList:{},
        truthList:[],
        speechList:{},
        records:[],

        

      })
    }


    componentWillMount () {

    }

    componentDidMount () {

      getToken(() => {
        //  个人信息
        Request({
          url: 'api/getUserInfo',
          method: 'post',
          data: {
          //  code: res.code
          //    id:10000
          },

        },(data) => {

            this.setState({user:data.data})
            setUserInfo(data.data)
            console.log(data.data)

            if(!data.data.head_pic){
             // this.getUser()
            }
        })
      }, true)
    


    




    }



    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    getUser(){
      let that = this;
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


                    let data = {nickName,sex:gender == 1 ? 2 : 1,city,province,country,headPic:avatarUrl};  //sex  	性别: 0未知 1女性 2男性
                    console.log(data,88885555)

                    Request({
                      url: 'api/editUserInfo',
                      method: 'post',
                      data
                    },(res) => {
                      Taro.showToast({
                        title: '获取成功',
                        icon: 'success',
                        mask: true,
                      });

                      that.setState({user:{head_pic:data.avatarUrl,userName:data.nickName,address:data.province + ' ' + data.city}})



                    })

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



    render () {
        

        return (
            <View className='user'>
                <View className="header" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="right">
                    <View className="name">kk</View>
                    {/* <View className="wan">完善资料</View> */}
                    <Button openType='getUserInfo' onGetUserInfo={this.getUser.bind(this)} className="wan">完善资料</Button>
                  </View>
                </View>
                <View className="grid">
                    <View className="item" onClick={() => Taro.navigateTo({url: `/pages/user/recharge?price=60`})}>
                      <View className="t">0.00</View>
                      <View className="b">余额</View>
                    </View>
                    <View className="item"  onClick={() => Taro.navigateTo({url: `/pages/user/feedback`})}>
                      <View className="t"><Image src={require('../../images/icon/u1.png')} mode="widthFix"/></View>
                      <View className="b">意见反馈</View>
                    </View>
                    <View className="item" onClick={() => Taro.navigateTo({url: `/pages/user/recruitment`})} >
                      <View className="t"><Image src={require('../../images/icon/u2.png')} mode="widthFix" /></View>
                      <View className="b">招募摄影</View>
                    </View>
                    <View className="item" onClick={() => Taro.navigateTo({url: `/pages/user/myPhoto`})}>
                      <View className="t"><Image src={require('../../images/icon/u3.png')} mode="widthFix" /></View>
                      <View className="b">我的写真</View>
                    </View>
                    <View className="item"  onClick={() => Taro.navigateTo({url: `/pages/user/myEvaluation`})}>
                      <View className="t"><Image src={require('../../images/icon/u4.png')} mode="widthFix" /></View>
                      <View className="b">我的评价</View>
                    </View>
                </View>
          </View>
        )
    }
}
