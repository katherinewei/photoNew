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
      'pages/index/index',
      'pages/index/detail', 
      'pages/index/bookPhotographer',
      'pages/index/picker',    
      'pages/index/associationType', 
      'pages/index/publishService', 
      'pages/order/index',
      'pages/order/photographer',
      'pages/order/evaluation',
      'pages/order/confirmOrder',    
      'pages/order/orderDeatil', 
      'pages/user/index',
      'pages/user/detail',
      'pages/user/myPhoto',
      'pages/user/recruitment',
      'pages/user/feedback', 
      'pages/user/registerFinish',
      'pages/user/myEvaluation',
      'pages/user/evaluateDetail', 
      'pages/user/register',
      'pages/user/recharge',
      'pages/user/record',
    ],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
      }
    },
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
