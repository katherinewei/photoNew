import Taro from '@tarojs/taro'
import { Component } from 'react'
import { WebView } from '@tarojs/components'

export default class MyPhoto extends Component {
    constructor () {
      super(...arguments)
      
    }
    render () {
      const $instance = Taro.getCurrentInstance()
        return (
          <WebView src={$instance.router.params.url}  />
        )
    }
}
