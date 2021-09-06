import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import { AtButton }  from 'taro-ui'
import './index.scss'
import success from '../../images/icon/success.png'

export default class Index extends Component {

    config = {
        navigationBarTitleText: ''
    }

    constructor () {
      super(...arguments)
      this.state = {
        current: 0
      }
    }
    handleClick (value) {
      this.setState({
        current: value
      }) 
    }
    render () {
      return (
        <View className="success">
            <Image src={success} mode="widthFix" lazy-load={true}></Image>
            <View className="title">约拍验真指南</View>
              <View className="content">
                <View className="q">Q：如何获得报酬？</View>
                <View className="a">A：完成每次摄影约拍验真后，摄影师与您结清报酬。</View>
                <View className="q">Q：什么是约拍验真？</View>
                <View className="a">A：就是您的真实体验感觉，比如服务发布是否所言属实，拍摄是否顺利等等。</View>
                <View className="q">Q：拍摄过后的样片属于谁？</View>
                <View className="a">A：参与约拍验真，则视为授权同意平台与摄影师有自由使用您的样片的权利，创作版权属于摄影师，肖像权仍为您所有，您只是授权同意我们在样片范围内合理使用您的肖像。摄影师使用您的肖像合法合理进行创作，不得对肖像进行侮辱，丑化等侵害肖像权的行为！</View>
                <View className="q">Q：验真官和样片模特有什么区别？</View>
                <View className="a">A：样片模特仅仅参与摄影师样片拍摄，以最终产出精美样片供摄影师对外营销为目的。验真官每一次都是实实在在以客户角度体验服务，能为其他小伙伴的网约摄影提供给一定参考价值。验真官的体检报告可以从质量和安全两方面为大家真实试水。因此，希望您认真对待和完成每一次被邀请的验真。</View>

                <AtButton type='primary' onClick={() =>   Taro.redirectTo({  url: '/pages/index/index'})}>我已清楚，马上体验</AtButton>
              </View>

        </View>
      )
    }
}
