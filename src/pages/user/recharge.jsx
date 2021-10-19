import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,  } from '@tarojs/components'
import { AtInput,AtButton,AtIcon  } from "taro-ui"
import Request from '../../utils/request';
import './recharge.scss'
import '../../components/common.scss'

export default class Recharge extends Component {

   
 


    constructor () {
      super(...arguments)
     
    }
    state = {
      prices: [],
      curPrice:''
    }

    componentWillMount () {

    }


    componentDidMount () {
      const $instance = Taro.getCurrentInstance()
      console.log($instance.router.params.price,999)
      this.setState ({
        
        curPrice:$instance.router.params.price || '0.00',
        price:'',
        index:0,
        check:true
      

      })

      
      Request(
        {
          url: 'api/wxDepositList',
          method: 'GET'
        },
        (data) => {
          if(data.code === 200){
            this.setState({prices: data.data})
           
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

    onsubmit(){

      const {index,prices,price} = this.state

      const amount = price ? price : prices[index].amount
     // const that = this
      Request(
        {
          url: 'api/wxDeposit',
          method: 'GET',
          data:{amount}
        },
        (res) => {
          if(res.code === 200){
                 
            const re = res.data
            // 微信支付
            Taro.requestPayment({
              timeStamp: re.timeStamp,
              nonceStr: re.nonceStr,
              package: re.packageValue,
              signType: re.signType,
              paySign: re.paySign,
              success () {

                 Request(
                    {
                      url: 'api/wxDepositSave',
                      method: 'POST',
                      data:{amount}
                    },
                    (data) => {
                      if(data.code === 200){
                        Taro.showToast({
                          title: '充值成功',
                          icon: 'success',
                          mask: true,
                        })
                        setTimeout(() => {
                          Taro.reLaunch({
                            url: `/pages/user/index`,
                          })
                        }, 1000)
                      
                      }else {
                        Taro.showToast({
                          title: data.msg,
                          icon:'none',
                          mask: true
                        });
                      }
                      
                    },
                  )

               },
              fail (res1) { console.log(res1)}
            })
          }else {
            Taro.showToast({
              title: res.msg,
              icon:'none',
              mask: true
            });
          }
          
        },
      )



     

    }

    render () {
        
      const {
        prices,  curPrice ,index,check  
      } = this.state

      console.log(curPrice,9998877)
        return (
         
         <View className='recharge'>
            <View className='current'>
              <View>当前余额(元)
              <text>{curPrice}</text></View>
              <View onClick={() => Taro.navigateTo({url: `/pages/user/record`})}>账单记录</View>
            </View>

            <View className='list'>
              {prices && prices.map((item,i) => (
                <View key={i} className={`${index === i ? 'active' :''} item`} onClick={() => this.setState({index:i})}>
                 <View>{item.title}￥<text>{item.money}</text></View>
              </View>
              ))}

              <View className='other'>
              <AtInput
                placeholder='输入其他金额'
                value={this.state.price}
                name='price'
                onChange={(e) => {
                  this.setState({ price: e })
                }}
              />
              </View>
              
            </View>
              <View className='foot footer'>
                  <View className='agree' onClick={() => this.setState({check: !check})}>
                    <View className='icon'>{check && <AtIcon value='check' size='10' color='#fff'></AtIcon>}</View>
                    <View> 我已阅读并同意<text>《储蓄消费者协议》</text></View>
                    </View>
                  <AtButton size='small' type='primary' circle  onClick={() => this.onsubmit()}>立即充值</AtButton>
              </View>
         </View>
        )
    }
}
