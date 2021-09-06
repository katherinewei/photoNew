import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request'
import { getImageUrl } from '../../utils/help'
import './detail.scss'
import {
  AtButton,
  AtIcon,
  AtFab,
  AtTabBar,
  AtAvatar,
  AtSearchBar,
  AtInput,
  AtCurtain,
} from 'taro-ui'
import Share from '../../components/share'

export default class reportDetail extends Component {
  config = {
    navigationBarTitleText: '验真报告详情',
  }

  componentWillMount() {
    this.state = {}
  }

  componentDidMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })

    //
    Request(
      {
        url: 'photo-speech',
        method: 'PUT',
        data: {
          //  code: res.code
          id: this.$router.params.id, //todo
        },
      },
      (data) => {
        let dataN = data.data
        if (dataN.imgPath) {
          dataN.imgPath = dataN.imgPath.split(',')
        }else {
          dataN.imgPath = []
        }

        this.setState({ data: dataN })
      },
    )
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage(res) {
    //放在父组件上执行，子组件上不被执行！
    const { data } = this.state
    console.log(data)
    if (data) {
      return {
        title: '拍好照：验真报告',
        path: `/pages/index/index`,
        imageUrl: data.imgPath.length > 0 ? getImageUrl(data.imgPath[0]) : '',
      }
    }
  }

  render() {
    const { data } = this.state
    const { name, area, headPic } = this.$router.params

    return (
      <View className="detail">
        <View className="head">
          <View className="info">
            <View className="info1">
              <Image src={getImageUrl(headPic)}></Image>
              <View>
                <Text>{name}</Text>
                {area}
              </View>
            </View>
          </View>
        </View>

        <View className="content">
          <View className="imgs" style={{ marginBottom: '25px' }}>
            {data &&
              data.imgPath.length > 0 &&
              data.imgPath.map((item, i) => (
                <Image
                  src={getImageUrl(item)}
                  mode="widthFix"
                  style={{ marginBottom: '5px' }}
                ></Image>
              ))}
            {data && data.comment}
          </View>

          <Share />
        </View>
      </View>
    )
  }
}
