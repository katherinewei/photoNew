import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import { AtTabBar }  from 'taro-ui'
import './index.scss'
import msg from '../../images/icon/msg.png'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '消息详情'
    }

    constructor () {
      super(...arguments)






    }

    componentDidMount () {
      let {id} = this.$router.params
      Request({
        url: 'photo-message',
        method: 'put',
        data: {
            id
        },

      },(data) => {

          this.setState({detail:data.data})

      })

    }
    handleClick (value) {

    }
    render () {
      const {detail} = this.state;

      return (
        detail && <View className="detail">
          <View className="header">
            <View className="title">
              {detail.title}
            </View>
            <View className="time">
              {detail.date}
              <Text>{detail.time}</Text>
            </View>
          </View>
          <View className="content">
            {detail.message}
          </View>
        </View>
      )
    }
}
