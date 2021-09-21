import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Request from '../../utils/request';
import '../order/photographer.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtAvatar  } from "taro-ui"
import Tabs from '../../components/tab'

export default class MyPhoto extends Component {

    config = {
        navigationBarTitleText: '我的评价',
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
          <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={0}
          style={{height: (Taro.getSystemInfoSync().windowHeight) +  'px'}}
          lowerThreshold={20}
          upperThreshold={20}
          onScrollToLower={this.onScrollToLower.bind(this)}>
          <View className='evaluation userEvaluation'>
            <View className="box">
                <View className="item" onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/user/detail?id=4`,
                        })
                    }
                    }>
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                

                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                

              </View>
           
          </View>
        </ScrollView>
        
        )
    }
}
