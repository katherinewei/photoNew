import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import { AtButton, AtIcon, AtActivityIndicator} from 'taro-ui'
import Request from '../../utils/request'
import { getToken, setUserInfo} from '../../utils/help'
import { mapKey } from '../../config'
import Area from '../../components/area/area';
import './index.scss'


export default class Index extends Component {


  state={
    loading: true,
    currentId: 1,  // 一级id
    subCur:0,  // 二级index
    // eslint-disable-next-line react/no-unused-state
    value: '',
    visible:false,
    index:0,// 一级index
    tabs:[ ],
    city:'',
    province:'',
    typeBarHeight:''  ,
    // eslint-disable-next-line react/no-unused-state
   // containerHeight:'',
    pages:1, current:1, records:[],isOpenedArea:false
  }

  componentWillMount() {
    // let areas = [[],[]]
    // Area[0].children.map(province => {
    //   areas[0].push(province.value)
    // })
    // areas[1].push(Area[0].children[0].children[0].value)

    const { top, height } = wx.getMenuButtonBoundingClientRect()
    const { statusBarHeight, platform } = wx.getSystemInfoSync()
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
     
      statusBarHeight:statusBarHeight,
      barHeight:navigationBarHeight,
      
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {

    this.setState({loading:false})

    getToken(() => {

      // 获取个人信息
      Request({
        url: 'api/getUserInfo',
        method: 'post',
        data: {
        //  code: res.code
        //    id:10000
        },

      },(data) => {

        if(data.code === 200){
          setUserInfo(data.data)
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }

          
         
      })

    }, true)
    this.fetchCate()
    const that = this

    setTimeout(() => {
      Taro.createSelectorQuery().select('.tab').boundingClientRect(function(rect){
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度
    //  console.log(rect.height)
      that.setState({typeBarHeight:rect.height})
    }).exec()
    }, 100);
    

    // Taro.nextTick(async () => {
    //    ///创建节点选择器
    //    var query = Taro.createSelectorQuery();
    //   // var c = wx.createSelectorQuery();
    //    //选择id
    //    query.select('.tab').boundingClientRect()
    //    query.exec((res) => {
    //        //res就是 所有标签为mjltest的元素的信息 的数组
    //        // //取高度
    //         console.log(res[0].height,987878787);
    //        this.setState({typeBarHeight:res[0].height})
    //    })
 
 
    //    //container
    //    // c.select('.container').boundingClientRect()
    //    // c.exec((res) => {
    //    //     //res就是 所有标签为mjltest的元素的信息 的数组
    //    //     // console.log(res);
    //    //     // //取高度
    //    //      console.log(res[0].height,987878787);
    //    //     this.setState({containerHeight: res[0].height})
    //    // })
    // })
    
    
     
    
  }



  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}


   


  fetchCate(){
  
    // 品类
    Request(
      {
        url: 'api/category',
        method: 'GET',
        //isToken:false
      },
      (data) => {
       
        if(data.code === 200){
     
        this.setState({ tabs:data.data,currentId:data.data[0].id },() => {
          // 获取返片
          this.getLocation()
         
        })
      }
        else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )
  }

  fetchNotePage(refresh) {
    
    const {current,currentId,province,city,tabs,subCur,index} = this.state
    
    const data = {page:current,typeId:currentId,tagId:tabs[index].child[subCur].id,province,city}
    
    // 获取返片列表
    Request(
      {
        url: 'api/notePage',
        method: 'POST',
        data,
        //isToken:false
      },
      (res) => {

        if(refresh){
          Taro.stopPullDownRefresh()
        }

        if(res.code === 200){
        this.setState({ ...res.data, loading: false })
        }else {
          Taro.showToast({
            title: res.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )
  }


  onChange(value) {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      value,
    })
  }



  //上拉刷新
  onScrollToLower() {
    const { pages, current, records,currentId,province,city,tabs,subCur,index } = this.state
    if (pages > current) {
      Request(
        {
          url: 'api/notePage',
          method: 'POST',
          data: { page: current + 1,typeId:currentId ,tagId:tabs[index].child[subCur].id,province,city},
          //isToken:false
        },
        (data) => {
          if(data.code === 200){
          data.data.records = [...records, ...data.data.records]
          this.setState({ ...data.data })
          }
          else {
            Taro.showToast({
              title: data.msg,
              icon:'none',
              mask: true
            });
          }

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
          const address  = data.result.address_component;

            this.setState({city:address.city,province:address.province },() => { this.fetchNotePage()})

            const addr = [address.nation,address.province,address.city,address.district]
            Taro.setStorageSync('curAddr', JSON.stringify(addr))   // 保存地址
            
          },
        )
    })

  }


  onPullDownRefresh(){
    
    this.fetchNotePage(true)
  
  }
  onReachBottom (){
    this.onScrollToLower()
  }

    //省市选择
    selectCity(e) {
     
      
      this.setState({ isOpenedArea: false,city:e.data.city,province:e.data.province },()=>{
        // 获取返片
        this.fetchNotePage()
      })
      
      
    }




  render() {
   
  
    const {
      records,
      loading,
      tabs,
      subCur,
      visible,
      city,
      barHeight,
      statusBarHeight,
      typeBarHeight,
      
      index
      
    } = this.state

    return (
      
      <View className='index'>
       {loading &&  <AtActivityIndicator mode='center' content='加载中...'></AtActivityIndicator>}
       <View style={{display:loading?'none':'block'}}>

       <View className='navbar' style={{paddingTop:statusBarHeight+"px",lineHeight:barHeight+"px"}}>
          <View className='addr' onClick={() => this.setState({isOpenedArea:true})}>{city}</View>
          <View className='service' onClick={() => Taro.navigateTo({url: `/pages/index/publishService`})}>分享返片,获取创作模特资格</View>

        </View>
         <View className='menu'>
          <View className='tab' style={{top:barHeight +statusBarHeight +"px"}}>
          <View className='p20 at-row '>
          {tabs && tabs.map((item,i) => (
            <View key={i} onClick={() => this.changeTab(item,i)}  className={i === index ? 'active at-col' : 'at-col'}><text>{item.dictVal}</text></View>
          ))}
          </View></View>
          <View className='fixed' style={{height:(typeBarHeight + barHeight + statusBarHeight) +"px"}}></View>
          <View className='container p20'>
            <View className='content '>
              <View className='title'>
                {tabs[index] && tabs[index].child && tabs[index].child.map((item,i) => (
                  <View key={i} onClick={() => this.handleClick(i)}  className={i === subCur ? 'active sub' : 'sub'}><text>{item.dictVal}</text></View>
                ))}
              {index === 0 &&   <View  className='expand' onClick={() => this.expand()}></View>}
              </View>
              <View className='subContent'>
                <View className='h3'>· 服务流程是怎么样的？</View>
                <View className='p'>
                <Text user-select  dangerouslySetInnerHTML={{ __html: `确认下单- ->支付定金- ->客服回电确认信息- ->确定摄影师- ->享受拍摄服务- ->支付尾款- ->收到成片

                  关于我的资金安全? 
                  在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。

                  拍摄需要提前多久预定? 
                  目前可支持预约1天后的拍摄服务，如遇拍摄旺季请您最好提前15天到30天以上预定，以免耽误您的拍摄`}}
                >
                  
                </Text>
              </View>
            </View>
          
            <AtButton type='primary' size='small' className='book' onClick={() => Taro.navigateTo({url: `/pages/index/bookPhotographer`})} >预约摄影师</AtButton>
          
            </View>
          </View>
        </View>
       
        <View className='list'>
                {records && records.length > 0 ? (
                  records.map((item, i) => (
                    <View className='item' key={i}>
                      <View
                        onClick={() => {
                         
                            Taro.navigateTo({
                              url: `/pages/index/detail?id=${item.id}`,
                            })
                          
                        }
                        }
                      >
                        <View className='image'>
                          
                          <View className='img'>
                            <Image
                              mode='widthFix'
                              src={(item.imgUrl)}
                            ></Image>
                           
                          </View>
                          <View className='text'>{item.title}</View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className='noData' style={{ padding: '110px 0' }}>
                    <Image
                      mode='widthFix'
                      src={require('../../images/icon/noData.png')}
                    ></Image>
                    <View>暂无数据</View>
                  </View>
                )}
              </View>
        
     
        {visible && <View className={(visible ? 'show ' : '' ) +"moreType"}>
          <View className='body'>
              <View className='h4'>全部选项<AtIcon value='close' size='20' color='#F6F6F6' onClick={() => this.expand()}></AtIcon></View>
              <View className='types'> {tabs[0].child && tabs[0].child.map((item,i) => (
                 <View key={i} onClick={() => this.handleClick(i,true)}  className={item.value === subCur ? 'active subExpand' : 'subExpand'}><text>{item.dictVal}</text></View>
              ))}</View>
              </View>
        </View>}
     
         <View  className='recruitmentBtn'>
         <Text   onClick={() => Taro.navigateTo({url: `/pages/user/recruitment`})} dangerouslySetInnerHTML={{ __html: '招募 \n 摄影师'}}></Text>
          
          </View>       
      
       </View>
       <Area visible={this.state.isOpenedArea} hideDistrict onOk={e=>this.selectCity(e)} onClose={() => {this.setState({isOpenedArea:false})}}></Area>
      </View>
    )
  }
}

