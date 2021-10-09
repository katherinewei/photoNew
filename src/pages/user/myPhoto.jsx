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
        records: [],
      

      })
    }


    componentWillMount () {

    }

    componentDidMount () {
      Request({
        url: 'api/wxNotePage',
        method: 'get',
        data: {
        //  code: res.code
        //    id:10000
        },

      },(data) => {

         this.setState({...data.data})
      })

    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

     //上拉刷新
  onScrollToLower() {
    const { pages, current, records } = this.state

    if (pages > current) {
      Request(
        {
          url: 'api/wxNotePage',
          method: 'GET',
          data: { page: current + 1 },
          //isToken:false
        },
        (data) => {
          data.data.records = [...records, ...data.data.records]
          this.setState({ ...data.data })
        },
      )
    }
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
                          url: `/pages/user/detail?id=${item.id}`,
                        })
                    }
                    }
                  >
                    <View className="image">
                      
                      <View className="img">
                        <Image
                          mode="widthFix"
                          src={(item.imgUrl)}
                        ></Image>
                       
                      </View>
                      <View className="text">{item.title}</View>
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
