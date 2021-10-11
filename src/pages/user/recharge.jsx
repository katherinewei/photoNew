import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import Request from '../../utils/request';
import './recharge.scss'
import '../../components/common.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtInput,AtButton,AtIcon  } from "taro-ui"
import Tabs from '../../components/tab'

export default class Recharge extends Component {

    config = {
        navigationBarTitleText: '充值中心',
        navigationBarBackgroundColor: '#fff',
    }
    state = {
      prices: []
    }



    constructor () {
      super(...arguments)
      this.setState ({
        
        curPrice:this.$router.params.price || '0.00',
        price:'',
        index:0,
        check:true
      

      })
    }


    componentWillMount () {

    }

    componentDidMount () {
      Request(
        {
          url: 'api/wxDepositList',
          method: 'GET'
        },
        (data) => {
          if(data.code === 200){
            this.setState({prices: data.data})
           
          }
          
        },
      )

    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onsubmit(){

      const {index,prices} = this.state

      Request(
        {
          url: 'api/wxDepositSave',
          method: 'POST',
          data:{amount:prices[index].amount}
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
           
          }
          
        },
      )

    }

    render () {
        
      const {
        prices,  curPrice,price ,index,check  
      } = this.state
        return (
         
         <View className="recharge">
            <View className="current">
              <View>当前余额(元)
              <text>{curPrice}</text></View>
              <View onClick={() => Taro.navigateTo({url: `/pages/user/record`})}>账单记录</View>
            </View>

            <View className="list">
              {prices && prices.map((item,i) => (
                <View className={`${index === i ? 'active' :''} item`} onClick={() => this.setState({index:i})}>
                 <View>{item.title}￥<text>{item.money}</text></View>
              </View>
              ))}

              <View className="other">
              <AtInput
                placeholder="输入其他金额"
                value={this.state.price}
                name="price"
                onInput={(e) => {
                  this.setState({ price: e.target.value })
                }}
              />
              </View>
              
            </View>
              <View className="foot">
                  <View className="agree" onClick={() => this.setState({check: !check})}>
                    <View className="icon">{check && <AtIcon value='check' size='10' color='#fff'></AtIcon>}</View>
                    <View> 我已阅读并同意<text>《储蓄消费者协议》</text></View>
                    </View>
                  <AtButton size="small" type="primary" circle  onClick={() => this.onsubmit()}>立即充值</AtButton>
              </View>
         </View>
        )
    }
}
