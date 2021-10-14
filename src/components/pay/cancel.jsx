// import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtFloatLayout,AtButton } from "taro-ui"
import Request from '../../utils/request';

import './index.scss';

export default class Pay extends Component {
    constructor (props) {
      super(props)
      this.setState ({
        isOpenedCancel: props.isOpenedCancel,

      })
    }
    state = {
      isOpenedCancel:false
    }

    componentWillMount () {

    }

    componentDidMount () {


    }

    componentWillReceiveProps(nextProps) {
      
     console.log(nextProps)
      if(nextProps.isOpenedCancel){
        //this.showArea()
        this.setState({isOpenedCancel:true})
      }
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onCancel(){
      
      // 发送数据
      Request(
        {
          url: 'api/wxCancelTrade',
          method: 'POST',
          data:{tradeId:this.props.tradeId},
        },
        (data) => {
         
         if(data.code === 200){

          this.setState({isOpenedCancel:false})

          this.props.onOk && this.props.onOk()

         }
        },
      )
    }

    onClose(){
      this.setState({isOpenedCancel:false})
    }


    render () {
     console.log(this.state,6)

        return (
          this.state.isOpenedCancel && <AtFloatLayout isOpened={this.state.isOpenedCancel}  className='payLayout cancelL' onClose={() => this.onClose()}>
          <View className='t'>取消订单后将无法恢复</View>
          <View className=' way p'>取消订单请确保已与摄影师完成沟通，无责任取消订单后，支付金额将退回您充值账户，充值到期未消费将进行退款。</View>
         
          <AtButton size='small' type='primary' circle onClick={() => this.onCancel()}>确定取消</AtButton>
      </AtFloatLayout>
  
        )
    }
}
