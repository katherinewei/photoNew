import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Image } from '@tarojs/components'
import Request from '../../utils/request'
import './register.scss'
import '../../components/common.scss'

export default class RegisterFinish extends Component {



    constructor () {
      super(...arguments)
      
    }

    state = {
      url:'',
      img:''
    }


    componentWillMount () {

      // eslint-disable-next-line no-undef
      const { top, height } = wx.getMenuButtonBoundingClientRect()
      // eslint-disable-next-line no-undef
      const { statusBarHeight, platform } = wx.getSystemInfoSync()
      console.log(top, height,statusBarHeight,platform,9632145)
      let navigationBarHeight;
      if (top && top !== 0 && height && height !== 0) {
        navigationBarHeight = (top - statusBarHeight) * 2 + height
      } else {
      if(platform === 'android'){
        navigationBarHeight = 48;
      }else{
        navigationBarHeight = 40;
      }
    }
    this.setState({
       statusBarHeight:statusBarHeight,
       barHeight:navigationBarHeight,
    })

    }

    componentDidMount () {

        Request(
          {
            url: 'api/wxDownloadDetail',
            method: 'GET'
          },
          (data) => {
           
            if(data.code === 200){
              this.setState({url:data.data.url,img:data.data.imgUrl})
             
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

    render () {
      const {
        barHeight,
        statusBarHeight,url, img
      } = this.state
     
        return (
           <View className='registerFinish'>
              <View className='navbar' style={{paddingTop:statusBarHeight+"px",lineHeight:barHeight+"px"}}>
                <View className='icon' onClick={() => Taro.switchTab({url: `/pages/index/index`})}><Image src={require('../../images/icon/tab1_active.png')} mode='widthFix' /></View>
                <View className='title' >注册成功</View>

              </View>
              <View className='content' >
                <Image src={img} mode='widthFix' />
                
                <View >您已完成注册，下载摄影师端APP开始接单</View>
                <View className='download'>下载地址:<text user-select>{url}</text>复制链接到浏览器进行APP下载</View>

                </View>
          </View>
          
        )
    }
}
