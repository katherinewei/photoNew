import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Request from '../../utils/request';
import '../order/photographer.scss'
import {getImageUrl,getToken,getUserInfo} from '../../utils/help';
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
        records: [],
      

      })
    }


    componentWillMount () {

    }

    componentDidMount () {
     

      getToken(() => {
        //  评价分页
        Request({
          url: 'api/wxSelfCommentList',
          method: 'get',
          data: {
          //  code: res.code
          //    id:10000
          },

        },(data) => {
          if(data.code === 200){
          this.setState ({
            records:data.data})
          }else {
            Taro.showToast({
              title: data.msg,
              icon:'none',
              mask: true
            });
          }
           
        })
      })

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
              {records.length > 0 ? records.map(item => (
                <View className="item" onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/user/evaluateDetail?id=${item.id}`,
                        })
                    }
                    }>
                  <AtAvatar  circle  image={item.headPic}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">{getUserInfo().nickName}</View>
                    <View className="t">{item.time}</View>
                    <View className="c">{item.content}</View>
                    <View className="i">
                      {item.commentImgUrlList.length > 0 && item.commentImgUrlList.map(pic => (
                        <Image src={pic} mode="widthFix"></Image>
                      ))}
                      
                     
                    </View>
                  </View>
                 
                </View>
                
              )) : <View className="noData" style={{ padding: '110px 0' }}>
                    <Image
                      mode="widthFix"
                      src={require('../../images/icon/noData.png')}
                    ></Image>
                    <View>暂无数据</View>
                  </View>}
               

              </View>
           
          </View>
        </ScrollView>
        
        )
    }
}
