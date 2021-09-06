import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import './index.scss'
import {
  AtList,
  AtListItem,
  AtImagePicker,
  AtTextarea,
  AtButton,
} from 'taro-ui'
import Share from '../../components/share'
import { ImageUrl } from '../../config'

export default class ShareComponent extends Component {
  config = {
    navigationBarTitleText: '分享',
  }

  state = {
    files: [],
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onChangeFile(files, operationType) {
    if (operationType === 'remove') {
      this.setState({
        files,
      })
    }

    // console.log(files)
    //  this.setState({
    //    files
    //  })
    if (operationType === 'add') {
      files.map((item, i) => {
        if (!item.url.startsWith(ImageUrl)) {
          const file = item
          console.log(file)
          this.setState({
            //files
            loading: true,
          })
          const that = this
          Taro.uploadFile({
            url: ImageUrl + '/wx/client/img',
            filePath: file.url,
            name: 'file',
            formData: {
              file: files,
            },
            header: {
              //  Authorization : getAccessToken(),
              'Content-Type': 'multipart/form-data',
              accept: 'application/json',
            },
            success(res) {
              const data = JSON.parse(res.data)
              files[i].url = data.path

              that.setState({
                files,
                loading: false,
              })

              //do something
            },
            fail() {
              console.log(1111)
            },
          })
        }
      })
    }
  }

  onFail(mes) {
    console.log(mes)
  }
  onImageClick(index, file) {
    console.log(index, file)
  }

  onSubmit() {
    const count = this.$router.params.count
    if (count) {
      Request(
        {
          url: 'photo-share-to-report',
          method: 'POST',

          //isToken:false
        },
        (data) => {},
      )
    }

    let img = this.state.files.length > 0 ? this.state.files[0].url : ''
    Taro.navigateTo({
      url: `/pages/verification/shareImg?comment=${
        this.state.comment || ''
      }&img=${img}`,
    })
  }

  onShareAppMessage(res) {
    //放在父组件上执行，子组件上不被执行！
    const { files, comment } = this.state
    let title = '拍好照'
    if (comment) {
      title = title + '-' + comment
    }
    Request(
      {
        url: 'photo-share-to-report',
        method: 'POST',

        //isToken:false
      },
      (data) => {},
    )

    return {
      title,
      path: `/pages/index/index`,
      imageUrl: files.length > 0 && files[0].url,
    }
  }

  render() {
    return (
      <View className="publishService">
        <View className="title">创建分享封面</View>
        <View className="desc" style={{ marginBottom: '30rpx' }}>
          分享图文，获得更多小伙伴
        </View>

        <AtTextarea
          maxLength={300}
          placeholder="请输入您想说的话..."
          value={this.state.comment}
          onChange={(e) => {
            this.setState({ comment: e })
          }}
        />

        <View className="p" style={{ marginTop: '55rpx' }}>
          请选择一张图
        </View>

        <AtImagePicker
          files={this.state.files}
          onChange={this.onChangeFile.bind(this)}
          showAddBtn={this.state.files.length < 1}
        />
        <View style="height:55rpx"></View>
        {/* <View className="tip_share">生成封面-保存手机-发送朋友圈</View> */}
        {/* <AtButton type='primary' onClick={() => this.onSubmit()}>生成封面</AtButton> */}

        <Share />
      </View>
    )
  }
}
