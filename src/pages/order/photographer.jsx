import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker,ScrollView } from '@tarojs/components'
import Request from '../../utils/request'
import {
  timeString,
  setAccessToken,
  getImageUrl,
  typeS,
  setUserId,
  getToken,
  setUserInfo,
  validateLogin
} from '../../utils/help'
import { ImageUrl } from '../../config'
import './photographer.scss'
import {
  AtTabBar,AtIcon,AtButton,AtAvatar,AtFloatLayout,AtTabs, AtTabsPane

} from 'taro-ui'
import NavBar from '../../components/Navbar/index'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '摄影师详情',
    navigationBarTextStyle: 'white',
  }

  state = {
    current:0,
    top:0,
  }

  componentWillMount() {

    this.setState({})
  
  }

  componentDidMount() {
    
  }

 

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  scrollTopFun(e){
    console.log(e)
   // that.top = e.detail.scrollTop;
  }

  

  render() {

    const list = [{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'},{img:require('../../images/icon/photo.png'),name:'kk',title:'高级摄影师',price:'1000'}]
    const tabList = [{ title: '样片' }, { title: '评价' }]
    return (
      <View className="index" >
        <View className="contain">
        <View className="header" >
         
          <View className="bg" style={{backgroundImage:"url("+'http://orderplus-cloud.oss-cn-hongkong.aliyuncs.com/orderPlus/8c6fee9b9f954cefaca7eda286394c10.png'+")"}}></View>
          <View className="mask"></View>
          <View className="top">
            <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
            <View className="right">
              <View className="name">kk</View>
              <View className="i"><text>女</text><text>高级摄影师</text><text>从业12年</text><text>服务客户</text></View>
              <View className="o">诚信服务</View>
            </View>
          </View>
         
        </View>
        <View className="intro">
          <text>简介：</text>从业11年，擅长人像摄影，从业11年，擅长人像摄影， 从业11年，擅长人像摄影。
        </View>
        <View className="content intro">
          <View className="price">报价：<text>￥</text>1000.00</View>
          <View className="detail">
            <View className="price">套餐详情</View>
            <View className="con">
              <View><text>拍摄时长：</text>3小时</View>
              <View><text>服装造型：</text>1套</View>
              <View><text>底片数量：</text>120张</View>
              <View><text>精修加片：</text>25元/张</View>
              <View><text>精修成片：</text>12张</View>
              <View><text>最多人数：</text>1位</View>
            </View>
          </View>
        </View>


        <AtTabs className={top>130 ? 'topnav' : ''} current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0}>
            <View  className="images">
             <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
             <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
             <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
             <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
             <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
            </View>
            
           
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} className="evaluation">
            <View  className="evaluation">
              <View  className="title">用户评价(23)</View>
              <View className="box">
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                

                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                <View className="item">
                  <AtAvatar  circle  image={require('../../images/icon/photo.png')}   ></AtAvatar>
                  <View className="cRight">
                    <View className="n">kk</View>
                    <View className="t">2021-09-09</View>
                    <View className="c">很赞很赞很赞很赞很赞很赞很赞很赞很赞很赞，很赞很赞很赞很赞很赞很赞</View>
                    <View className="i">
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                      <Image src={require('../../images/icon/picture.png')} mode="widthFix"></Image>
                    </View>
                  </View>
                 
                </View>
                

              </View>
            </View>
          </AtTabsPane>
         
        </AtTabs>
        </View>
        <View className="foot">
          <AtButton size="small" type="primary" circle>选TA服务</AtButton>
      
        </View>
        
      </View>
    )
  }
}
