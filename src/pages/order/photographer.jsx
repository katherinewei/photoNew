import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image} from '@tarojs/components'
import { AtButton,AtAvatar,AtTabs, AtTabsPane} from 'taro-ui'
import Request from '../../utils/request'
import './photographer.scss'

export default class Index extends Component {


  state = {
    currentTab:0,
    photoerVO:{},
    tradeRecordVO:{}
  }

  componentWillMount() {

    const $instance = Taro.getCurrentInstance()
    //根据摄影师 ID 获取摄影师详情内容
    Request(
      {
        url: 'api/getWxPhotoerInfo',
        method: 'GET',
        data: { id:$instance.router.params.id},
        //isToken:false
      },
      (data) => {
        if(data.code === 200){
       // data.data.records = [...records, ...data.data.records]
        this.setState({ ...data.data })
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )

    this.fetchRecord()

    



   // this.setState({})
  
  }

  componentDidMount() {
    
  }

 

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleClick (value) {
    this.setState({
      currentTab: value
    })
  }
  scrollTopFun(e){
    console.log(e)
   // that.top = e.detail.scrollTop;
  }

  //上拉刷新
  onScrollToLower() {
    const { pages, current, records } = this.state
    const $instance = Taro.getCurrentInstance()
    if (pages > current) {
      Request(
        {
          url: 'api/wxCommentPage',
          method: 'GET',
          data: {page:current + 1, id:$instance.router.params.id},
          //isToken:false
        },
        (data) => {
          if(data.code === 200){
          data.data.records = [...records, ...data.data.records]
         // console.log(data)
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


  fetchRecord(refresh){
    const $instance = Taro.getCurrentInstance()
    //查看摄影师评论列表内容-分页
    Request(
      {
        url: 'api/wxCommentPage',
        method: 'GET',
        data: {page:1, id:$instance.router.params.id},
        //isToken:false
      },
      (data) => {
        if(refresh){
          Taro.stopPullDownRefresh()
        }
        if(data.code === 200){
        this.setState({ ...data.data })
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )
  }

  onPullDownRefresh(){
    this.fetchRecord(true)
  }
  onReachBottom (){
    this.onScrollToLower()
  }



  selectIt(){
    const $instance = Taro.getCurrentInstance()
    Taro.navigateTo({url: `/pages/order/orderDeatil?id=${$instance.router.params.tradeId}&recordId=${$instance.router.params.id}`})
  }

  

  render() {
    const {photoerVO,tradeRecordVO,records,total} = this.state
    const tabList = [{ title: '样片' }, { title: '评价' }]
    return (
      <View className='index photographer' >
        <View className='contain'>
        <View className='header' >
         
          <View className='bg' style={{backgroundImage:"url("+photoerVO.headPic+")"}}></View>
          <View className='mask'></View>
          <View className='top'>
            <AtAvatar  circle  image={photoerVO.headPic}   ></AtAvatar>
            <View className='right'>
              <View className='name'>{photoerVO.userName}</View>
              <View className='i'><text>{photoerVO.sex === 1 ? '女' :'男'}</text>
              {/* <text>高级摄影师</text><text>从业12年</text> */}
              <text>服务客户<text class='number'>{photoerVO.serviceNum}</text></text></View>
              <View className='o'>诚信服务</View>
            </View>
          </View>
         
        </View>
        <View className='intro'>
          <text>简介：</text>{photoerVO.introduction}
        </View>
        <View className='content intro'>
          <View className='price'>报价：<text>￥</text>{tradeRecordVO.amount}</View>
          <View className='detail'>
            <View className='price'>套餐详情</View>
            <View className='con'>
              <View><text>拍摄时长：</text>{tradeRecordVO.photoTime}小时</View>
              <View><text>服装造型：</text>{tradeRecordVO.dressNum}套</View>
              <View><text>底片数量：</text>{tradeRecordVO.plateNum}张</View>
              <View><text>精修加片：</text>{tradeRecordVO.turingAmount}元/张</View>
              <View><text>精修成片：</text>{tradeRecordVO.turingNum}张</View>
              <View><text>最多人数：</text>{tradeRecordVO.personNum}位</View>
            </View>
          </View>
        </View>


        <AtTabs  current={this.state.currentTab} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.currentTab} index={0}>
            <View  className='images'>
              {tradeRecordVO.rushImgUrlList && tradeRecordVO.rushImgUrlList.length > 0 && tradeRecordVO.rushImgUrlList.map((pic,k) => (
                <Image key={k} src={pic} mode='widthFix'></Image>
              ))}
             
            
            </View>
            
           
          </AtTabsPane>
          <AtTabsPane current={this.state.currentTab} index={1} className='evaluation'>
            <View  className='evaluation'>
              <View  className='title'>用户评价({total})</View>
              

                <View className='box'>
                  {records && records.length > 0 ? records.map((item,i) => (
                    <View key={i} className='item'>
                    <AtAvatar  circle  image={item.headPic}   ></AtAvatar>
                    <View className='cRight'>
                      <View className='n'>{item.userName}</View>
                      <View className='t'>{item.time}</View>
                      <View className='c'>{item.content}</View>
                      <View className='i'>
                        {item.commentImgUrlList && item.commentImgUrlList.length > 0 && item.commentImgUrlList.map((pic,j)=> (
                            <Image key={j} src={pic} mode='widthFix'></Image>
                        ))}
                      </View>
                    </View>
                  
                  </View>
                  
                  )): <View className='noData' style={{ padding: '110px 0' }}>
                  <Image
                    mode='widthFix'
                    src={require('../../images/icon/noData.png')}
                  ></Image>
                  <View>暂无数据</View>
                </View>}
                
                </View>
              
            </View>
          </AtTabsPane>
         
        </AtTabs>
        </View>
        <View className='foot'>
          <AtButton size='small' type='primary' circle onClick={() => this.selectIt()}>选TA服务</AtButton>
      
        </View>
        
      </View>
    )
  }
}
