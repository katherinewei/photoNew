import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
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
import Pay from '../../components/pay/index'
import PayCancel from '../../components/pay/cancel'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '订单列表',
    navigationBarTextStyle: 'white',
  }

  componentWillMount() {

    this.setState({
      loading: true,
      current:0,
      curItem:null,
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


  cancelOrder(e){ 
    this.setState({isOpenedCancel:true,isOpened:false})
    return false
  }
  payOrder(e){
    const curItem = {price:'200.55'}
    this.setState({isOpenedCancel:false,isOpened:true,curItem})
  }



  render() {

    const tabs = [{title:'全部',value:0},{title:'预约中',value:1},{title:'已预约',value:2},{title:'已完成',value:3}]
    
    const {current,isOpened,curItem,isOpenedCancel} = this.state

    return (
      <View className="index">
         <AtTabBar
          tabList={tabs}
          onClick={this.handleClick.bind(this)}
          current={current}
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
                  <AtButton size="small" type="secondary" circle onClick={() => this.cancelOrder()}>取消订单</AtButton>
                  <AtButton size="small" type="primary" circle onClick={() => this.payOrder()}>支付定金</AtButton>
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

        
        <Pay isOpened={isOpened} curItem={curItem}/>
        <PayCancel isOpenedCancel={isOpenedCancel} />
        
       

      </View>
    )
  }
}
