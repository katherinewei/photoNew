import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import Request from '../../utils/request';
import './photo.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtAvatar  } from "taro-ui"
import Tabs from '../../components/tab'

export default class MyPhoto extends Component {

    config = {
        navigationBarTitleText: '我的写真',
        navigationBarBackgroundColor: '#fff',
    }



    constructor () {
      super(...arguments)
      this.setState ({
        records: [{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'},{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'},{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'}],
      

      })
    }


    componentWillMount () {

    }

    componentDidMount () {


    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onScrollToLower(){

    }

    render () {
        
      const {
        records,
        
        
      } = this.state
        return (
         
          <View className='at-article'>
            <View className="header" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="right">
                    <View className="name">kk</View>
                   
                  </View>
                </View>
              <View className='at-article__content'>
              <Swiper
                  className='myswipe'
                  indicatorColor='#DCDCDC'
                  indicatorActiveColor='#5299FB'
                  
                  circular
                  indicatorDots
                  autoplay>
                  <SwiperItem>
                    <View className='demo-text-1'><Image src="http://www.hotxiezhen.com/img/6ae9a1774328dbf8f3cc792ddfa405e8.png" mode="widthFix"/></View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className='demo-text-2'><Image src="http://www.hotxiezhen.com/img/6ae9a1774328dbf8f3cc792ddfa405e8.png" mode="widthFix" /></View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className='demo-text-3'><Image src="http://www.hotxiezhen.com/img/6ae9a1774328dbf8f3cc792ddfa405e8.png"  mode="widthFix"/></View>
                  </SwiperItem>
                </Swiper>

                <View className='at-article__section'>
                  <View className='at-article__h3'>长沙约拍 | 我的这个夏天被偷走了被偷走了</View>
                 
                  <View className='at-article__p'>
                  长沙约拍 | 我的这个夏天被偷走了被偷走了
                  </View>
                 
                 
                </View>
              </View>
          </View>
        )
    }
}
