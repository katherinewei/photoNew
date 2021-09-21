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
      prices: [600,1000,2000]
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


    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onScrollToLower(){

    }

    render () {
        
      const {
        prices,  curPrice,price ,index,check  
      } = this.state
        return (
         
         <View className="recharge">
            <View className="current">
              当前余额(元)
              <text>{curPrice}</text>
            </View>
            <View className="list">
              {prices && prices.map((item,i) => (
                <View className={`${index === i ? 'active' :''} item`} onClick={() => this.setState({index:i})}>
                 <View>充值￥<text>{item}</text></View>
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
                  <AtButton size="small" type="primary" circle  onClick={() => Taro.navigateTo({url: `/pages/order/confirmOrder?id=1`})}>立即充值</AtButton>
              </View>
         </View>
        )
    }
}
