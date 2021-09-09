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
    type1:['写真约拍','婚纱摄影','商务公关','商业广告'],
    type2:['个人写真','情侣写真','证件形象','汉服古风','儿童写真','cosplay','毕业照','全家福'],
    option:[],
    isType:true // 是否是关联类型
  }

  componentDidMount() {

    const {type1,type2} = this.state
    const isType = this.$router.params.type === '1' 
   
    const type =  isType ? type1 : type2
    const option = type.map((item,i) => {return {label:item,value:i}})
    this.setState({isType,option})

  }

  
 
  handleChange (value) {
    console.log(value)
    this.setState({
      value
    })
    if(this.state.isType){
      Taro.setStorageSync('typeId', value);
    } else {
      Taro.setStorageSync('tagId', value);
    }
    Taro.redirectTo({
      url: `/pages/index/publishService`
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
