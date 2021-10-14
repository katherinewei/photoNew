import { Component } from 'react'
import 'taro-ui/dist/style/index.scss'
//@import "~taro-ui/dist/style/components/icon.scss";
//@import "~taro-ui/dist/style/components/fab.scss";
import './app.scss'
import './custom-variables.scss'
import './icon.scss'

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
