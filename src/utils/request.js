import Taro from '@tarojs/taro'
import { baseUrl, noConsole } from '../config'
import {
  setAccessToken,
  getAccessToken,
  GetQueryString,
  getToken,
} from '../utils/help'

export default (options = { method: 'GET', data: {} }, resolve) => {
  if (!noConsole) {
    // console.log(
    //   `${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(
    //     options.data
    //   )}`
    // );
  }

  let token = getAccessToken()

  //console.log(token)

  //setAccessToken(token)
  // let token = getAccessToken();
  // if (!token) {
  //   token = GetQueryString('token');
  // }
  let header = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (options.isToken === undefined || options.isToken) {
    header.token = `${token}`
  }
  let url = options.url
  if (!url.startsWith('http')) {
    url = baseUrl + options.url
  }

  return Taro.request({
    url,
    data: {
      //...request_data,
      ...options.data,
    },
    header,
    method: options.method.toUpperCase(),
  }).then((res) => {
    const { statusCode, data } = res

    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        // console.log(
        //   `${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`,
        //   res.data
        // );
      }

      if (data.code === 501) {
        //token失效
        setTimeout(() => {
          console.log(data, 9999)
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1000)
        return false
      }

      if (!options.isMap && data.code !== 200) {
        Taro.showToast({
          title: `${data.msg}~`,
          icon: 'none',
          mask: true,
        })
        return false
      }
      // console.log(data)
      resolve(data)
      // return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`)
    }
  })
}
