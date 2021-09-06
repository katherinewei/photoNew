import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import { AtTabBar }  from 'taro-ui'
import {getImageUrl} from '../../utils/help';
import './index.scss'
import Tabs from '../../components/tab'

export default class Index extends Component {

  config = {
  navigationBarTitleText: '消息中心'
}

    constructor () {
      super(...arguments)
      this.state = {
        current_type: 0,
        data:{}
      }
    }

    componentDidMount () {


      this.fetchMessage(0)





    }


    fetchMessage(type){
      // 消息列表
          Request({
            url: 'photo-message',
            method: 'get',
            data: {
                type
            },

          },(data) => {
            
              this.setState({data:data.data})
              console.log(data.data)
          })

    }


    handleClick (value) {
      this.setState({
        current_type: value
      })
      this.fetchMessage(value)
    }

    //处理红点
    handleRead(row){
      const {data,current} = this.state;
      let readC = true
      if(!row.isRead){
        data.records.map(item => {
          if(item.id == row.id){
            item.isRead = 1;
          }
          if(!item.isRead){
            readC = false
          }
        })
        if(readC){
          if(current == 0){
            console.log(current)
            data.tyflag = 0
          }
          else if(current == 1){
            data.yyflag = 0
          }
          else if(current == 2){
            data.tzflag = 0
          }
        }
        this.setState({data})
        console.log(data)
      }
      Taro.navigateTo({url:`/pages/message/detail?id=${row.id}`})
    }


    onScrollToLower(){
      const {data,current_type} = this.state; 
      const {pages,current,records} = data;
      if(pages > current){
        
        Request({
          url: 'photo-message',
          method: 'GET',
          data:{type:current_type,page:current + 1}
        },(data) => {
            data.data.records = [...records,...data.data.records];
            this.setState({data:data.data})
        })
      }
    }


    render () {
      const {data} = this.state;
      console.log(data)
      return (
        <View >
        <Tabs current={3}/>
          <AtTabBar
            tabList={[
              { title: '体验申请', dot: data.tyflag  },
              { title: '预约申请',dot: data.yyflag },
              { title: '通知', dot: data.tzflag }
            ]}
            onClick={this.handleClick.bind(this)}
            current={this.state.current_type}
            className="messagetab"
          />
           <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={0}
              style={{height: (Taro.getSystemInfoSync().windowHeight) + 100 +  'px'}}
              lowerThreshold={20}
              upperThreshold={20}
              onScrollToLower={this.onScrollToLower.bind(this)}
               >
              <View className="list">
                {data.records && data.records.length > 0 ? data.records.map((item,i) => (
                    <View key={i} className="item" onClick={() => this.handleRead(item)}>
                      <View className="image">
                        <Image src={getImageUrl(item.headPic)}></Image>
                        {!item.isRead && <View className="dot"></View>}
                        </View>
                      <View className="title">
                        <Text className="h">{item.title}</Text>
                        <Text className="p">{item.message}</Text>

                      </View>

                      <View className="time"><View>{item.date}</View>{item.time}</View> 
                  </View>
                )) : <View className="noData" style={{marginTop:'150px'}}>
                  <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                  <View >暂无消息</View>
                </View>}

                </View>

            </ScrollView>
         
        </View>
      )
    }
}
