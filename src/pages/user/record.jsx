import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,ScrollView,Image} from '@tarojs/components'
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
      Request(
        {
          url: 'api/wxWalletPage',
          method: 'GET'
        },
        (data) => {
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
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

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

    render () {
        
      const {
        records
      } = this.state

      const type = ['支付定金', '签约保证金', '余额提现', '余额充值']
        return (
         
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop={0}
            style={{height: (Taro.getSystemInfoSync().windowHeight) +  'px'}}
            lowerThreshold={20}
            upperThreshold={20}
            onScrollToLower={this.onScrollToLower.bind(this)}
          >
              <View className='rechargeRecords'>
                 {records && records.length > 0 ? records.map((item,i) => (
                   <View key={i} className='box'>
                      <View className='left'>
                      <View>  {type[item.type - 1]}</View>
                        <text>{item.createTime}</text>
                      </View>
                      <View className='right'>{item.type === 4 ? '+' : '-'}{item.amount}</View>
                   </View>
                 )):<View className='noData' style={{ marginTop: '110px' }}>
                 <Image
                   mode='widthFix'
                   src={require('../../images/icon/noData.png')}
                 ></Image>
                 <View>暂无数据</View>
               </View>}
              </View>
          </ScrollView>
        )
    }
}
