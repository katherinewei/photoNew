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
import './index.scss'
import './modal.scss'
import {
  AtTabBar,AtIcon,AtButton,AtAvatar,AtFloatLayout,AtCountdown

} from 'taro-ui'
import NavBar from '../../components/Navbar/index'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '订单列表',
    navigationBarTextStyle: 'white',
  }

  componentWillMount() {

    this.setState({
      loading: true,
      current:0,
      isOpened:false, // 支付定金弹窗
      isOpenedCancel:false // 取消订单
      
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {
    

  }

  getPhoneNumber(e) {
    
  }


  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}




  //上拉刷新
  onScrollToLower() {
    const { pages, current, records, currentSearch } = this.state

    if (pages > current) {
      Request(
        {
          url: 'photo-index',
          method: 'GET',
          data: { page: current + 1, ...currentSearch },
          //isToken:false
        },
        (data) => {
          data.data.records = [...records, ...data.data.records]
          console.log(data)
          this.setState({ ...data.data })
        },
      )
    }
  }

  handleClick(){

  }
  onTimeUp () {
    Taro.showToast({
      title: '时间到',
      icon: 'success',
      duration: 2000
    })
  }

  cancelOrder(e){ 
    this.setState({isOpenedCancel:true,isOpened:false})
    return false
  }
  payOrder(e){
    this.setState({isOpenedCancel:false,isOpened:true})
  }



  render() {

    const tabs = [{title:'全部',value:0},{title:'预约中',value:1},{title:'已预约',value:2},{title:'已完成',value:3}]
    

    return (
      <View className="index">
         <AtTabBar
          tabList={tabs}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
        />
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          scrollTop={0}
          style={{height: (Taro.getSystemInfoSync().windowHeight) - 50 +  'px'}}
          lowerThreshold={20}
          upperThreshold={20}
          onScrollToLower={this.onScrollToLower.bind(this)}>
          <View className="container">
            <View className="box" onClick={() => Taro.navigateTo({url: `/pages/order/orderDeatil?id=1`})}>
              <View className="state">
                <View className="position"><AtIcon value='map-pin' size='20' color='#000' ></AtIcon>长沙 芙蓉区</View>
                <View className="sta">待支付</View>
              </View>
              <text class="time">拍摄时间：8月21日 13:00 - 8月21日 20:00 \n
              写真约拍：1成人</text>
              <View className="replay">已有<text class="num">12</text>位摄影师回复，<text class="num">请支付定金查看&gt;</text></View>
              <View className="list">
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk34
                </View>
              </View>
              <View className="foot" onClick={e => e.stopPropagation()}>
                <View className="left">待付定金:<text>￥200.00</text></View>
                <View className="btns">
                  <AtButton size="small" type="secondary" circle onClick={this.cancelOrder.bind(this)}>取消订单</AtButton>
                  <AtButton size="small" type="primary" circle onClick={this.payOrder.bind(this)}>支付定金</AtButton>
                </View>
              </View>
            </View>
            <View className="box">
              <View className="state">
                <View className="position"><AtIcon value='map-pin' size='20' color='#000' ></AtIcon>长沙 芙蓉区</View>
                <View className="sta">预约中</View>
              </View>
              <text class="time">拍摄时间：8月21日 13:00 - 8月21日 20:00 \n
              写真约拍：1成人</text>
              <View className="replay">已有<text class="num">12</text>位摄影师回复，<text class="num">请支付定金查看&gt;</text></View>
              <View className="list">
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
                <View className="item" >
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  hjkkk
                </View>
              </View>
              <View className="foot">
                <View className="left">已付定金:<text>￥200.00</text></View>
                <View className="btns">
                  <AtButton size="small" type="secondary" circle>取消预约</AtButton>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>

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

        <AtFloatLayout isOpened={this.state.isOpenedCancel}  className="payLayout cancelL">
            <View className="t">取消订单后将无法恢复</View>
            <View className=" way p">取消订单请确保已与摄影师完成沟通，无责任取消订单后，支付金额将退回您充值账户，充值到期未消费将进行退款。</View>
           
            <AtButton size="small" type="primary" circle>确定取消</AtButton>
        </AtFloatLayout>

      </View>
    )
  }
}
