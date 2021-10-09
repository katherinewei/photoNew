import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';

import {baseUrl} from '../config';
import { AtFloatLayout,AtCountdown,AtButton,AtIcon } from "taro-ui"
import './index.scss';
export default class Pay extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        isOpened: props.visible,
        price:'',
        create:props.create,
        tradeId:props.tradeId

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
      }

     
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onTimeUp () {
      Taro.showToast({
        title: '时间到',
        icon: 'success',
        duration: 2000
      })
    }

    payOrder(pay){
     // const tradeId = (this.props.onSubmit && this.props.onSubmit()) || '';
          // 发送数据
        Request(
          {
            url: 'api/wxDeposit',
            method: 'POST',
            data:{tradeId,amount:200},
          },
          (data) => {
            // 微信支付
            Taro.requestPayment({
              timeStamp: '',
              nonceStr: '',
              package: '',
              signType: 'MD5',
              paySign: '',
              success (res) { },
              fail (res) { }
            })
           
          },
        )
    }

    onClose(){
      this.setState({isOpened:false})
    }


    render () {
     // console.log(this.state.isOpened,98989)
        

        return (
          <AtFloatLayout isOpened={this.state.isOpened}  className="payLayout" onClose={() => this.onClose()}>
            {this.state.create ? <View className="wait" onClick={() => this.onClose()}>稍后支付</View> : 

              <View className="text">请在
                <AtCountdown
                  format={{ hours: ':', minutes: ':', seconds: '' }}
                  hours={24}
                  minutes={0}
                  seconds={0}
                  onTimeUp={this.onTimeUp.bind(this)}/>内支付定金，逾期将自动取消
              </View>
              
            }
            <View className="price"><text>￥</text>{this.state.curItem.price}</View>
            <View className="way">
              <View>支付方式</View>
              <View className="payway"><View className="n">微信</View><View className="icon"><AtIcon value='check' size='12' color='#fff'></AtIcon></View></View>
            </View>
            <AtButton size="small" type="primary" circle onClick={() => this.payOrder(true)}>支付定金</AtButton>
        </AtFloatLayout>
  
        )
    }
}
