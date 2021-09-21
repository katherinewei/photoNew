import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtAvatar,AtGrid  } from "taro-ui"
import Tabs from '../../components/tab'

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


      // 个人信息
          // Request({
          //   url: 'user_info',
          //   method: 'get',
          //   data: {
          //   //  code: res.code
          //   //    id:10000
          //   },

          // },(data) => {

          //     this.setState({user:data.data})
          //     setUserInfo(data.data)
          //     console.log(data.data)

          //     if(!data.data.head_pic){
          //       this.getUser()
          //     }
          // })


    




    }



    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }





    render () {
        

        return (
            <View className='user'>
                <View className="header" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="right">
                    <View className="name">kk</View>
                    <View className="wan">完善资料</View>
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
