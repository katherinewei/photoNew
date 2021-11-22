import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View} from '@tarojs/components'
import {
  AtRadio ,AtIcon
} from 'taro-ui'
import './publishService.scss'
import './picker.scss'


export default class AssociationType extends Component {
 

  state = {
    value: '',
    option: [], 
    isType:true  // 是否是关联类型
  }

  componentWillMount () {

    // eslint-disable-next-line no-undef
    const { top, height } = wx.getMenuButtonBoundingClientRect()
    // eslint-disable-next-line no-undef
    const { statusBarHeight, platform } = wx.getSystemInfoSync()
    console.log(top, height,statusBarHeight,platform,9632145)
    let navigationBarHeight;
    if (top && top !== 0 && height && height !== 0) {
      navigationBarHeight = (top - statusBarHeight) * 2 + height
    } else {
    if(platform === 'android'){
      navigationBarHeight = 48;
    }else{
      navigationBarHeight = 40;
    }
  }
  this.setState({
     statusBarHeight:statusBarHeight,
     barHeight:navigationBarHeight,
  })

  }

  componentDidMount() {
    const $instance = Taro.getCurrentInstance()
    this.setState({option:$instance.router.params.data ? JSON.parse($instance.router.params.data) : [],isType:$instance.router.params.type === '1'})
   // console.log(this.$router.params.data)


  }

  
 
  handleChange (value) {
    console.log(value)
    this.setState({
      value
    })
    const item = this.state.option.filter(i => i.value === value)
    if(this.state.isType){

      Taro.setStorageSync('typeId', JSON.stringify(item[0]));
    } else {
      Taro.setStorageSync('tagId', JSON.stringify(item[0]));
    }
    Taro.redirectTo({
      url: `/pages/index/publishService?hasChoose=1`
    })
  }



  render() {
    const {option,barHeight,  statusBarHeight} = this.state
    return (
      <View className='Association PickSingle'>
        <View className='navbar' style={{paddingTop:statusBarHeight+"px",lineHeight:barHeight+"px"}}>
          <View className='icon' onClick={() => Taro.redirectTo({url: `/pages/index/publishService?hasChoose=1`})}><AtIcon value='chevron-left' size='26' color='#fff'></AtIcon></View>
          <View className='title' >关联类型</View>

        </View>
        <View  style={{paddingTop:statusBarHeight+barHeight+"px"}}>
          <AtRadio
            options={option}
            value={this.state.value}
            onClick={this.handleChange.bind(this)}
          />
        </View>
      </View>
    )
  }
}
