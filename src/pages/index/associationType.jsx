import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View} from '@tarojs/components'
import {
  AtRadio 
} from 'taro-ui'
import './publishService.scss'



export default class AssociationType extends Component {
 

  state = {
    value: '',
    option: [], 
    isType:true  // 是否是关联类型
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
    const {option} = this.state
    return (
      <View className='Association'>
        <AtRadio
          options={option}
          value={this.state.value}
          onClick={this.handleChange.bind(this)}
        />
      </View>
    )
  }
}
