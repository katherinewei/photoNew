import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../utils/request';

import {baseUrl} from '../config';
import { AtFloatLayout,AtCountdown,AtButton } from "taro-ui"
import './index.scss';
export default class Pay extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        isOpened: props.visible,
        price:''

      })
    }


    componentWillMount () {

    }

    componentDidMount () {


    }

    componentWillReceiveProps(nextProps) {
      
     
      if(nextProps.isOpened){
        //this.showArea()
        this.setState({isOpened:true,curItem:nextProps.curItem})
      }
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onTimeUp () {
      Taro.showToast({
        title: '时间到',
        icon: 'success',
        duration: 2000
      })
    }


    render () {
      console.log(this.state.isOpened,98989)
        

        return (
          <AtFloatLayout isOpened={this.state.isOpened}  className="payLayout" onClose={() => this.setState({isOpened:false})}>
            <View className="text">请在
            <AtCountdown
              format={{ hours: ':', minutes: ':', seconds: '' }}
              hours={24}
              minutes={0}
              seconds={0}
              onTimeUp={this.onTimeUp.bind(this)}/>内支付定金，逾期将自动取消</View>
            <View className="price"><text>￥</text>{this.state.curItem.price}</View>
            <View className="way">
              <View>支付方式</View>
              <View className="payway"><View className="n">微信</View><View className="icon"><AtIcon value='check' size='12' color='#fff'></AtIcon></View></View>
            </View>
            <AtButton size="small" type="primary" circle>支付定金</AtButton>
        </AtFloatLayout>
  
        )
    }
}
