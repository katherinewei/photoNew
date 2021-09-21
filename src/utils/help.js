import Taro from '@tarojs/taro';
import { ImageUrl } from '../config';
const ACCESS_TOKEN_KEY = 'access_token';
import Request from './request'

// js获取url指定参数值
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

//获取token
export function getAccessToken() {
  const token = Taro.getStorageSync(ACCESS_TOKEN_KEY);
  return token;
}



//设置token
export function setAccessToken(token) {
  Taro.setStorageSync(ACCESS_TOKEN_KEY, token);
}


// 保存userid
export function setUserId(id){
  Taro.setStorageSync('userId', id);
}

// 获取userid
export function getUserId(){
  return Taro.getStorageSync('userId');
}

// 保存user
export function setUserInfo(user){
  Taro.setStorageSync('userInfo', JSON.stringify(user));
}

// 获取user
export function getUserInfo(){
  return JSON.parse(Taro.getStorageSync('userInfo'));
}



export function getImageUrl(text) {

  if(!text){
    return "";
  }
  if(text.startsWith('http')){
    return text
  }


  return ImageUrl + text;
}

export function getPrice(price,hideF) {
  if(price == undefined) {
    return 0.00;
  }
  return hideF ? '' : '￥'+(parseFloat(price) / 100).toFixed(2);
}

/**
 * 时间格式化
 * @param time
 */
export function timeString(time,notZ) {
  //console.log(time);

  let date = notZ ? time : new Date(time);
  //console.log(date.Format('yyyy-MM-dd h:m:s'));
  //return date.toLocaleString('zh-CN', {hour12: false})
  return date.Format('yyyy-MM-dd')
}

/**
 * 时间格式
 */
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};



export const typeS = ['写真','旅拍','儿童','婚纱','毕业照','婚礼','活动','商业广告','家庭摄影'];


// 获取token
export function getToken(callback,isIndex){
  console.log(isIndex)
  
  if(!getAccessToken() || isIndex){
   // const code = Taro.getStorageSync('userId')
    const code = null;
    Taro.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
  
          let data = {}
          let url =  'api/wxLogin'
          let method = 'post'
          if(code){
            data.id = code;
            url =  'testLogin'
            method = 'get'
          } else {
            data.code = res.code
          }
  
  
          const login = () => {
            Request({
            //  url: 'wxLogin',
              //method: 'post',
              url,
              method,
  
              data,
              isToken:false
            },(data) => {
          
            if(code){
              setAccessToken(data.data)
            } else {
              setAccessToken(data.data.token)
            }
             

  
             callback()
  
            })
          }
  
          login()
  
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  
  } else {
    callback()
  }
}

// 未微信授权跳到授权页面
export function validateLogin(){
  const user = getUserInfo();
  if((!user.wxName || user.wxName == '') && (!user.head_pic || user.head_pic == '')){
    Taro.redirectTo({url: '/pages/index/login'})
    return false
  }
  return true
}