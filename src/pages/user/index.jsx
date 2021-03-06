import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Image } from '@tarojs/components'
import { AtAvatar ,AtIcon,AtList, AtListItem  } from "taro-ui"
import Request from '../../utils/request';
import './index.scss'


import {

  getToken,
  setUserInfo,

} from '../../utils/help'

export default class UserComponent extends Component {

    

    state = {
      user: {},
      msgData:{}
    }


    componentWillMount () {

    }

    componentDidMount () {
      this.fetchInfo()
     
    }
  
    getUser(){
      
      let that = this;
      const callback = () => {


      

        
        
            Taro.getUserProfile({
              lang:'zh_CN',
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: function(res) {
                console.log(res.userInfo)

                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    console.log(res,11111122222)

                    let data = {nickName,sex:gender == 1 ? 2 : 1,city,province,country,headPic:avatarUrl};  //sex  	性别: 0未知 1女性 2男性
                    console.log(data,88885555)

                    Request({
                      url: 'api/editUserInfo',
                      method: 'post',
                      data
                    },(res1) => {
                      if(res1.code === 200){
                        Taro.showToast({
                          title: '获取成功',
                          icon: 'success',
                          mask: true,
                        });

                        that.setState({user:data.data})
                      }else {
                        Taro.showToast({
                          title: res1.msg,
                          icon:'none',
                          mask: true
                        });
                      }


                    })

              },
              fail:(res) => {
                console.log(res)
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

  fetchMsg(){
    Request(
      {
        url: 'api/noticeInfo',
        method: 'GET'
      },
      (data) => {
        
        if(data.code === 200){
          this.setState({msgData:data.data})
         
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
        
      },
    )
  }

  fetchInfo(refresh){
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
        if(refresh){
          Taro.stopPullDownRefresh()
        }

        if(data.code === 200){
          this.setState({user:data.data})
          setUserInfo(data.data)
          console.log(data.data)

          if(!data.data.head_pic){
           // this.getUser()
          }
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
      })

      this.fetchMsg()
    })
  }


  onPullDownRefresh(){
    this.fetchInfo(true)
  }


    render () {
        const{user,msgData} = this.state

        return (
          user.id ? <View className='user'>
                <View className='header' >
                  {user.headPic && <AtAvatar  circle  image={user.headPic}   ></AtAvatar>}
                  <View className='right'>
                    <View className='name'>{user.nickName}</View>
                    <View className='wan' onClick={this.getUser.bind(this)}>完善资料</View>
                    {/* <Button openType='getUserInfo' onGetUserInfo={this.getUser.bind(this)} className='wan'>完善资料</Button> */}
                  </View>
                  <View className='msg'>{msgData.redPoint&& <text class='num'>{msgData.unReadSize}</text>}<AtIcon value='message' size='20' color='#ffffff' onClick={() => Taro.navigateTo({url: `/pages/user/message`})}></AtIcon></View>
                </View>
                <View className='grid'>
                    <View className='item' onClick={() => Taro.navigateTo({url: `/pages/user/recharge?price=${user.remainAmount}`})}>
                      <View className='t'>{user.remainAmount}</View>
                      <View className='b'>余额</View>
                    </View>
                    <View className='item'  onClick={() => Taro.navigateTo({url: `/pages/user/feedback`})}>
                      <View className='t'><Image src={require('../../images/icon/u1.png')} mode='widthFix' /></View>
                      <View className='b'>意见反馈</View>
                    </View>
                    <View className='item' onClick={() => Taro.navigateTo({url: `/pages/user/recruitment`})} >
                      <View className='t'><Image src={require('../../images/icon/u2.png')} mode='widthFix' /></View>
                      <View className='b'>成为摄影师</View>
                    </View>
                    <View className='item' onClick={() => Taro.navigateTo({url: `/pages/user/myPhoto`})}>
                      <View className='t'><Image src={require('../../images/icon/u3.png')} mode='widthFix' /></View>
                      <View className='b'>约拍笔记</View>
                    </View>
                    <View className='item'  onClick={() => Taro.navigateTo({url: `/pages/user/myEvaluation`})}>
                      <View className='t'><Image src={require('../../images/icon/u4.png')} mode='widthFix' /></View>
                      <View className='b'>我的评价</View>
                    </View>
                </View>
                <AtList>
                  <AtListItem title='服务撮合协议' arrow='right' onClick={() => Taro.navigateTo({url: `/pages/order/protocol`})} />
                  <AtListItem title='安全规则' arrow='right'  onClick={() => Taro.navigateTo({url: `/pages/order/safeRule`})} />
                </AtList>
          </View>:<View></View>
        )
    }
}
