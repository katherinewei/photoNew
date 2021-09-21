import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './photo.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtAvatar,AtGrid  } from "taro-ui"
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
          <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={0}
          style={{height: (Taro.getSystemInfoSync().windowHeight) - 120 +  'px'}}
          lowerThreshold={20}
          upperThreshold={20}
          onScrollToLower={this.onScrollToLower.bind(this)}
           >
           <View className="list">
            {records && records.length > 0 ? (
              records.map((item, i) => (
                <View className="item">
                  <View
                    onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/user/detail?id=4`,
                        })
                    }
                    }
                  >
                    <View className="image">
                      
                      <View className="img">
                        <Image
                          mode="widthFix"
                          src={(item.imgPath)}
                        ></Image>
                       
                      </View>
                      <View className="text">{item.label}</View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="noData" style={{ marginTop: '110px' }}>
                <Image
                  mode="widthFix"
                  src={require('../../images/icon/noData.png')}
                ></Image>
                <View>暂无数据</View>
              </View>
            )}
          </View>
    </ScrollView>
        )
    }
}
