import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import './publishService.scss'
import {
  AtRadio 
} from 'taro-ui'
import { ImageUrl } from '../../config'
import { typeS } from '../../utils/help'

export default class publishService extends Component {
  config = {
    navigationBarTitleText: '关联类型',
    navigationBarBackgroundColor: '#fff',
  }

  state = {
    value: '',
    option: [], 
    isType:true  // 是否是关联类型
  }

  componentDidMount() {
    this.setState({option:this.$router.params.data ? JSON.parse(this.$router.params.data) : [],isType:this.$router.params.type === '1'})
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
      <View className="Association">
        <AtRadio
        options={option}
        value={this.state.value}
        onClick={this.handleChange.bind(this)}
      />
      </View>
    )
  }
}
