import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import Request from '../utils/request'

export default class Countdown extends Component {

    constructor (props) {
      super(props)
    }
    state = {
      sended:false,
      second:60
    }


    componentWillMount () {

    }

    componentDidMount () {


    }

    componentWillReceiveProps() {
  
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    showSend(){
      let {
        phone
      } = this.props
     
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        Taro.showToast({
          title: '输入正确的手机号码',
          icon: 'none',
          mask: true,
        })
        return false
      }
      const data = {
        mobile:phone
      }
  
      console.log(data)
      // 发送数据
      Request(
        {
          url: 'api/getWxVerificationCode',
          method: 'POST',
          data,
        },
        () => {
          // Taro.showToast({
          //   title: '已发送',
          //   icon: 'success',
          //   mask: true,
          // })
          this.setState({sended:true})
          this.backInterval = setInterval(() => {
            const second = this.state.second - 1
          // console.log(second,9999)
            if(second === 0){
              this.setState({sended:false,second:60})
              clearInterval(this.backInterval)
            } else{
              this.setState({second})
            }
            
          }, 1000);
        },
      )


      

     }


    render () {
        const {sended,second} = this.state
        return (
          
          sended ? <View className='showSecond' >{second}秒后重新发送</View> : <View className='sendCode' onClick={()=>this.showSend()}>发送验证码</View>
        )
    }
}
