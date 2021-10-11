import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import {
  getToken,
 
} from '../../utils/help'
import { baseUrl,mapKey } from '../../config'
import './index.scss'
import '../../components/common.scss'
import DateTimePicker from '../../components/DateTimePicker';
import Area from '../../components/area';
import {
  AtButton ,
  AtIcon,
  AtFab,
  AtTabBar,
  AtAvatar,
  AtSearchBar,
  AtInput,
  AtActivityIndicator,
  AtSteps ,
  AtTextarea,
  AtImagePicker
  } from 'taro-ui'
  import Pay from '../../components/pay/index'
  import ImageUpload from '../../components/imageUpload';
export default class Index extends Component {
  config = {
    navigationBarTitleText: '预约摄影师',
    navigationBarTextStyle: 'white',
   
  }

  componentWillMount() {
    // let areas = [[],[]]
    // Area[0].children.map(province => {
    //   areas[0].push(province.value)
    // })
    // areas[1].push(Area[0].children[0].children[0].value)
    let bookSel = {}
    if(this.$router.params.sel){
       bookSel = Taro.getStorageSync('bookSel')
      if(bookSel){
        bookSel = JSON.parse(bookSel)
      } 
    } else {
      Taro.removeStorageSync('bookSel')
    }
    

    this.setState({
      loading: false,
      current: 1,
      subCur:0,
      value: '',
      visible:false,
      check:true,
      tabs:[],
      index:0,
      currentId: '',
      clothesImgUrl: [],
      customerImgUrlList: [],
      isOpenedArea: false,
     
      startTime:'',  // 开始时间
      endTime:'',//结束时间
      curAddr:'',//选择的地点
      bookSel,
      isOpened:false,
      tradeId:'',
      // selType1:'',//数码/胶片/视频
      // selType2:'',//人数
      // selType3:'',//化妆选择
      // selType4:'',//服装选择
      // selType5:'',//摄影师选择
      // selType6:'',//服务方式
    })
       
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }



  componentDidMount() {
     getToken(() => {})

     if(!this.$router.params.hasChoose){   // 不是选择
        this.getLocation() 
        this.fetchCate()
        Taro.removeStorageSync('curAddr'); 
        Taro.removeStorageSync('tabs'); 
        Taro.removeStorageSync('startTime'); 
        Taro.removeStorageSync('endTime'); 
        Taro.removeStorageSync('skinState'); 
        Taro.removeStorageSync('customerImgUrlList'); 
        Taro.removeStorageSync('clothesImgUrl'); 
        Taro.removeStorageSync('contact'); 
        
          
          
     } else {
       let currAddr = Taro.getStorageSync('curAddr') ? JSON.parse(Taro.getStorageSync('curAddr'))  : ''
       let tabs = Taro.getStorageSync('tabs') ? JSON.parse(Taro.getStorageSync('tabs'))  : []

       if(currAddr.length > 0){
        currAddr = currAddr[currAddr.length - 2] + ' ' + currAddr[currAddr.length - 1]
       }
       let currentId = ''
       if(tabs.length > 0){
        currentId = tabs[0].id
       }

        

      this.setState({
        curAddr:currAddr,
        tabs:Taro.getStorageSync('tabs') ? JSON.parse(Taro.getStorageSync('tabs'))  : [],
        currentId,
        startTime:Taro.getStorageSync('startTime') || '',
        endTime:Taro.getStorageSync('endTime') || '',
        skinState:Taro.getStorageSync('skinState') || '',
        contact:Taro.getStorageSync('contact') || '',

      })
     }

   

   

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
        Taro.setStorageSync('tabs', JSON.stringify(res.data))   // 保存地址
        })
      },
    )
  }

  getLocation(){

    Taro.getLocation().then(res => {
        let latitude =  res.latitude; // 
        let longitude =  res.longitude;
       // console.log(latitude,longitude)

        Request(
          {
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${mapKey}`,
            method: 'GET',
            isMap:true
            //isToken:false
          },
          (data) => {
          //  console.log(data.result.address_component.city,222)
            this.setState({curAddr:data.result.address_component.city + ' ' + data.result.address_component.district })
            const addr = [data.result.address_component.nation,data.result.address_component.province,data.result.address_component.city,data.result.address_component.district]
            Taro.setStorageSync('curAddr', JSON.stringify(addr))   // 保存地址
          },
        )
    })

  }


  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  

  onChange(value) {
    this.setState({
      value: value,
    })
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

  //省市选择
  selectCity(e) {
    let curAddr = ''
    curAddr = `${e.data.city} ${e.data.area}`
    
    this.setState({ isOpenedArea: false,curAddr })

    const addr = [e.data.country,e.data.province,e.data.city,e.data.area]
    Taro.setStorageSync('curAddr', JSON.stringify(addr))   // 保存地址
  }

 

  onDateChange(e,isStart){
    if(isStart){
      this.setState({startTime:e.current})
      Taro.setStorageSync('startTime',e.current)   // 保存开始时间 
    } else {
      this.setState({endTime:e.current})
      Taro.setStorageSync('endTime', e.current)   // 保存开始时间
    }
    
   
  }

  // 提交
  onSubmit(){
    const {
      tabs,index,subCur, clothesImgUrl,customerImgUrlList,startTime, endTime,curAddr,bookSel,skinState,contact
      
    } = this.state

    let payload = {}

    if(!startTime){
      Taro.showToast({
        title: '请选择开始时间',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if(!endTime){
      Taro.showToast({
        title: '请选择结束时间',
        icon: 'none',
        mask: true,
      })
      return false
    }

    // 开始时间大于结束时间
    if(new Date(startTime).getTime() > new Date(endTime).getTime()){
      Taro.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none',
        mask: true,
      })
      return false
    }
    
    if(!bookSel.selType1){
      Taro.showToast({
        title: '请选择拍摄类型',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const imgType = bookSel.selType1.id

    if(!bookSel.selType2){
      Taro.showToast({
        title: '请选择人数',
        icon: 'none',
        mask: true,
      })
      return false
    }
    bookSel.selType2.map(item => {
      if(item.id === 0){  // 成人
        payload.adult = item.number
      }
      if(item.id === 1){  // 成人
        payload.child = item.number
      }
      if(item.id === 2){  // 成人
        payload.lover = item.number
      }
    })
    if(!bookSel.selType3){
      Taro.showToast({
        title: '请选择化妆方式',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const makeupType = bookSel.selType3.id

    if(!bookSel.selType4){
      Taro.showToast({
        title: '请选择服装方式',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const clothesType = bookSel.selType4.id

    if(!bookSel.selType5){
      Taro.showToast({
        title: '请选择服装方式',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const photographerType = bookSel.selType5.id

    if(!bookSel.selType6){
      Taro.showToast({
        title: '请选择服务方式',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const serviceType = bookSel.selType6.id

    let imgPath1 = []
    if (clothesImgUrl.length > 0) {
      imgPath1 = []
     clothesImgUrl.map((item) => {
       //let url = item.url.replace(ImageUrl, '')
        imgPath1.push(item.url)
      })
    }
    let imgPath2 = []
    if (customerImgUrlList.length > 0) {
      imgPath2 = []
     customerImgUrlList.map((item) => {
       // let url = item.url.replace(ImageUrl, '')
        imgPath2.push(item.url)
      })
    }

    if(imgPath1.length === 0){
      Taro.showToast({
        title: '请上传风格参考图',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if(imgPath2.length === 0){
      Taro.showToast({
        title: '请上传面容照片',
        icon: 'none',
        mask: true,
      })
      return false
    }

   const typeId = tabs[index].id 
   const tagId = tabs[index].child[subCur].id
   const pos = JSON.parse(Taro.getStorageSync('curAddr')) 

    payload = {...payload,
      typeId,tagId,startTime:startTime + ':00',endTime:endTime + ':00',contact,//todo
      country:pos[0], province:pos[1],city:pos[2], district:pos[3],  
      imgType,makeupType,clothesType,photographerType,serviceType,
      styleImgUrlList:imgPath1,customerImgUrlList:imgPath2,
      skinState}
      // 发送数据
    Request(
      {
        url: 'api/tradeSave',
        method: 'POST',
        data:payload,
      },
      (data) => {
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          mask: true,
        })
        this.setState({tradeId:data.data.id,isOpened:true,curItem:{price:'200.00'}})


      //  return data.data.id
        // setTimeout(() => {
        //   Taro.redirectTo({
        //     url: `/pages/index/index`,
        //   })
        // }, 1000)
      },
    )

  }

  callback(){
    Taro.reLaunch({
      url: `/pages/order/index`,
    })
  }



  render() {
   

    const {
      loading,tabs,index,user, current,subCur,  visible,  check, clothesImgUrl,customerImgUrlList,startTime, endTime,curAddr,bookSel,isOpened,curItem,skinState
      
    } = this.state

    const items = [
      { 'title': '提交预约'  },
      { 'title': '确认订单' },
      { 'title': '拍摄服务' },
      { 'title': '结算费用' }
    ]
    let selType2  = []
    if(bookSel && bookSel.selType2){
      bookSel.selType2.map(item => {
        selType2.push(item.number + item.label) 
      })
      selType2 = selType2.join(',')
    } else {
      selType2 = ''
    }

    const {hasChoose} = this.$router.params

    return (
      <View className="index bookPage">
         <View className='menu'>
          <View className='tab'>
          <View className='p20 at-row '>
          {tabs && tabs.map((item,i) => (
            <View onClick={() => this.changeTab(item,i)}  className={i === index ? 'active at-col' : 'at-col'}><text>{item.dictVal}</text></View>
          ))}
          </View></View>
          <View className='fixed'></View>
          <View className="container p20">
            <View className='content '>
              <View className="title"> 
              {tabs && tabs[index] && tabs[index].child && tabs[index].child.map((item,i) => (
                  <View onClick={() => this.handleClick(i)}  className={i === subCur ? 'active sub' : 'sub'}><text>{item.dictVal}</text></View>
                ))}
              {index === 0 &&  <View  className='expand' onClick={() => this.expand()}></View>}
              </View>
              <View className="subContent">
                  
                  <View
                    className="picker"
                    onClick={() => this.setState({isOpenedArea:true}) }
                  >
                   
                    {curAddr}
                  </View>
                  <View  className="pickerDate picker">
                    <DateTimePicker initValue={startTime} onOk={e => this.onDateChange(e,true)}   wrap-class="pickerTime"  select-item-class="selLale selStart" />
                    <DateTimePicker initValue={endTime} onOk={e => this.onDateChange(e)}    wrap-class="pickerTime"  select-item-class="selLale selEnd" />
                  </View>

                  <View className='at-row pickerRow'>
                      <View  className="at-col picker" onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType1`})}>
                       {bookSel.selType1 ?  <Text className='selected'>{bookSel.selType1.label}</Text> :
                        <Text>数码/胶片/视频</Text> }
                      </View>

                      <View  className="at-col picker"  onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType2&isNumber=1`})}>
                      {bookSel.selType2 ?  <Text className='selected'>{selType2}</Text> :
                        <Text>人数</Text> }
                      </View>

                  </View>
                  <View className='at-row pickerRow'>
                      <View  className="at-col picker" onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType3`})}>
                       {bookSel.selType3 ?  <Text className='selected'>{bookSel.selType3.label}</Text> :
                        <Text>化妆选择</Text> }
                      </View>
                      <View  className="at-col picker" onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType4`})}>
                       {bookSel.selType4 ?  <Text className='selected'>{bookSel.selType4.label}</Text> :
                        <Text>服装选择</Text> }
                      </View>
                  </View>
                  <View className='at-row pickerRow'>
                      <View  className="at-col picker " onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType5`})}>
                       {bookSel.selType5 ?  <Text className='selected'>{bookSel.selType5.label}</Text> :
                        <Text>摄影师选择</Text> }
                      </View>
                      <View  className="at-col picker " onClick={() =>Taro.navigateTo({url: `/pages/index/picker?type=selType6`})}>
                       {bookSel.selType6 ?  <Text className='selected'>{bookSel.selType6.label}</Text> :
                        <Text>服务方式</Text> }
                      </View>
                  </View>

                  
                  {/* <Picker mode='date' onChange={e => this.onDateChange(e,true)}>
                  <View className="time start">{startTime}</View>
                  </Picker>
                  <Picker mode='date' onChange={e => this.onDateChange(e)}>
                  <View className="time end">{endTime}</View>
                  </Picker> */}


                  <AtInput
                    clear
                    title='联系方式'
                    type='number'
                    placeholder='请输入您的联系方式'
                    value={this.state.contact}
                    onBlur={(e) => {this.setState({contact:e});Taro.setStorageSync('contact',  e);}}
                   
                    className="contact"
                    placeholderClass="phcolor"
                  >
                      <Text className="green">已开启密码保护</Text>

                    
                  </AtInput>


            </View>
          
           
          
            </View>
          </View>
         </View>
         <View className="imagesGroup p20">
          <View className='content '>
              <View className="tit"> 以下资料可以快速匹配摄影师并为您制定初步方案 </View>
              <View className="con">
                <View className="p">上传想拍的风格参考图，让摄影师确认风格。若选择自备服装，可在此上传服装样式。</View>

                {/* <ImageUpload  onOk={e => {
                  this.setState({clothesImgUrl:e.files})
                  }} /> */}

                <ImageUpload files={hasChoose ? Taro.getStorageSync('clothesImgUrl') ? JSON.parse(Taro.getStorageSync('clothesImgUrl')) : []:[]} onOk={e => {
                  this.setState({clothesImgUrl:e.files})
                  Taro.setStorageSync('clothesImgUrl', JSON.stringify(e.files));
                  }} />


                <View className="p">上传顾客面容照片，让摄影师制定风格</View>
                {/* <ImageUpload  onOk={e => {
                this.setState({customerImgUrlList:e.files})
              
                }} /> */}
                <ImageUpload files={hasChoose ? Taro.getStorageSync('customerImgUrlList') ? JSON.parse(Taro.getStorageSync('customerImgUrlList')) : []:[]} onOk={e => {
                  this.setState({customerImgUrlList:e.files})
                  Taro.setStorageSync('customerImgUrlList', JSON.stringify(e.files));
                  }} />

                <View className="tit" style={{color:'#333'}}> 如实描述皮肤状态</View>
                <AtTextarea
                  count={false}
                  maxLength={300}
                  placeholder="请输入你的肌肤状态"
                  name="skinState"
                  value={skinState}
                  onChange={(e) => {
                    this.setState({ skinState: e })
                    Taro.setStorageSync('skinState',  e);
                  }}
                />
              </View>
          </View>          
         </View>  
         <View className="servicesTip">
          <View className="h3">服务流程 </View>
          <AtSteps
            items={items}
            current={-1}
          />
          <View className="h3">常见问题 </View>
          <View className="p">
            <text user-select>
            1.服务流程是怎么样的？\n
              确认下单- -&gt;支付定金- -&gt;客服回电确认信息- -&gt;确定摄影师- -&gt;享受拍摄服务- -&gt;支付尾款- -&gt;收到成片 \n \n

              2.关于我的资金安全? \n
              在您享受完拍摄后收到成片并点击“收到成片”后，平台才会与摄影师进行结算打款，在此之前您的资金都将受到平台保护。\n \n

              3.拍摄需要提前多久预定? \n
              目前可支持预约1天后的拍摄服务，如遇拍摄旺季请您最好提前15天到30天以上预定，以免耽误您的拍摄 \n
            </text>
          </View>
        </View> 

        <View className="foot">
            <View className="agree" onClick={() => this.setState({check: !check})}>
              <View className="icon">{check && <AtIcon value='check' size='10' color='#fff'></AtIcon>}</View>
              <View> 我已阅读并同意<text>《拍摄服务撮合协议》</text></View>
              </View>
            <AtButton size="small" type="primary" circle  onClick={() => {this.onSubmit()}}>立即预约</AtButton>
        </View>

        
        <View className={(visible ? 'show ' : '' ) +"moreType"}>
          <View className="body">
              <View className="h4">全部选项<AtIcon value='close' size='20' color='#F6F6F6' onClick={() => this.expand()}></AtIcon></View>
              <View className="types"> {tabs && tabs[0].child && tabs[0].child.map((item,i) => (
                 <View onClick={() => this.handleClick(i,true)}  className={item.value === subCur ? 'active subExpand' : 'subExpand'}><text>{item.dictVal}</text></View>
              ))}</View>
              </View>
        </View>
     

      
        <Area visible={this.state.isOpenedArea} onOk={e=>this.selectCity(e)} onClose={() => {this.setState({isOpenedArea:false})}}></Area>
        <Pay isOpened={isOpened} curItem={curItem} create={true} tradeId={this.state.tradeId} onOk={() => this.callback()}/>
      </View>
    )
  }
}
