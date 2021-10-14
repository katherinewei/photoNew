import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,ScrollView,Image } from '@tarojs/components'
import Request from '../../utils/request';
import './photo.scss'


export default class MyPhoto extends Component {




    constructor () {
      super(...arguments)
      
    }
    state = {
      records: []
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
        if(data.code === 200){
         this.setState({...data.data})
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
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
          if(data.code === 200){
          data.data.records = [...records, ...data.data.records]
          this.setState({ ...data.data })
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
  }

    render () {
        
      const {
        records,
        
        
      } = this.state
        return (
          <ScrollView
            className='scrollview myPhotoPage'
            scrollY
            scrollWithAnimation
            scrollTop={0}
            style={{height: (Taro.getSystemInfoSync().windowHeight)  +  'px'}}
            lowerThreshold={20}
            upperThreshold={20}
            onScrollToLower={this.onScrollToLower.bind(this)}
          >
           <View className='list'>
            {records && records.length > 0 ? (
              records.map((item, i) => (
                <View key={i} className='item'>
                  <View
                    onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/user/detail?id=${item.id}`,
                        })
                    }
                    }
                  >
                    <View className='image'>
                      
                      <View className='img'>
                        <Image
                          mode='widthFix'
                          src={(item.imgUrl)}
                        ></Image>
                       
                      </View>
                      <View className='text'>{item.title}</View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className='noData' style={{ marginTop: '110px' }}>
                <Image
                  mode='widthFix'
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
