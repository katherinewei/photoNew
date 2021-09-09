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
    navigationBarTitleText: '订单详情',
    navigationBarTextStyle: 'white',
  }

  state = {
    current:'',
    curState:2,
    isOpenedCancel:false
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

  cancelOrder(e){ 
    this.setState({isOpenedCancel:true})
    return false
  }

  

  render() {
    const {curState} = this.state
    const list = [{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'},{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'}]
    
    return (
      <View className={curState !== 0 ? 'state1' : ''}>
        <View className={`body`}>
         <View className="box state">{curState === 0 ? '预约中' : curState === 1 ? '预约成功' : curState === 2 ? '已完成' : ''}</View>
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

         {curState !== 0 && <View className="box cc d">
           <View className="title">套餐详情：</View>
           <View className="content">
             <View className="p"><text>拍摄时长:</text>3658741</View>
             <View className="p"><text>底片数量:</text>13685428889</View>
             <View className="p"><text>精修成片:</text>2021-08-15 15:00 </View>
             <View className="p"><text>服装造型:</text>2021-08-15 15:10 </View>
             <View className="p"><text>总价:</text>2021-08-15 15:10 </View>
             
           </View>
         </View>}


         <View className="box cc d">
           <View className="title">已付定金：</View>
           <View className="content">
             <View className="p"><text>订单号:</text>3658741</View>
             <View className="p"><text>手机号:</text>13685428889</View>
             <View className="p"><text>付款时间:</text>2021-08-15 15:00 </View>
             <View className="p"><text>下单时间:</text>2021-08-15 15:10 </View>
             <View className="p"><text>定 金:</text>￥200</View>
             
           </View>
         </View>
         {curState !== 0 &&  <View className="box cc d">
           <View className="title">温馨提示：</View>
           <View className="content">
              <View className="tip">
                <text class="tt">服务流程:</text>
                <text class="ccont">确认下单 - &gt;支付定金- &gt;客服回电确认信息- &gt;确定
                  摄影师- &gt;享受拍摄服务- &gt;支付尾款- &gt;收到成片  \n \n
                  关于我的资金安全?  \n
                  在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。
                  </text>
                </View>
                <View className="tip">
                <text class="tt">订单规则:</text>
                <text class="ccont">确认下单- &gt;支付定金- &gt;客服回电确认信息- &gt;确定
摄影师- &gt;享受拍摄服务- &gt;支付尾款- &gt;收到成片 \n \n

关于我的资金安全? \n
在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。

                  </text>
                </View>

           </View>
              
         </View>}
         </View>
         <View className="foot">
         {curState === 0 && <View>
            <View className="agree">
             <View className="icon"><AtIcon value='check' size='10' color='#fff'></AtIcon></View>
             <View> 我已阅读并同意<text>《拍摄服务撮合协议》</text></View>
            </View>
           <AtButton size="small" type="primary" circle  onClick={() => Taro.navigateTo({url: `/pages/order/confirmOrder?id=1`})}>提交订单</AtButton>
         </View>
         }
         {curState === 1 && <View>
           
           <AtButton size="small" type="primary" circle onClick={this.cancelOrder.bind(this)}>取消订单</AtButton>
         </View>
         }
         {curState === 2 && <View>
           
           <AtButton size="small" type="primary" circle onClick={() => Taro.navigateTo({url: `/pages/order/evaluation?id=1`})}>立即评价</AtButton>
         </View>
         }

          </View>

          <AtFloatLayout isOpened={this.state.isOpenedCancel}  className="payLayout cancelL">
            <View className="t">取消订单后将无法恢复</View>
            <View className=" way p">取消订单请确保已与摄影师完成沟通，无责任取消订单后，支付金额将退回您充值账户，充值到期未消费将进行退款。</View>
           
            <AtButton size="small" type="primary" circle>确定取消</AtButton>
        </AtFloatLayout>

      </View>
    )
  }
}
