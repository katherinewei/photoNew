import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../utils/request'

import { AtButton, AtTabBar } from 'taro-ui'
import {
  validateLogin
} from '../utils/help'
const href = ['index', 'want', 'publish', 'message', 'user']

import tab1 from '../images/icon/tab1.png'
import tab1A from '../images/icon/tab1_active.png'
import tab2 from '../images/icon/tab2.png'
import tab2A from '../images/icon/tab2_active.png'
import tab3 from '../images/icon/tab3.png'
import tab3A from '../images/icon/tab3_active.png'
import tab4 from '../images/icon/tab4.png'
import tab4A from '../images/icon/tab4_active.png'
import publishIcon from '../images/icon/publish.png'

export default class Tabs extends Component {
  constructor(props) {
    super(props)

    this.setState({ current: props.current })
  }

  handleClick(value) {
    // this.setState({
    //     current: value
    //   })

    //  if(value !== 0){
      if(validateLogin()){
        Taro.redirectTo({
          url: `/pages/${href[value]}/index`,
        })
      }
   
    //  }
  }

  render() {
    return (
      <AtTabBar
        fixed
        tabList={[
          { title: '首页', image: tab1, selectedImage: tab1A },
          { title: '想拍', image: tab2, selectedImage: tab2A },
          { title: '', image: publishIcon, iconSize: 78 },
          { title: '消息', image: tab3, selectedImage: tab3A },
          { title: '我的', image: tab4, selectedImage: tab4A },
        ]}
        onClick={this.handleClick.bind(this)}
        current={this.state.current}
      />
    )
  }
}
