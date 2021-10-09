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
import { mapKey } from '../../config'
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
    navigationStyle: 'custom',
  }

  componentWillMount() {
    // let areas = [[],[]]
    // Area[0].children.map(province => {
    //   areas[0].push(province.value)
    // })
    // areas[1].push(Area[0].children[0].children[0].value)

    const { top, height } = wx.getMenuButtonBoundingClientRect()
    const { statusBarHeight, platform } = wx.getSystemInfoSync()
  //  console.log(top, height,statusBarHeight,platform,9632145)
    let navigationBarHeight;
    if (top && top !== 0 && height && height !== 0) {
      navigationBarHeight = (top - statusBarHeight) * 2 + height
    } else {
    if(platform === 'android'){
      navigationBarHeight = 48;
    }else{
      navigationBarHeight = 40;
    }
  }


    this.setState({
      loading: true,
      currentId: 1,  // 一级id
      subCur:0,  // 二级index
      value: '',
      visible:false,
      index:0,// 一级index
      tabs:[ ],
      statusBarHeight:statusBarHeight,
      barHeight:navigationBarHeight,
      city:'',
      province:'',
      typeBarHeight:''  ,
      containerHeight:'',
      pages:1, current:1, records:[]
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {
    
    getToken(() => {}, true)
    this.getLocation()
    


    ///创建节点选择器
        var query = wx.createSelectorQuery();
        var c = wx.createSelectorQuery();
        //选择id
        query.select('.tab').boundingClientRect()
        query.exec((res) => {
            //res就是 所有标签为mjltest的元素的信息 的数组
            // console.log(res);
            // //取高度
            // console.log(res[0].height,987878787);
            this.setState({typeBarHeight:res[0].height})
        })

        //container
        c.select('.container').boundingClientRect()
        c.exec((res) => {
            //res就是 所有标签为mjltest的元素的信息 的数组
            // console.log(res);
            // //取高度
             console.log(res[0].height,987878787);
            this.setState({containerHeight:res[0].height})
        })
  }

  fetchCate(){
    // 品类
    Request(
      {
        url: 'api/category',
        method: 'GET',
        //isToken:false
      },
      (res) => {
      //  console.log(res.data,11110000)
        this.setState({ tabs:res.data,currentId:res.data[0].id },() => {
          // 获取返片
         
          this.fetchNotePage()
        })
      },
    )
  }



  getPhoneNumber(e) {
    
  }


  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  fetchNotePage(query, value) {
    
    const {current,currentId,province,city,tabs,subCur,index} = this.state
    
    const data = {page:current,typeId:currentId,tagId:tabs[index].child[subCur].id,province:encodeURI(province),city:encodeURI(city)}
    
    // 获取返片列表
    Request(
      {
        url: 'api/notePage',
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
    const { pages, current, records } = this.state

    if (pages > current) {
      Request(
        {
          url: 'api/notePage',
          method: 'GET',
          data: { page: current + 1,typeId:currentId },
          //isToken:false
        },
        (data) => {
          data.data.records = [...records, ...data.data.records]
         // console.log(data)
          this.setState({ ...data.data })
        },
      )
    }
  }

  handleClick(value,hide){
    
    this.setState({subCur:value },() => {
      // 获取返片
      this.fetchNotePage()
    })
    if(hide){
      this.setState({visible:!this.state.visible })
    }
    
  }

  changeTab(item,index){
    this.setState({currentId:item.id,subCur:0,index },() => {
      // 获取返片
      this.fetchNotePage()
    })

  }
  expand(){
    this.setState({visible:!this.state.visible })
    
  }

  getLocation(){
      Taro.getLocation().then(res => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        Request(
          {
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${mapKey}`,
            method: 'GET',
            isMap:true
            //isToken:false
          },
          (data) => {
          console.log(data.result.address_component,222)
          const address  = data.result.address_component;

            this.setState({city:address.city,province:address.province },() => {this.fetchCate()})

            const addr = [address.nation,address.province,address.city,address.district]
            Taro.setStorageSync('curAddr', JSON.stringify(addr))   // 保存地址
            
          },
        )
    })

  }





  render() {
   
  
    const {
      records,
      loading,
      tabs,
      user,
      currentId,
      subCur,
      visible,
      city,
      barHeight,
      statusBarHeight,
      typeBarHeight,
      containerHeight,
      index
      
    } = this.state

    // console.log(tabs[index].child,index)
    return (
      <View className="index">
        <View className='navbar' style={{paddingTop:statusBarHeight+"px",lineHeight:barHeight+"px"}}>
          <View className="addr">{city}</View>
          <View className="service" onClick={() => Taro.navigateTo({url: `/pages/index/publishService`})}>分享返片,获取创作模特资格</View>

        </View>
         <View className='menu'>
          <View className='tab' style={{top:barHeight +statusBarHeight +"px"}}>
          <View className='p20 at-row '>
          {tabs && tabs.map((item,i) => (
            <View onClick={() => this.changeTab(item,i)}  className={i === index ? 'active at-col' : 'at-col'}><text>{item.dictVal}</text></View>
          ))}
          </View></View>
          <View className='fixed' style={{height:(typeBarHeight + barHeight + statusBarHeight) +"px"}}></View>
          <View className="container p20">
            <View className='content '>
              <View className="title">
                {tabs[index] && tabs[index].child && tabs[index].child.map((item,i) => (
                  <View onClick={() => this.handleClick(i)}  className={i === subCur ? 'active sub' : 'sub'}><text>{item.dictVal}</text></View>
                ))}
              {index === 0 &&   <View  className='expand' onClick={() => this.expand()}></View>}
              </View>
              <View className="subContent">
                <View className="h3">· 服务流程是怎么样的？</View>
                <View className="p">
                <text>
                  确认下单- -&gt;支付定金- -&gt;客服回电确认信息- -&gt;确定摄影师- -&gt;享受拍摄服务- -&gt;支付尾款- -&gt;收到成片 \n \n

                  关于我的资金安全? \n
                  在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。\n \n

                  拍摄需要提前多久预定? \n
                  目前可支持预约1天后的拍摄服务，如遇拍摄旺季请您最好提前15天到30天以上预定，以免耽误您的拍摄 \n
                </text>
              </View>
            </View>
          
            <AtButton type='primary' size='small' className="book" onClick={() => Taro.navigateTo({url: `/pages/index/bookPhotographer`})} >预约摄影师</AtButton>
          
            </View>
          </View>
        </View>
        <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={0}
              style={{height: (Taro.getSystemInfoSync().windowHeight) - containerHeight - typeBarHeight - barHeight - statusBarHeight +  'px'}}
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
                         
                            // Taro.navigateTo({
                            //   url: `/pages/index/serviceDetail?id=${item.id}&price=${item.price}&isPhotographer=1`,
                            // })
                          
                        }
                        }
                      >
                        <View className="image">
                          
                          <View className="img">
                            <Image
                              mode="widthFix"
                              src={(item.imgUrl)}
                            ></Image>
                           
                          </View>
                          <View className="text">{item.title}</View>
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
     
        {visible && <View className={(visible ? 'show ' : '' ) +"moreType"}>
          <View className="body">
              <View className="h4">全部选项<AtIcon value='close' size='20' color='#F6F6F6' onClick={() => this.expand()}></AtIcon></View>
              <View className="types"> {tabs[0].child && tabs[0].child.map((item,i) => (
                 <View onClick={() => this.handleClick(i,true)}  className={item.value === subCur ? 'active subExpand' : 'subExpand'}><text>{item.dictVal}</text></View>
              ))}</View>
              </View>
        </View>}
     
         <View  className="recruitmentBtn">
         <Text   onClick={() => Taro.navigateTo({url: `/pages/user/recruitment`})} >招募 \n 摄影师</Text>
          
          </View>       
      </View>
    )
  }
}
