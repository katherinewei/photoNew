import { Component } from 'react'
import { WebView } from '@tarojs/components'

export default class MyPhoto extends Component {
    constructor () {
      super(...arguments)
      
    }
    render () {
        return (
          <WebView src='https://www.hotxiezhen.com/safeRule.html'  />
        )
    }
}
