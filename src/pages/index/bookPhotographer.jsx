import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import {
  timeString,
  setAccessToken,
  setUserId,
  getToken,
  setUserInfo,
  validateLogin
} from '../../utils/help'
import { baseUrl } from '../../config'
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
      subCur:1,
      value: '',
      visible:false,
      check:true,
      tabs:[
       { label:'写真约拍',value:1,list:[{value:1,label:'个人写真'},{value:2,label:'情侣写真'},{value:3,label:'证件形象'},{value:4,label:'儿童写真'},{value:5,label:'汉服古风'},{value:6,label:'Cosplay'},{value:7,label:'毕业照'},{value:8,label:'全家福'}]},
       { label:'婚纱摄影',value:2,list:[{value:1,label:'婚纱写真'},{value:2,label:'婚纱旅拍'},{value:3,label:'登记跟拍'},{value:4,label:'婚礼现场'}]},
       { label:'商务公关',value:3,list:[{value:1,label:'公关活动'},{value:2,label:'赛事记录'},{value:3,label:'会议论坛'},{value:4,label:'工程开发记录'}]},
       { label:'商业广告',value:4,list:[{value:1,label:'产品广告'},{value:2,label:'空间建筑'},{value:3,label:'美食静场'}]}

      ]  ,
      files1: [],
      files2: [],
      isOpenedArea: false,
     
      dateStart:'请选择时间',  // 开始时间
      dateEnd:'请选择时间',//结束时间
      curAddr:'',//选择的地点
      bookSel,
      isOpened:false
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
     getToken(() => {}, true)

    this.getLocation()

  }

  getPhoneNumber(e) {
    
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

  onChangeFile(files, operationType,isFile1) {
    if (operationType === 'remove') {
      this.setState({
        files,
      })
    }

    // console.log(files)
    //  this.setState({
    //    files
    //  })
    if (operationType === 'add') {
      files.map((item, i) => {
        if (!item.url.startsWith(baseUrl)) {
          const file = item
          console.log(file)
          this.setState({
            //files
            loading: true,
          })
          const that = this
          Taro.uploadFile({
            url: baseUrl +'api/imgs',
            filePath: file.url,
            name: 'file',
            formData: {
              file: files,
            },
            header: {
              //  Authorization : getAccessToken(),
              'Content-Type': 'multipart/form-data',
              accept: 'application/json',
            },
            success(res) {
              const data = JSON.parse(res.data)
              files[i].url = data.data.path
              that.setState({ loading: false })
              if(isFile1){
                that.setState({  files1:files })
              } else {
                that.setState({ files2:files })
              }

              //do something
            },
            fail() {
              console.log(1111)
            },
          })
        }
      })
    }
  }


    //省市选择
    selectCity(e) {
     let curAddr = ''
     if(e.showDistrict){
      curAddr = `${e.data.city} ${e.data.area}`
     } else{
      curAddr = `${e.data.province} ${e.data.city}`
     }
      this.setState({ isOpenedArea: false,curAddr })
    }

    getLocation(){

        Request(
          {
            url: `area/getAreaByIp`,
            method: 'GET'
            //isToken:false
          },
          (data) => {
            console.log(data)

             this.setState({curAddr:data.data.city })
          },
        )


    //   Taro.getLocation().then(res => {
    //     let latitude = res.latitude;
    //     let longitude = res.longitude;

    //     Request(
    //       {
    //         url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
    //         method: 'GET',
    //         data,
    //         //isToken:false
    //       },
    //       (data) => {
    //         // this.setState({ ...data.data, loading: false })
    //       },
    //     )
    // })
  }

  onDateChange(e,isStart){
    if(isStart){
      this.setState({dateStart:e.current})
    } else {
      this.setState({dateEnd:e.current})
    }
    
   
  }



  render() {
   

    const {
      loading,tabs,user, current,subCur,  visible,  check,   files1,   files2,dateStart, dateEnd,curAddr,bookSel,isOpened,curItem
      
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

    console.log(this.state.isOpenedArea,99999966666)

    return (
      <View className="index bookPage">
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
                  
                  <View
                    className="picker"
                    onClick={() => this.setState({isOpenedArea:true}) }
                  >
                    {curAddr}
                  </View>
                  <View  className="pickerDate picker">
                    <DateTimePicker onOk={e => this.onDateChange(e,true)}   wrap-class="pickerTime"  select-item-class="selLale selStart" />
                    <DateTimePicker onOk={e => this.onDateChange(e,true)}    wrap-class="pickerTime"  select-item-class="selLale selEnd" />
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
                  <View className="time start">{dateStart}</View>
                  </Picker>
                  <Picker mode='date' onChange={e => this.onDateChange(e)}>
                  <View className="time end">{dateEnd}</View>
                  </Picker> */}

            </View>
          
           
          
            </View>
          </View>
         </View>
         <View className="imagesGroup p20">
          <View className='content '>
              <View className="tit"> 以下资料可以快速匹配摄影师并为您制定初步方案 </View>
              <View className="con">
                <View className="p">上传想拍的风格参考图，让摄影师确认风格。若选择自备服装，可在此上传服装样式。</View>
                <AtActivityIndicator
                  mode="center"
                  isOpened={this.state.loading}
                  content="上传中..."
                ></AtActivityIndicator>
                <AtImagePicker
                  files={this.state.files1}
                  onChange={(files, operationType) => this.onChangeFile(files, operationType,1)}
                  showAddBtn={this.state.files1.length < 10}
                  multiple
                />
                <View className="p">上传顾客面容照片，让摄影师制定风格</View>
                <AtActivityIndicator
                  mode="center"
                  isOpened={this.state.loading}
                  content="上传中..."
                ></AtActivityIndicator>
                <AtImagePicker
                  files={this.state.files2}
                  onChange={this.onChangeFile.bind(this)}
                  showAddBtn={this.state.files2.length < 10}
                  multiple
                />
                <View className="tit" style={{color:'#333'}}> 如实描述皮肤状态</View>
                <AtTextarea
                  count={false}
                  maxLength={300}
                  placeholder="请输入你的肌肤状态"
                  name="detail"
                  value={this.state.detail}
                  onChange={(e) => {
                    this.setState({ detail: e })
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
            <AtButton size="small" type="primary" circle  onClick={() => {this.setState({isOpened:true,curItem:{price:'100.00'}})}}>立即预约</AtButton>
        </View>

        
        <View className={(visible ? 'show ' : '' ) +"moreType"}>
          <View className="body">
              <View className="h4">全部选项<AtIcon value='close' size='20' color='#F6F6F6' onClick={() => this.expand()}></AtIcon></View>
              <View className="types"> {tabs[0].list.map((item,i) => (
                 <View onClick={() => this.handleClick(item.value,true)}  className={item.value === subCur ? 'active subExpand' : 'subExpand'}><text>{item.label}</text></View>
              ))}</View>
              </View>
        </View>
     

         
        <Area visible={this.state.isOpenedArea} onOk={e=>this.selectCity(e)}></Area>
        <Pay isOpened={isOpened} curItem={curItem}/>
      </View>
    )
  }
}
