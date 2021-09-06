import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import {timeString} from '../../utils/help';
import { AtButton,AtInput }  from 'taro-ui'
import './index.scss'


export default class shareImg extends Component {

    config = {
        navigationBarTitleText: '分享图'
    }

    constructor () {
      super(...arguments)
      const {comment,img} = this.$router.params
      this.state = {
        comment,img
      }

    } 
    componentWillMount () {
      //个人信息
      Request({
        url: 'user_info',
        method: 'get',
        data: {
        //  code: res.code
        //    id:10000
        },

      },(data) => {

          this.setState({user:data.data})

      })


    }





    handleClick (value) {
      this.setState({
        current: value
      })
    }
    render () {
      const {comment,img,user} = this.state;
      return (
        <View className="shareImg">
            <View className="title">
              <View className="left">
                  <Text>小程序搜索：拍好照</Text>
                  <View className="input">@{user && user.userName}  </View>
              </View>
              <View className="right">
                  <Image   mode="widthFix"  src={require('../../images/icon/ewm.png')}></Image>
              </View>
            </View>
            <View className="content">
              <View  className="info1">
                {user && <Image src={user && user.head_pic} ></Image>}
                <View>
                  <Text>{user && user.userName}<Text></Text></Text>
                  {timeString(new Date(),true)}
                </View>
              </View>
              <View className="box">
                <Image mode="widthFix" src={img} className="img"></Image>
                <View className="p">{comment  || ''}</View>
                <View className="p1">搜索更多摄影师，参与验真约拍，拍照拿报酬。</View>
              </View>
            </View>
        </View>
      )
    }
}
