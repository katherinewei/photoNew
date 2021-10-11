import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';

import {baseUrl} from '../config';
import { AtFloatLayout,AtCountdown,AtButton,AtIcon } from "taro-ui"
import './index.scss';
import {getUserInfo} from '../../utils/help';

export default class Pay extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        isOpened: props.visible,
        price:'',
        create:props.create,
        tradeId:props.tradeId,
        isWX:true,
        hour:'',
        minutes:'',
        seconds:'',
        curItem:{}

      })
    }


    componentWillMount () {

    }

    componentDidMount () {
      

    }

    componentWillReceiveProps(nextProps) {
      
     
      if(nextProps.isOpened){
        //this.showArea()
        this.setState({isOpened:true,curItem:nextProps.curItem})

        if(this.state.create){
          this.setState({hour:'24',minutes:'0',seconds:'0'})
        } else {
          const time = new Date(nextProps.curItem.tradeTime).getTime() + (1000  * 60 * 60 *24)  // 截止日期
          const curTime = new Date().getTime() 

        const diff = ( time - curTime) / 1000
//console.log(new Date(nextProps.curItem.tradeTime).getTime(),curTime)
        
        this.setState({hour:diff / 60 / 60 ,minutes:diff / 60 ,seconds:diff})

        }

        
      }

     
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onTimeUp () {
      // Taro.showToast({
      //   title: '时间到',
      //   icon: 'success',
      //   duration: 2000
      // })
      if(this.state.isOpened){
        // 发送数据
        Request(
          {
            url: 'api/wxCancelTrade',
            method: 'POST',
            data:{tradeId:this.props.tradeId},
          },
          (data) => {
          
          if(data.code === 200){
              this.onClose()
               Taro.showToast({
                title: '已取消订单',
                icon: 'success',
                duration: 2000
              })

              this.props.onOk && this.props.onOk()
          }
          },
         )
      }
       


    }

    payOrder(pay){
     // const tradeId = (this.props.onSubmit && this.props.onSubmit()) || '';
          // 发送数据

          let data = {tradeId:this.props.tradeId}
          if(this.props.final){
            data.recordId = this.state.curItem.recordId
            data.diffAmount = this.state.curItem.price
          } else {
            data.amount = this.state.curItem.price
          }
        Request(
          {
            url: this.props.final ? 'api/wxConfirmPayment' : 'api/wxDeposit',
            method: 'POST',
            data,
          },
          (data) => {
            this.onClose()
            this.props.onOk && this.props.onOk()
            // 微信支付
            // Taro.requestPayment({
            //   timeStamp: '',
            //   nonceStr: '',
            //   package: '',
            //   signType: 'MD5',
            //   paySign: '',
            //   success (res) { },
            //   fail (res) { }
            // })
           
          },
        )
    }

    onClose(){
      this.setState({isOpened:false})
    }


    render () {
     // console.log(this.state.isOpened,98989)
        const {isOpened,isWX,curItem,hours,minutes,seconds} = this.state

        console.log(hours,minutes,seconds)

        const {final} = this.props

        return (
          <AtFloatLayout isOpened={isOpened}  className="payLayout" onClose={() => this.onClose()}>
            {this.state.create || final ? <View className="wait" onClick={() => this.onClose()}>{final ? '线下支付' : '稍后支付'}</View> : 

              <View className="text">请在
                <AtCountdown
                  format={{ hours: ':', minutes: ':', seconds: '' }}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  onTimeUp={this.onTimeUp.bind(this)}/>内支付{final ? '' : '定金'}，逾期将自动取消
              </View>
              
            }
            <View className="price"><text>￥</text>{curItem.price}</View>
            <View className="way">
              <View>支付方式</View>
              <View className="payway"><View className="n">微信</View><View className="icon" onClick={() => this.setState({isWX:true})}>{isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
              <View className="payway"><View className="n">账户余额：{getUserInfo().remainAmount}</View><View className="icon" onClick={() => this.setState({isWX:false})}>{!isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
            </View>
            <AtButton size="small" type="primary" circle onClick={() => this.payOrder(true)}>立即支付</AtButton>
        </AtFloatLayout>
  
        )
    }
}
