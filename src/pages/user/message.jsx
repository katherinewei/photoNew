import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Image} from '@tarojs/components'
import { AtFloatLayout } from "taro-ui"
import Request from '../../utils/request';
import './recharge.scss'
import '../../components/common.scss'

export default class Record extends Component {

   

    constructor () {
      super(...arguments)
      
    }


    state = {
      records:[],
      visible:false,currentItem:{}
    }

    componentDidMount () {
      this.fetchRecord()

    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    fetchRecord(refresh){
      Request(
        {
          url: 'api/noticePage',
          method: 'GET'
        },
        (data) => {
          if(refresh){
            Taro.stopPullDownRefresh()
          }
          if(data.code === 200){
            // data.data = {
            //   "current": 1,
            //   "pages": 1,
            //   "records": [
            //     {
            //       "createTime": "2021-11-11",
            //       "id": 0,
            //       "isRead": 0,
            //       "message": "dfdgfd的功夫倒是大概豆腐干梵蒂冈法国梵蒂冈丰富的的功夫v此部分地方官梵蒂冈法国道德规范",
            //       "targetUserId": 0,
            //       "title": "大富大贵",
            //       "type": 0,
            //       "updateTime": ""
            //     }
            //   ],
            //   "size": 1,
            //   "total": 1
            // },
            this.setState({...data.data})
           
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

    //上拉刷新
    onScrollToLower() {
      const { pages, current, records } = this.state

      if (pages > current) {
        Request(
          {
            url: 'api/noticePage',
            method: 'GET',
            data: { page: current + 1 },
            //isToken:false
          },
          (data) => {
            if(data.code === 200){
            data.data.records = [...records, ...data.data.records]
            this.setState({ ...data.data })
            }
            else {
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

    onPullDownRefresh(){
      this.fetchRecord(true)
    }
    onReachBottom (){
      this.onScrollToLower()
    }

    viewDetail(item){
      if(!item.isRead){  // 未读
        
        Request(
          {
            url: 'api/noticeRead',
            method: 'GET',
            data: { id: item.id },
            //isToken:false
          },
          () => {
           // if(data.code === 200){
             
            // }
            // else {
            //   Taro.showToast({
            //     title: data.msg,
            //     icon:'none',
            //     mask: true
            //   });
            // }
          },
        )
      }
      this.setState({visible:true,currentItem:item})
    }

    handleClose(){
      const {records,currentItem} = this.state
      records.map(rec => {
        if(rec.id === currentItem.id){
          rec.isRead = 1
        }
      })
      this.setState({visible:false,records})
    }

    render () {
        
      const {
        records,visible,currentItem
      } = this.state

     
        return (
        
          <View className='rechargeRecords msgRecord'>
                 {records && records.length > 0 ? records.map((item,i) => (
                   <View key={i} className='box' onClick={() => this.viewDetail(item)}>
                      <View className='left'>
                      <View> {!item.isRead && <text></text>} {item.title}</View>
                        <text class='msg'>{item.message}</text>
                      </View>
                      <View className='right'>{item.createTime}</View>
                   </View>
                 )):<View className='noData' style={{ padding: '110px 0' }}>
                 <Image
                   mode='widthFix'
                   src={require('../../images/icon/noData.png')}
                 ></Image>
                 <View>暂无数据</View>
               </View>}

               <AtFloatLayout isOpened={visible} title={currentItem.title} onClose={this.handleClose.bind(this)}>
                  {currentItem.message}
               </AtFloatLayout>

              </View>
      
        )
    }
}
