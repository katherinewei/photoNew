import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Image,Text} from '@tarojs/components'
import {  AtIcon,AtButton} from 'taro-ui'
import Request from '../../utils/request'
import {dataType} from '../../config'
import './detail.scss'
import './modal.scss'
import '../../components/common.scss'

import PayCancel from '../../components/pay/cancel'

const $instance = Taro.getCurrentInstance()
export default class OrderDetail extends Component {
 

  state = {
    current:'',
    curState:2,
    isOpenedCancel:false,
    check:true,
    data:{}
  }



  componentDidMount() {
  

    

    //根据 ID 获取订单详情信息内容
    Request(
      {
        url: 'api/wxTradeDetail',
        method: 'GET',
        data: { tradeId:$instance.router.params.id },
        //isToken:false
      },
      (data) => {
        if(data.code === 200){
        console.log(data)

        dataType.selType6.map(item => {
          if(item.id === data.data.serviceType){
            data.data.serviceType = item.label
          }
        })
        

        if($instance.router.params.recordId){  // 已选定摄影师
          data.data.photoerList.map((item,i) => {
            if(item.id == $instance.router.params.recordId){
              this.setState({current:i})
            }
          })
      
        }

        this.setState({ data:data.data,curState: data.data.state})

        

    //  data.data.photoerList = [{headPic:'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',userName:'kkk',id:1}]
    //   this.setState({ data:data.data,curState: 1})
        }
        else {
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

  cancelOrder(){ 
    this.setState({isOpenedCancel:true})
    return false
  }

  submitOrder(){
    const {check,current,data} = this.state;
    if(!check){
      Taro.showToast({
        title: '请同意协议',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if( !current && current !== 0 ){
      Taro.showToast({
        title: '请选择摄影师',
        icon: 'none',
        mask: true,
      })
      return false
    }
    Taro.navigateTo({url: `/pages/order/confirmOrder?id=${data.id}&recordId=${data.photoerList[current].id}`})

  }

  received(tradeId){
    Request(
      {
        url: 'api/wxReceiveSlice',
        method: 'POST',
        data: { tradeId },
        //isToken:false
      },
      (data) => {
        Taro.showToast({
          title: data.msg,
          icon:'success',
          mask: true
        });
        Taro.reLaunch({
          // eslint-disable-next-line no-undef
          url: `/pages/order/index`,
        })
      })
  }

  

  render() {
    const {curState,isOpenedCancel,data} = this.state
   // const list = [{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'},{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'}]
    const stateName = ['待支付','预约中','已预约','等待收成片','已提交成片','收到成片','已完成'] 

const tradeId = $instance.router.params.id

    return (
      data.id ?  <View className={`${curState > 1 ? 'state1' : ''} orderDetail`}>
        <View className='body'>
         <View className='box state'>{stateName[curState]}</View>
         <View className='box cc'>
           <View className='title'>订单信息</View>
           <View className='content'>
             <View className='p'><text>预约项目：</text>{data.typeDesc} {data.tagDesc}</View>
             <View className='p'><text>预约时间：</text>{data.startTimeStr} - {data.endTimeStr}</View>
             <View className='p'><text>拍摄人数：</text>{data.adult ? data.adult + '成人' : ''} {data.child ? data.child + '儿童' : ''} {data.lover ? data.lover + '情侣' : ''}</View>
             <View className='p'><text>拍摄方式：</text>{data.serviceType}</View>
           </View>
         </View>
          <View className='box cc'>
           <View className='title'>摄影师接单{ curState === 1 ? `(${data.photoerList.length})` : ''} {curState === 1 && <text>请选择</text>}</View>
          {data.photoerList && data.photoerList.length > 0 &&  <View className='tip'>点击头像查看摄影师进一步查看服务详情</View>}
           <View className='content list'>
             { data.photoerList.map((item,i) => (
               <View key={i} className='item' onClick={() => Taro.navigateTo({url: `/pages/order/photographer?id=${item.id}&tradeId=${data.id}&readonly=${curState === 1 ? 0:1}`})}>
                  <View >
                  <View onClick={e => e.stopPropagation()}> {curState === 1 && <View className={(this.state.current ===i ? `check` : '') + ` radio`} onClick={(e) => this.checked(e,i)}></View>}</View>
                    <Image  src={item.headPic} mode='widthFix' ></Image>
                    <View>{item.userName}</View>
                    <View>{item.title}</View>
                    <View>报价:￥{item.amount}</View>
                    <View>性别:{item.sex === 1 ? '女' : '男'}</View>
                  </View>
             </View>
             ))}
            
           </View>
         </View>

         {curState > 2 && <View className='box cc d'>
           <View className='title'>套餐详情：</View>
           <View className='content'>
             <View className='p'><text>拍摄时长:</text>{data.photoTime}小时</View>
             <View className='p'><text>底片数量:</text>{data.plateNum}张</View>
             <View className='p'><text>精修成片:</text>{data.turingNum}张</View>
             <View className='p'><text>服装造型:</text>{data.dressNum}套 </View>
             <View className='p'><text>总价:</text>￥{data.amount} </View>
             
           </View>
         </View>}


         <View className='box cc d'>
           <View className='title'>{curState === 1 ? '已付定金' : `实付:${data.payAmount}` }</View>
           <View className='content'>
            
             <View className='p'><text>订单号:</text>{data.tradeNo}</View>
             <View className='p'><text>手机号:</text>{data.contract}</View>
             <View className='p'><text>付款时间:</text>{data.payTime}</View>
             <View className='p'><text>下单时间:</text>{data.tradeTime}</View>
             {curState > 1  && <View className='p'><text>支付类型:</text>{data.offlinePayState ===1 ? '线下支付' : '线上支付'}</View>}
             {curState === 1 && <View className='p'><text>定 金:</text>￥{data.payment}</View>}
             
           </View>
         </View>
           <View className='box cc d'>
           <View className='title'>温馨提示：</View>
           <View className='content'>
              <View className='tip'>
                <text class='tt'>服务流程:</text>
                <Text class='ccont' dangerouslySetInnerHTML={{ __html: `确认下单 - >支付定金- >客服回电确认信息- >确定
                  摄影师- >享受拍摄服务- >支付尾款- >收到成片  
                  关于我的资金安全?  
                  在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。`}}
                >
                </Text>
                </View>
                {/* <View className='tip'>
                <text class='tt'>订单规则:</text>
                <Text class='ccont' dangerouslySetInnerHTML={{ __html: `确认下单- >支付定金- >客服回电确认信息- >确定
摄影师- >享受拍摄服务- >支付尾款- >收到成片 

关于我的资金安全? 
在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。`}}
                >

                  </Text>
                </View> */}

           </View>
              
         </View>
         </View>
         <View className={`${curState === 1 ? 'moreHeight' : ''} foot`}>
         {curState === 1 &&<View>
            <View className='agree' onClick={() => this.setState({check: !this.state.check})}>
             <View className='icon'>{this.state.check && <AtIcon value='check' size='10' color='#fff'></AtIcon>}</View>
             <View> 我已阅读并同意 <text onClick={() => Taro.navigateTo({url: `/pages/order/protocol`})}>《拍摄服务撮合协议》</text></View>
            </View>
           <AtButton size='small' type='primary' circle  onClick={() => this.submitOrder()}>提交订单</AtButton>
         </View>}
         
         {(curState === 2) && <View>
           
           <AtButton size='small' type='primary' circle onClick={this.cancelOrder.bind(this)}>取消订单</AtButton>
         </View>
         }
         {curState > 4  && !data.commentFlag && 
           
           <AtButton size='small' type='primary' circle onClick={() => Taro.navigateTo({url: `/pages/order/evaluation?id=${data.id}`})}>立即评价</AtButton>
         
         }

          {(curState === 4)  &&  <AtButton size='small' type='primary' circle  onClick={() => this.received(data.id)}>收到成片</AtButton>}

          </View>

         

        <PayCancel isOpenedCancel={isOpenedCancel} tradeId={tradeId} />

      </View> : <View></View>
    )
  }
}
