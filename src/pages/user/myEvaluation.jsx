import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { AtAvatar  } from "taro-ui"
import Request from '../../utils/request';
import '../order/photographer.scss'
import {getToken,getUserInfo} from '../../utils/help';

export default class MyPhoto extends Component {




    constructor () {
      super(...arguments)
      this.setState ({
        
      

      })
    }
    state = {
      records: []
    }


    componentWillMount () {

    }

    componentDidMount () {
     

      getToken(() => {
        //  评价分页
       this.fetchRecord()
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
          url: 'api/wxSelfCommentList',
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

  fetchRecord(refresh){
    Request({
      url: 'api/wxSelfCommentList',
      method: 'get',
      data: {
      //  code: res.code
      //    id:10000
      },

    },(data) => {
      if(refresh){
        Taro.stopPullDownRefresh()
      }
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
  }

  onPullDownRefresh(){
    this.fetchRecord(true)
  }
  onReachBottom (){
    this.onScrollToLower()
  }

    render () {
        
      const {
        records,
        
        
      } = this.state
        return (
          
          <View className='evaluation userEvaluation'>
            <View className='box'>
              {records.length > 0 ? records.map((item,i) => (
                <View key={i} className='item' onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/user/evaluateDetail?id=${item.id}`,
                        })
                    }
                    }
                >
                  <AtAvatar  circle  image={item.headPic}   ></AtAvatar>
                  <View className='cRight'>
                    <View className='n'>{getUserInfo().nickName}</View>
                    <View className='t'>{item.time}</View>
                    <View className='c'>{item.content}</View>
                    <View className='i'>
                      {item.commentImgUrlList.length > 0 && item.commentImgUrlList.map((pic,j) => (
                        <Image key={j} src={pic} mode='widthFix'></Image>
                      ))}
                      
                     
                    </View>
                  </View>
                 
                </View>
                
              )) : <View className='noData' style={{ padding: '110px 0' }}>
                    <Image
                      mode='widthFix'
                      src={require('../../images/icon/noData.png')}
                    ></Image>
                    <View>暂无数据</View>
                  </View>}
               

              </View>
           
          </View>
      
        
        )
    }
}
