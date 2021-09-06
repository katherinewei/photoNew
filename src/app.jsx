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
      'pages/index/login',
      'pages/index/newPhotographer', 
      'pages/index/serviceDetail',
      'pages/index/reportDetail',
      
      'pages/index/complaints',
      'pages/want/index',
      'pages/message/index',
      'pages/message/detail',
      'pages/publish/index',
      'pages/publish/publishList',
      'pages/publish/publishService',
      'pages/publish/orderPhoto',
      'pages/publish/publishTruth',
      'pages/publish/publishReport',
      'pages/verification/success',
      'pages/publish/verificatePhotographer',
      'pages/publish/verificateChecker',
      'pages/publish/share',
      'pages/publish/appointApplication',
      'pages/publish/agreement',
      'pages/verification/shareImg',
      'pages/user/index',
      'pages/user/Info',
      'pages/user/editDesc',
      'pages/user/editName',
      'pages/user/appointmentDetail',
      'pages/user/applicationList',
      'pages/user/appointmentList',
      'pages/user/applicationDetail',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '拍好照',
      navigationBarTextStyle: 'black',
    },
    // tabBar: {
    //   list: [
    //     {
    //       pagePath: "pages/index/index",
    //       text: "首页"
    //     },
    //     {
    //       pagePath: "pages/want/index",
    //       text: "想拍"
    //     },
    //     {
    //       pagePath: "pages/publish/index",
    //       text: ""
    //     },
    //     {
    //       pagePath: "pages/message/index",
    //       text: "消息"
    //     },
    //     {
    //       pagePath: "pages/user/index",
    //       text: "我的"
    //     }
    //
    //   ]
    //  },
  }
  constructor(props) {
    super(props)
    const that = this
  }

  componentWillMount() {}

  componentDidMount() {}

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
