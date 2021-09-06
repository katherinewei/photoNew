import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../utils/request'
import { AtButton, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import './share.scss'

export default class Share extends Component {
  constructor(props) {
    super(props)

    this.setState({ isOpened: props.isOpened })

    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }

  componentWillReceiveProps(nextprops) {
    this.setState({ isOpened: nextprops.isOpened })
  }

  handleClick(value) {
    // this.setState({
    //     current: value
    //   })

    //  if(value !== 0){
    Taro.redirectTo({
      url: `/pages/${href[value]}/index`,
    })
    //  }
  }
  handleCancel() {
    console.log(23232)
    // this.props.isOpened = false
    // this.setState({isOpened:false})

    //  this.props.callback()
  }

  render() {
    return (
      <div>
        {/* <AtActionSheet isOpened={this.state.isOpened} cancelText='取消' title='请选择分享方式' onCancel={ () => this.handleCancel() } onClose={ () => this.handleCancel() }> */}

        <button
          open-type="share"
          style="background-color: #1E1E1E;border: none; color: #fff;"
          onClick={() => this.handleCancel()}
          class={`shareButton ${this.props.title ? 'sharePover' : ''} ${
            this.props.className
          }`}
        >
          {this.props.title
            ? this.props.title
            : this.props.className
            ? '分享'
            : '分享好友'}
        </button>

        {/* <AtActionSheetItem onClick={() => Taro.navigateTo({url: `/pages/publish/share${this.props.count ? '?count=1':''}`})}>
                分享朋友圈
            </AtActionSheetItem>  
            </AtActionSheet> */}
      </div>
    )
  }
}
