// src/components/Navbar/index

import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
class Navbar extends Taro.Component {

  render() {
    const style = {
      paddingTop: 100 + 'px'
    }
    console.log(Taro.$navBarMarginTop,878 )
    // 将状态栏的区域空余出来
    return (
      <View className='navbarWrap' style={style}>
        <View className='navbar'>3434</View>
      </View>
    );
  }
}
export default Navbar

