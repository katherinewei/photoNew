import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Image} from '@tarojs/components'
import Request from '../../utils/request';
import './recharge.scss'
import '../../components/common.scss'

export default class Record extends Component {

   

    constructor () {
      super(...arguments)
      
    }


    state = {
      records:[]
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
          url: 'api/wxWalletPage',
          method: 'GET'
        },
        (data) => {
          if(refresh){
            Taro.stopPullDownRefresh()
          }
          if(data.code === 200){
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
            url: 'api/wxWalletPage',
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

    render () {
        
      const {
        records
      } = this.state

    //  const type = ['支付定金', '签约保证金', '余额提现', '余额充值']
        return (
        
          <View className='rechargeRecords'>
                 {records && records.length > 0 ? records.map((item,i) => (
                   <View key={i} className='box'>
                      <View className='left'>
                      <View>  {item.content}</View>
                        <text>{item.createTime}</text>
                      </View>
                      <View className='right'>{item.amount > 0 ? '+' : ''}{item.amount}</View>
                   </View>
                 )):<View className='noData' style={{ padding: '110px 0' }}>
                 <Image
                   mode='widthFix'
                   src={require('../../images/icon/noData.png')}
                 ></Image>
                 <View>暂无数据</View>
               </View>}
              </View>
      
        )
    }
}
