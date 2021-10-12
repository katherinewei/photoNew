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
import Pay from '../../components/pay/index'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '确认订单',
    navigationBarTextStyle: 'white',
  }

  state = {
    current:'',
    curState:2,
    isOpened:false,
    curItem:null
  }

  componentWillMount() {

    this.setState({})
  
  }

  componentDidMount() {

    const {id,recordId} = this.$router.params
    
    //根据 ID 获取订单详情信息内容
    Request(
      {
        url: 'api/wxConfirmTrade',
        method: 'POST',
        data: { tradeId:id,recordId},
        //isToken:false
      },
      (data) => {
        if(data.code === 200){
        console.log(data)
        this.setState({ data:data.data,curState: data.data.state})
      // data.data.photoerList = [{headPic:'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',userName:'kkk'}]
      // this.setState({ data:data.data,curState: 1})
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

 

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  checked(e,i){
    e.stopPropagation()
    this.setState({current:i})
  }



  payOrder(e){
    
    const curItem = {...this.state.data,price:this.state.data.diffAmount,recordId:this.$router.params.recordId}
    this.setState({isOpened:true,curItem})
  }

  callback(){
    Taro.redirectTo({
      url: `/pages/order/orderDeatil?id=${curItem.id}`,
    })
  }



  render() {
    const {curState,isOpened,curItem,data } = this.state
    const list = [{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'},{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'}]
    
    return (
      <View className='state1'>
        <View className={`body`}>
         
         <View className="box cc">
           <View className="title">订单信息</View>
           <View className="content">
             <View className="p"><text>预约项目：</text>{data.imgType}</View>
             <View className="p"><text>预约时间：</text>{data.startTime} - {data.endTime}</View>
             <View className="p"><text>拍摄人数：</text>{data.adult ? data.adult + '成人' : ''} {data.adult ? data.child + '儿童' : ''} {data.lover ? data.lover + '情侣' : ''}</View>
             <View className="p"><text>拍摄方式：</text>{data.serviceType}</View>
           </View>
         </View>
         <View className="box cc">
           <View className="title">摄影师 </View>
           <View className="content list">
            
               <View className="item">
              
               <Image  src={data.photoerList[0].headPic} mode="widthFix" ></Image>
               <View>{data.photoerList[0].userName}</View>
               <View>{data.photoerList[0].title}</View>
               <View>报价:￥{data.photoerList[0].amount}</View>
             </View>
            
            
           </View>
         </View>

          <View className="box cc d">
           <View className="title">套餐详情：</View>
           <View className="content">
             <View className="p"><text>拍摄时长:</text>{data.photoTime}小时</View>
             <View className="p"><text>底片数量:</text>{data.plateNum}张</View>
             <View className="p"><text>精修成片:</text>{data.turingNum}张 </View>
             <View className="p"><text>服装造型:</text>{data.dressNum}套 </View>
             <View className="p"><text>总价:</text>￥{data.amount}  </View>
             
           </View>
         </View>

         <View className="box cc totalPrice">
           <View className="title">订单总价：<text class="unit">￥</text>{data.amount}</View>
           <View className="title">定金抵扣：<text class="price">-<text  class="unit">￥</text>{data.payment}</text></View>
         </View>


        
         </View>
         <View className="foot">
         
            <View className="waitPay">
            <text class="p">待支付：￥<text class="price">{data.diffAmount}</text></text>
            <AtButton size="small" type="primary" circle onClick={this.payOrder.bind(this)}>立即支付</AtButton>
          </View>
          
          </View>

         
        <Pay isOpened={isOpened} curItem={curItem} final={true} onOk={() => this.callback()}/>


      </View>
    )
  }
}
