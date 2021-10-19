export default {
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
    'pages/order/protocol',
    'pages/user/index',
    'pages/user/detail',
    'pages/user/myPhoto',
    'pages/user/feedback', 
    'pages/user/myEvaluation',
    'pages/user/evaluateDetail', 
    'pages/user/registerFinish',
    'pages/user/register',
    'pages/user/recruitment',
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
   // enablePullDownRefresh: true,
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
