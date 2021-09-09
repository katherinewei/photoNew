import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import {
  timeString,
  setAccessToken,
  getImageUrl,
  setUserId,
  getToken,
  setUserInfo,
  validateLogin
} from '../../utils/help'
import { ImageUrl } from '../../config'
import './index.scss'
import {
  AtButton ,
  AtIcon,
  AtFab,
  AtTabBar,
  AtAvatar,
  AtSearchBar,
  AtInput,
  AtActivityIndicator,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtRadio,
  AtFloatLayout 
} from 'taro-ui'
import NavBar from '../../components/Navbar/index'
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    usingComponents: {
      'navbar': '../../components/Navbar/index', // 书写第三方组件的相对路径
    },
  }

  componentWillMount() {
    // let areas = [[],[]]
    // Area[0].children.map(province => {
    //   areas[0].push(province.value)
    // })
    // areas[1].push(Area[0].children[0].children[0].value)

    this.setState({
      loading: true,
      current: 1,
      subCur:1,
      value: '',
      records: [{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'},{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'},{imgPath:require( '../../images/icon/picture.png'),label:'长沙约拍 | 我的这个夏天被偷走了被偷走了'}],
      currentSearch: {},
      visible:false,
      tabs:[
       { label:'写真约拍',value:1,list:[{value:1,label:'个人写真'},{value:2,label:'情侣写真'},{value:3,label:'证件形象'},{value:4,label:'儿童写真'},{value:5,label:'汉服古风'},{value:6,label:'Cosplay'},{value:7,label:'毕业照'},{value:8,label:'全家福'}]},
       { label:'婚纱摄影',value:2,list:[{value:1,label:'婚纱写真'},{value:2,label:'婚纱旅拍'},{value:3,label:'登记跟拍'},{value:4,label:'婚礼现场'}]},
       { label:'商务公关',value:3,list:[{value:1,label:'公关活动'},{value:2,label:'赛事记录'},{value:3,label:'会议论坛'},{value:4,label:'工程开发记录'}]},
       { label:'商业广告',value:4,list:[{value:1,label:'产品广告'},{value:2,label:'空间建筑'},{value:3,label:'美食静场'}]}

      ]  
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {
    getToken(() => this.fetchData(), true)

  }

  getPhoneNumber(e) {
    
  }


  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  fetchyzlist(query, value) {
    

    // 验真列表
    Request(
      {
        url: 'photo-index',
        method: 'GET',
        data,
        //isToken:false
      },
      (data) => {
        this.setState({ ...data.data, loading: false })
      },
    )
  }


  onChange(value) {
    this.setState({
      value: value,
    })
  }



  //上拉刷新
  onScrollToLower() {
    const { pages, current, records, currentSearch } = this.state

    if (pages > current) {
      Request(
        {
          url: 'photo-index',
          method: 'GET',
          data: { page: current + 1, ...currentSearch },
          //isToken:false
        },
        (data) => {
          data.data.records = [...records, ...data.data.records]
          console.log(data)
          this.setState({ ...data.data })
        },
      )
    }
  }

  handleClick(value,hide){
    
    this.setState({subCur:value })
    if(hide){
      this.setState({visible:!this.state.visible })
    }
  }

  changeTab(value){
    this.setState({current:value,subCur:1 })
  }
  expand(){
    this.setState({visible:!this.state.visible })
    
  }



  render() {
   
  
    const {
      records,
      loading,
      tabs,
      user,
      current,
      subCur,
      visible
      
    } = this.state

    return (
      <View className="index">
         <View className='menu'>
          <View className='tab'>
          <View className='p20 at-row '>
          {tabs.map((item,i) => (
            <View onClick={() => this.changeTab(item.value)}  className={item.value === current ? 'active at-col' : 'at-col'}><text>{item.label}</text></View>
          ))}
          </View></View>
          <View className='fixed'></View>
          <View className="container p20">
            <View className='content '>
              <View className="title">
                {tabs[current-1].list.map((item,i) => (
                  <View onClick={() => this.handleClick(item.value)}  className={item.value === subCur ? 'active sub' : 'sub'}><text>{item.label}</text></View>
                ))}
              {current === 1 &&   <View  className='expand' onClick={() => this.expand()}></View>}
              </View>
              <View className="subContent">
                <View className="h3">· 服务流程是怎么样的？</View>
                <View className="p">
                <text>
                  确认下单- -&gt;支付定金- -&gt;客服回电确认信息- -&gt;确定摄影师- -&gt;享受拍摄服务- -&gt;支付尾款- -&gt;收到成片 \n \n

                  关于我的资金安全? \n
                  在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。\n \n

                  拍摄需要提前多久预定? \n
                  目前可支持预约1天后的拍摄服务，如遇拍摄旺季请您最好提前 \n
                  15天到30天以上预定，以免耽误您的拍摄 \n
                </text>
              </View>
            </View>
          
            <AtButton type='primary' size='small' className="book">预约摄影师</AtButton>
          
            </View>
          </View>
        </View>
        <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={0}
              style={{height: (Taro.getSystemInfoSync().windowHeight) - 120 +  'px'}}
              lowerThreshold={20}
              upperThreshold={20}
              onScrollToLower={this.onScrollToLower.bind(this)}
               >
               <View className="list">
                {records && records.length > 0 ? (
                  records.map((item, i) => (
                    <View className="item">
                      <View
                        onClick={() => {
                         
                            Taro.navigateTo({
                              url: `/pages/index/serviceDetail?id=${item.id}&price=${item.price}&isPhotographer=1`,
                            })
                          
                        }
                        }
                      >
                        <View className="image">
                          
                          <View className="img">
                            <Image
                              mode="widthFix"
                              src={(item.imgPath)}
                            ></Image>
                           
                          </View>
                          <View className="text">{item.label}</View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="noData" style={{ marginTop: '110px' }}>
                    <Image
                      mode="widthFix"
                      src={require('../../images/icon/noData.png')}
                    ></Image>
                    <View>暂无数据</View>
                  </View>
                )}
              </View>
        </ScrollView>
     
        <View className={(visible ? 'show ' : '' ) +"moreType"}>
          <View className="body">
              <View className="h4">全部选项<AtIcon value='close' size='20' color='#F6F6F6' onClick={() => this.expand()}></AtIcon></View>
              <View className="types"> {tabs[0].list.map((item,i) => (
                 <View onClick={() => this.handleClick(item.value,true)}  className={item.value === subCur ? 'active subExpand' : 'subExpand'}><text>{item.label}</text></View>
              ))}</View>
              </View>
        </View>
     
      </View>
    )
  }
}
