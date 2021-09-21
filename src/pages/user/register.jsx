import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './register.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtSteps, AtInput ,AtButton,AtActivityIndicator,AtImagePicker } from "taro-ui"
import '../../components/common.scss'
export default class Register extends Component {

    config = {
        navigationBarTitleText: '注册',
        navigationBarBackgroundColor: '#fff',
    }



    constructor () {
      super(...arguments)
      this.state = {
        current: 0,
      }
    }


    componentWillMount () {

    }

    componentDidMount () {


    }


    onChange (current) {
      this.setState({
        current
      })
    }



    render () {
      const items = [
        { 'title': '个人信息' },
        { 'title': '器材信息' },
        { 'title': '签约选择' }
      ]
      const {} = this.state
        return (
            <View className='register'>
                <AtSteps
                  items={items}
                  current={this.state.current}
                  onChange={this.onChange.bind(this)}
                />
                <View className="foot">
                  <AtButton size="small" type="primary" circle  onClick={() => this.onChange()}>下一步</AtButton>
                </View>
          </View>
        )
    }
}
