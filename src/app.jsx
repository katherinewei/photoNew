import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import Request from './utils/request'
import { setAccessToken } from './utils/help'
import './app.scss'
import 'taro-ui/dist/style/index.scss'
//@import "~taro-ui/dist/style/components/icon.scss";
//@import "~taro-ui/dist/style/components/fab.scss";
import './custom-variables.scss'
import './icon.scss'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: [

      'pages/user/index',
      'pages/order/confirmOrder', 
      'pages/order/evaluation', 
      'pages/order/orderDeatil', 
      
      'pages/order/index',
      'pages/index/publishService',
      'pages/index/associationType',
      'pages/order/photographer',
      'pages/index/index',
     
      
      
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#5299FB',
      navigationBarTitleText: '拍好照',
      navigationBarTextStyle: 'black',
     // navigationStyle:'custom'
    },
    tabBar: {
      selectedColor:'#5299FB',
      list: [
        {
          pagePath: "pages/index/index",
          selectedIconPath: "./images/icon/tab1_active.png",  
          iconPath:"./images/icon/tab1.png",
          text: "首页",
        },  
        {
          pagePath: "pages/order/index",
          selectedIconPath: "./images/icon/tab2_active.png",  
          iconPath:"./images/icon/tab2.png",
          text: "订单"
        },
       
       
        {
          pagePath: "pages/user/index",
          selectedIconPath: "./images/icon/tab3_active.png",  
          iconPath:"./images/icon/tab3.png",
          text: "我的"
        }
    
      ]
     },
  }
  constructor(props) {
    super(props)
    const that = this

    // app.js
    Taro.getSystemInfo({})
    .then(res  => {
      Taro.$navBarMarginTop =  res.statusBarHeight || 0
    })
    // 将状态栏高度挂载全局
  }

  componentWillMount() {}

  componentDidMount() {
    
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />
  }
}

Taro.render(<App />, document.getElementById('app'))
