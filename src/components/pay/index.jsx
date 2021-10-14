 import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtFloatLayout,AtCountdown,AtButton,AtIcon } from "taro-ui"
import Request from '../../utils/request';
import './index.scss';
import {getUserInfo} from '../../utils/help';

export default class Pay extends Component {



    constructor (props) {
      super(props)
      this.setState ({
        create:props.create,
        // eslint-disable-next-line react/no-unused-state
        tradeId:props.tradeId,
        curItem:props.curItem,
        isOpened:props.isOpened,
      })
    }

    state = {
      isOpened:false,
      // eslint-disable-next-line react/no-unused-state
      price: '',
      isWX:true,
      // eslint-disable-next-line react/no-unused-state
      hour:'',
      minutes:'',
      seconds:'',
      curItem:{},
      create:'',
      // eslint-disable-next-line react/no-unused-state
      tradeId:''
    }
    


    componentWillMount () {

    }

    componentDidMount () {
     // console.log(nextProps,22233)
     

    }

    componentWillReceiveProps(nextProps) {

      console.log(nextProps,11122)
      
     // const nextProps = this.props
      if(nextProps.isOpened){
        //this.showArea()
        this.setState({isOpened:true,curItem:nextProps.curItem})

        if(this.state.create){
          // eslint-disable-next-line react/no-unused-state
          this.setState({hour:'24',minutes:'0',seconds:'0'})
        } else {
          const time = new Date(nextProps.curItem.tradeTime).getTime() + (1000  * 60 * 60 *24)  // 截止日期
          const curTime = new Date().getTime() 

        const diff = ( time - curTime) / 1000
//console.log(new Date(nextProps.curItem.tradeTime).getTime(),curTime)
        
        // eslint-disable-next-line react/no-unused-state
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

    payOrder(){
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
          () => {
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

        console.log(isOpened,9987)

        const {final} = this.props

        return (
          <AtFloatLayout isOpened={isOpened}  className='payLayout' onClose={() => this.onClose()}>
            {this.state.create || final ? <View className='wait' onClick={() => this.onClose()}>{final ? '线下支付' : '稍后支付'}</View> : 

              <View className='text'>请在
                <AtCountdown
                  format={{ hours: ':', minutes: ':', seconds: '' }}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  onTimeUp={this.onTimeUp.bind(this)} 
                />内支付{final ? '' : '定金'}，逾期将自动取消
              </View>
              
            }
            <View className='price'><text>￥</text>{curItem.price}</View>
            <View className='way'>
              <View>支付方式</View>
              <View className='payway'><View className='n'>微信</View><View className='icon' onClick={() => this.setState({isWX:true})}>{isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
              <View className='payway'><View className='n'>账户余额：{getUserInfo().remainAmount}</View><View className='icon' onClick={() => this.setState({isWX:false})}>{!isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
            </View>
            <AtButton size='small' type='primary' circle onClick={() => this.payOrder(true)}>立即支付</AtButton>
        </AtFloatLayout>
  
        )
    }
}
