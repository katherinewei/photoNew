import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import {
  timeString,
  setAccessToken,
  getImageUrl,
  typeS,
  setUserId,
  getToken,
  setUserInfo,
  validateLogin
} from '../../utils/help'
import { ImageUrl } from '../../config'
import './detail.scss'
import './modal.scss'
import {
  AtTabBar,AtIcon,AtButton,AtAvatar,AtFloatLayout,AtCountdown

} from 'taro-ui'
import NavBar from '../../components/Navbar/index'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '确认订单',
    navigationBarTextStyle: 'white',
  }

  state = {
    current:'',
    curState:2,
    isOpened:false
  }

  componentWillMount() {

    this.setState({})
  
  }

  componentDidMount() {
    
  }

 

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  checked(e,i){
    e.stopPropagation()
    this.setState({current:i})
  }



  payOrder(e){
    this.setState({isOpened:true})
  }

  onTimeUp () {
    Taro.showToast({
      title: '时间到',
      icon: 'success',
      duration: 2000
    })
  }

  render() {
    const {curState} = this.state
    const list = [{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'},{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'}]
    
    return (
      <View className='state1'>
        <View className={`body`}>
         
         <View className="box cc">
           <View className="title">订单信息</View>
           <View className="content">
             <View className="p"><text>预约项目：</text>写真约拍</View>
             <View className="p"><text>预约时间：</text>8月21日 13:00 - 20:00</View>
             <View className="p"><text>拍摄人数：</text>1成人</View>
             <View className="p"><text>拍摄方式：</text>室内棚拍,外景</View>
           </View>
         </View>
         <View className="box cc">
           <View className="title">摄影师接单{curState === 0 ? '(10)' : ''} </View>
           <View className="content list">
             {list.map((item,i) => (
               <View className="item" onClick={() => Taro.navigateTo({url: `/pages/order/photographer?id=1`})}>
               <View className={(this.state.current ===i ? `check` : '') + ` radio`} onClick={(e) => this.checked(e,i)}></View>
               <Image  src={item.img} mode="widthFix" ></Image>
               <View>{item.name}</View>
               <View>{item.title}</View>
               <View>报价:￥{item.price}</View>
             </View>
             ))}
            
           </View>
         </View>

          <View className="box cc d">
           <View className="title">套餐详情：</View>
           <View className="content">
             <View className="p"><text>拍摄时长:</text>3658741</View>
             <View className="p"><text>底片数量:</text>13685428889</View>
             <View className="p"><text>精修成片:</text>2021-08-15 15:00 </View>
             <View className="p"><text>服装造型:</text>2021-08-15 15:10 </View>
             <View className="p"><text>总价:</text>2021-08-15 15:10 </View>
             
           </View>
         </View>

         <View className="box cc totalPrice">
           <View className="title">订单总价：<text class="unit">￥</text>1000.00</View>
           <View className="title">定金抵扣：<text class="price">-<text  class="unit">￥</text>1000.00</text></View>
         </View>


        
         </View>
         <View className="foot">
         
            <View className="waitPay">
            <text class="p">待支付：￥<text class="price">800.00</text></text>
            <AtButton size="small" type="primary" circle onClick={this.payOrder.bind(this)}>立即支付</AtButton>
          </View>
          
          </View>

          <AtFloatLayout isOpened={this.state.isOpened}  className="payLayout">
            <View className="text">请在
            <AtCountdown
              format={{ hours: ':', minutes: ':', seconds: '' }}
              hours={24}
              minutes={0}
              seconds={0}
              onTimeUp={this.onTimeUp.bind(this)}/>内支付定金，逾期将自动取消</View>
            <View className="price"><text>￥</text>200.00</View>
            <View className="way">
              <View>支付方式</View>
              <View className="payway"><View className="n">微信</View><View className="icon"><AtIcon value='check' size='12' color='#fff'></AtIcon></View></View>
            </View>
            <AtButton size="small" type="primary" circle>支付定金</AtButton>
        </AtFloatLayout>

      </View>
    )
  }
}
