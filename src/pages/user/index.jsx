import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtAvatar } from "taro-ui"
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
                  </View>
                </View>
          </View>
        )
    }
}
