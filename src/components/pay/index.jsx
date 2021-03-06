 import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtFloatLayout,AtCountdown,AtButton,AtIcon, AtModal} from "taro-ui"
import Request from '../../utils/request';
import './index.scss';
import {getUserInfo} from '../../utils/help';

export default class Pay extends Component {



    constructor (props) {
      super(props)
      this.setState ({
       // create:props.create,
        // eslint-disable-next-line react/no-unused-state
        tradeId:props.tradeId,
        curItem:props.curItem,
        isOpened:props.isOpened,
      })

    //  console.log(props)
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
      //create:false,
      // eslint-disable-next-line react/no-unused-state
      tradeId:'',
      visible:false
    }
    


    componentWillMount () {

    }

    componentDidMount () {
     // console.log(nextProps,22233)
     

    }

    componentWillReceiveProps(nextProps) {

     // console.log(nextProps,11122)
      
     // const nextProps = this.props
      if(nextProps.isOpened){
        //this.showArea()
        this.setState({isOpened:true,curItem:nextProps.curItem})

        if(nextProps.create){
          // eslint-disable-next-line react/no-unused-state
          this.setState({hours:23,minutes:59,seconds:59})
          console.log(324234)
        } else {
          let createTime = nextProps.curItem.createTime
          createTime = createTime.replace(/-/g,'/')
          const time = new Date(createTime).getTime() + (24 * 3600 * 1000)  // 截止日期
          const curTime = new Date().getTime() 
   
       // const diff = ( time - curTime)  / 1000

       const dateDiff = time - curTime;//时间差的毫秒数
      // const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
       const leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
       const hours=Math.floor(leave1/(3600*1000))//计算出小时数
       //计算相差分钟数
       const leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
       const minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
       //计算相差秒数
       const leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
       const seconds=Math.round(leave3/1000)

       console.log(hours ,minutes ,seconds)


//console.log(new Date(nextProps.curItem.createTime).getTime() / 1000,time,curTime,diff)
        
        // eslint-disable-next-line react/no-unused-state
        this.setState({hours ,minutes ,seconds})
       // console.log(4564645)
        }

        
      } else {
        this.setState({isOpened:false,hours:0 ,minutes:0 ,seconds:0})
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

    payOrder(offlinePayment){
     // const tradeId = (this.props.onSubmit && this.props.onSubmit()) || '';
          // 发送数据
          const that = this

          Request({
            url: 'api/getWxTemplateId' ,
            method: 'GET'
          },
          (res) => {
            const tmplIds = res.data
           
            wx.requestSubscribeMessage({
              tmplIds: [tmplIds],
              success () {
                  const {isWX} = that.state
  
                  if(isWX && !offlinePayment){
                        
                        let data = {tradeId:that.props.tradeId,type:that.props.final ? 2 : 1}
                        if(that.props.final){
                          data.recordId = that.state.curItem.recordId
                        }
                        Request(
                          {
                            url: 'api/wxTradePay',
                            method: 'GET',
                            data,
                          },
                          (res) => {
                            console.log(res.data)
                            if(res.code === 200){
                            
                              const re = res.data
                              // 微信支付
                              Taro.requestPayment({
                                timeStamp: re.timeStamp,
                                nonceStr: re.nonceStr,
                                package: re.packageValue,
                                signType: re.signType,
                                paySign: re.paySign,
                                success (res1) {
              
                                  that.onClose()
                                  that.props.onOk && that.props.onOk()
              
                                  console.log(res1)
              
                                },
                                fail (res1) { console.log(res1)}
                              })
                            }
                          })
                      
                    
                  } else {
                    let data = {tradeId:that.props.tradeId}
                    if(offlinePayment){
                      data.offlinePayment = true
                    } else {
                      if(Number(getUserInfo().remainAmount) < Number(that.state.curItem.price)){
                        Taro.showToast({
                          title: '余额不足，请使用微信支付或充值足额进行支付！',
                          icon:'none',
                          mask: true
                        });
                        return false
                      }
                    }
                    
                  
                    if(that.props.final){
                      data.recordId = that.state.curItem.recordId
                      data.diffAmount = that.state.curItem.price
                    } else {
                      data.amount = that.state.curItem.price
                    }
  
                    Request({
                        url: that.props.final ? 'api/wxConfirmPayment' : 'api/wxDeposit',
                        method: 'POST',
                        data,
                      },
                      () => {
                        that.onClose()
                        that.props.onOk && that.props.onOk()
                        
                      })
                }
              } 
            })

          })


         
    }

    onClose(){
      this.setState({isOpened:false})
      this.hideModal()
    }

    notPay(flag){
      if(flag){
        this.payOrder(true)
      } else {
        this.onClose()
        Taro.reLaunch({  url: `/pages/order/index` })
      }
      
    }

    openModal(){
      this.setState({visible:true})
    }
    hideModal(){
      // eslint-disable-next-line react/no-unused-state
      this.setState({visible:false})
    }


    render () {
      
        const {isOpened,isWX,curItem,hours,minutes,seconds,visible} = this.state

       // console.log(isOpened,create,hours,minutes,seconds,9987)

        const {final,create} = this.props

        return (
          <AtFloatLayout isOpened={isOpened}  className='payLayout' onClose={() => this.onClose()}>
            {create || final ? <View className='wait' onClick={() => final ? this.openModal() : this.notPay()}>{final ? '线下支付' : '稍后支付'}</View> : 

              <View className='text'>请在
               {isOpened &&  <AtCountdown
                 format={{ hours: ':', minutes: ':', seconds: '' }}
                 hours={hours}
                 minutes={minutes}
                 seconds={seconds}
                 onTimeUp={this.onTimeUp.bind(this)}
               />}内支付{final ? '' : '定金'}，逾期将自动取消
              </View>
              
            }
            
            <View className='price'><text>￥</text>{curItem.price && curItem.price.toFixed(2)}</View>
            <View className='way'>
              <View>支付方式</View>
              <View className='payway'><View className='n'>微信</View><View className={`${isWX?'active' : ''} icon`} onClick={() => this.setState({isWX:true})}>{isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
              <View className='payway balance'><View className='n'>账户余额：{getUserInfo() && getUserInfo().remainAmount}</View><View className={`${!isWX?'active' : ''} icon`}  onClick={() => this.setState({isWX:false})}>{!isWX && <AtIcon value='check' size='12' color='#fff'></AtIcon>}</View></View>
            </View>
            <AtButton size='small' type='primary' circle onClick={() => this.payOrder(false)}>立即支付</AtButton>

            <AtModal
              isOpened={visible}
              title='线下支付'
              cancelText='取消'
              confirmText='确认'
              onClose={() => this.notPay(false)}
              onCancel={() => this.notPay(false)}
              onConfirm={() => this.notPay(true)}
              content='在拍摄当天自行与摄影师支付尾款，平台只保护线上定金部分。'
              className='offLineVisible'
            />

        </AtFloatLayout>
  
        )
    }
}
