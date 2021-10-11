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
      current:1,
      currentState:0,
      curItem:null,
      orderState:'',
      isOpened:false, // 支付定金弹窗
      isOpenedCancel:false, // 取消订单
      tradeId:''//交易单号
      
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {
    getToken(() => {
      this.fetchOrder()
    })

  }

  getPhoneNumber(e) {
    
  }

  // 获取订单
  fetchOrder(){
    const { pages, current, records,orderState } = this.state
    Request(
      {
        url: 'api/wxTradePage',
        method: 'GET',
        data: { page: 1,orderState },
        //isToken:false
      },
      (data) => {

        // data.data.records.map(item => {
        //   item.state = 0
        //   item.photoerList = [{headPic:'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',userName:'kkk'}]
        // })
        this.setState({ ...data.data,isOpenedCancel:false,isOpened:false })
      },
    )
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
          url: 'api/wxTradePage',
          method: 'GET',
          data: { page: current + 1,orderState },
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

  handleClick(e){
    console.log(e)
    // 根据状态值展示不一样列表;不填则表示查询全部,
    //订单状态 -1 取消订单 0:确认下单(待支付) 1:支付定金(已支付) 2.客户回电确认信息 3.确认摄影师 4.享受拍摄服务 5.支付尾款 6.收到成片
    this.setState({currentState:e})
    let {orderState} = this.state
    switch(e){
      case 0:
        orderState = ''
        break;
        case 1:
          orderState = 100
          break;
        case 2:
          orderState = 3
          break;
        case 3:
          orderState = 6
          break;  
         default:
         break 

    }
    this.setState({orderState},() => {
      this.fetchOrder()
    })
  }


  cancelOrder(e){ 
    this.setState({isOpenedCancel:true,isOpened:false,tradeId:e.id})
    return false
  }
  payOrder(item){
    const curItem = item
    curItem.price = item.payment

    this.setState({isOpenedCancel:false,isOpened:true,curItem,tradeId:item.id})
  }



  render() {

    const tabs = [{title:'全部'},{title:'预约中'},{title:'已预约'},{title:'已完成'}]
    
    const {currentState,isOpened,curItem,isOpenedCancel,records,tradeId} = this.state

    const stateName = ['取消订单','待支付','预约中','确认摄影师','','享受拍摄服务','支付尾款','已完成'] 
   
    return (
      <View className="index">
         <AtTabBar
          tabList={tabs}
          onClick={(e) => this.handleClick(e)}
          current={currentState}
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
          {records && records.length > 0 ? (
            records.map((item, i) => (
              <View className="box" onClick={() => item.state !== -1 && item.state !== 0 &&  Taro.navigateTo({url: `/pages/order/orderDeatil?id=${item.id}`})}>
                <View className="state">
                  <View className="position"><AtIcon value='map-pin' size='20' color='#000' ></AtIcon>{item.city} {item.area}</View>
                  <View className="sta">{stateName[item.state + 1]}</View>
                </View>
                <text class="time">拍摄时间： <Text className="s">{item.startTime} - {item.endTime}</Text> \n
                {item.typeDesc}：{item.adult ? item.adult + '成人' : ''} {item.adult ? item.child + '儿童' : ''} {item.lover ? item.lover + '情侣' : ''}</text>
                {item.photoerList && item.photoerList.length > 0 && <View className="replay">
                  {item.state === 0 ? <View>  已有<text class="num">{item.photoerList.length}</text>位摄影师回复， <text class="num">请支付定金查看&gt;</text></View> : item.state > 0 ? '已选定摄影师' : ''}

                  </View>}
               
                {item.photoerList && item.photoerList.length > 0 ?  <View className="list"> {
                  item.photoerList.map((photoer, i) => (
                  <View className="item" >
                    <AtAvatar  circle  image={photoer.headPic}   ></AtAvatar>
                    {photoer.userName}
                  </View>
                ))}</View>:''}
                
               {item.state >= 0 &&  <View className="foot" onClick={e => e.stopPropagation()}>
                  
                  <View className="left"> 
                    {item.state > 1 ? <View>实付：<text>￥{item.payAmount}</text></View> : 
                    <View>{item.state === 0 ? '待' : '已'}付定金：<text>￥{item.payment}</text></View>}
                  </View>
                  <View className="btns">
                      {(item.state === 0 || item.state === 1 || item.state === 2) && <AtButton size="small" type="secondary" circle onClick={() => this.cancelOrder(item)}>取消{item.state === 1 ? '预约': '订单'}</AtButton>}
                      {item.state === 0 &&  <AtButton size="small" type="primary" circle onClick={() => this.payOrder(item)}>支付定金</AtButton>}
                      {(item.state === -1 || item.state === 6)  &&  <AtButton size="small" type="secondary" circle onClick={() => this.deleteOrder(item)}>删除订单</AtButton>}
                      {(item.state === 6)  &&  <AtButton size="small" type="secondary" circle  onClick={() => Taro.navigateTo({url: `/pages/order/evaluation?id=${item.id}`})}>评价订单</AtButton>}
                  </View>
                </View>}
              </View>
            
          ))): (
            <View className="noData" style={{ marginTop: '110px' }}>
              <Image
                mode="widthFix"
                src={require('../../images/icon/noData.png')}
              ></Image>
              <View>暂无数据</View>
            </View>
          )}

          
          </View>
        </ScrollView>

        
        <Pay isOpened={isOpened} curItem={curItem} tradeId={tradeId}  onOk={() => this.fetchOrder()}/>
        <PayCancel isOpenedCancel={isOpenedCancel} tradeId={tradeId} onOk={() => this.fetchOrder()}/>
        
       

      </View>
    )
  }
}
