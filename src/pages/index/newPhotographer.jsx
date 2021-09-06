import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import Request from '../../utils/request'
import {
  timeString,
  setAccessToken,
  getImageUrl,
  typeS,
  getUserId,
  validateLogin
} from '../../utils/help'
import { ImageUrl } from '../../config'
import './index.scss'
import {
  AtButton,
  AtIcon,
  AtFab,
  AtTabBar,
  AtAvatar,
  AtSearchBar,
  AtInput,
  AtCurtain,
  AtActivityIndicator,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui'
import Tabs from '../../components/tab'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '验真约拍',
  }

  componentWillMount() {
    let { isTruthUser, userId } = this.$router.params //是否是验真官

    isTruthUser = Number(isTruthUser)

    this.state = {
      loading: true,
      current: 0,
      value: '',
      isOpened: false,
      records: [],
      makeup: 0,
      cloth: 0,
      type: 0,
      price: 0,
      area: ['广东省', '广州市'],
      notfirstYz: {},
      priceModal: false,
      isTruthUser,
      currentSearch: {},
      country: [], //地区数据
      countryed: '',
      province:[],
      provinceed: '',
      city:[],
      cityed: '',
      districted:'',
      showDistrict:false,
      userId,
      
    }

    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }

  componentDidMount() {
    this.fetchyzlist()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  fetchyzlist(query, value) {
    let data = {}
    let val = ''

   
    if(query === 'data'){
      data = value
    } else {
      if (value) {
        if (query === 'name') {
         val = value
       } else {
         value = value.target.value
        
          if (query === 'type') {
           val = Number(value) + 1
         } else if (query === 'price') {
           val = value == 1 ? 'desc' : 'asc'
           if (value == 2) {
             //自定义价格
 
             this.setState({ priceModal: true })
 
             return false
           }
         } else {
           val = value
         }
       }
     }
 
     if (query && val) {
       data[query] = val
     }
    }
   
    this.setState({ currentSearch: data })

    // 验真列表
    Request(
      {
        url: 'photo-new-index',
        method: 'GET',
        data,
        //isToken:false
      },
      (data) => {
        this.setState({ ...data.data, loading: false })
      },
    )
  }

  handleConfirm() {
    // 价格筛选
    const { priceMax, priceMin } = this.state
    const currentSearch = { priceMax, priceMin }
    this.setState({ currentSearch })
    Request(
      {
        url: 'photo-new-index',
        method: 'GET',
        data: currentSearch,
        //isToken:false
      },
      (data) => {
        this.setState({ records: data.data.records, priceModal: false })
      },
    )
  }

  onChange(value) {
    this.setState({
      value: value,
    })
  }

  onConfirm() {
    this.fetchyzlist('name', this.state.value)
  }

  onClose() {
    this.setState({
      isOpened: false,
    })
  }

  handleClickService(value) {
    Taro.navigateTo({
      url: `/pages/index/serviceDetail?id=1`,
    })
  }

  //验真申请
  applyYZ(e, row) {
    if(validateLogin()){
    e.preventDefault()
   
    if (!this.state.isTruthUser) {
      Taro.showModal({
        content: '你不是验真官,请认证验真官。',
        confirmText: '前往',
        success: (result) => {
          if (result.confirm) {
            Taro.navigateTo({
              url: `/pages/publish/verificateChecker?source=applicate`,
            })
          }
        },
        mask: true,
      })
      return false
    }
    const userId = getUserId()
    if(userId === row.userId){
      Taro.showToast({
        title: '这是您自己发布的验真约拍，无法申请！',
        icon: 'none',
        mask: true,
      })
      return false
    }

    Taro.navigateTo({ url: `/pages/publish/appointApplication?id=${row.id}` })

    // Request({
    //   url: 'photo-speech-add',
    //   method: 'POST',
    //   data:{id:row.id},
    //   //isToken:false
    // },(data) => {
    //   Taro.showToast({
    //     title: '申请成功！',
    //     icon: 'success',
    //     mask: true,
    //   });
    //   const {records} = this.state;
    //   records.map(item => {
    //     if(item.id == row.id){
    //       item.isBook = true
    //       item.count += 1
    //     }
    //   })
    //   this.setState({records})

    // })
  }
  }

  onScrollToLower() {
    const { pages, current, records, currentSearch } = this.state
    console.log(pages, current)
    if (pages > current) {
      Request(
        {
          url: 'photo-new-index',
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


  //省市选择
  selectCity() {
    const {provinceed,cityed,districted,countryed} = this.state;
    const data = {
      province:provinceed,
      city:cityed,
      area:districted,
      country:countryed
    }
    this.fetchyzlist('data',data)
    this.setState({ isOpenedArea: false })
  }

  showArea(){
    this.setState({ isOpenedArea: true })
    Request(
      {
        url: ImageUrl+'/wx/area/country',
        method: 'get',
       
      },
      (data) => {
        const countries = data.data;
        const country = []
        countries.map(item => {
          country.push(item.zonename)
        })
       // this.setState({country:data.data})

        this.setState({
          country, //地区数据
          countryed:'',
          sel_country: '',
          provinceed: '',//北京市,北京市,东城区
          cityed: '',
          districted: '',
          countries,
        })

      // console.log(data)
      },
    )

  }


  onChangeCountry = (e) => {
    // if (e.target.value == 0) {
    //   this.setState({
    //     provinceed: '北京市,北京市,东城区',
    //   })
    // }
    this.setState({
      countryed: this.state.country[e.target.value],
    })
    let id = ''
    this.state.countries.map((item,i) => {
      if(i == e.target.value){
          id = item.id
      }
    })
    Request(
      {
        url: ImageUrl+'/wx/area/province',
        method: 'get',
        data:{id}
      },
      (data) => {
        const provinces = data.data;
        const province = []
        provinces.map(item => {
          province.push(item.zonename)
        })
       // this.setState({country:data.data})

        this.setState({
          province,
          provinces,
         
          provinced:'',
          cityed:'',
          districted:''
        })

      // console.log(data)
      },
    )
    


    
   
  }

  onChangeProvince = (e) => {
    console.log(e.target.value)
   
    this.setState({
      provinceed: this.state.province[e.target.value],
    })
    let id = ''
    this.state.provinces.map((item,i) => {
      if(i == e.target.value){
          id = item.id
      }
    })
    Request(
      {
        url: ImageUrl+'/wx/area/city',
        method: 'get',
        data:{id}
      },
      (data) => {
        const cities = data.data;
        const city = []
        cities.map(item => {
          city.push(item.zonename)
        })
     
        this.setState({
          city,
          cities,
          cityed:'',
          districted:''
        })

     
      },
    )

  }

  onChangeCity = (e) => {
    this.setState({
      cityed: this.state.city[e.target.value],
    })
    let id = ''
    this.state.cities.map((item,i) => {
      if(i == e.target.value){
          id = item.id
      }
    })
    Request(
      {
        url: ImageUrl+'/wx/area/district',
        method: 'get',
        data:{id}
      },
      (data) => {
        const districts = data.data;
        if(districts.length > 0){
          const district = []
          districts.map(item => {
            district.push(item.zonename)
          })
          this.setState({
            district,
            districts,
            districted:'',
            showDistrict:true
          })
        }  
      },
    )
  }


  render() {
    const makeups = ['自备', '提供']
    const clothes = ['自备', '提供']
    const types = typeS
    const prices = ['由高到低', '由低到高', '自定义价格区间']
    const {
      records,
      loading,
      priceModal,
      isTruthUser,
      //initArea,
      userId,
    } = this.state

    return (
      <View className="index">
        <AtModal isOpened={priceModal}>
          <AtModalHeader>输入价格区间</AtModalHeader>
          <AtModalContent>
            <View className="modalInput">
              <Input
                value={this.state.priceMin}
                onInput={(e) => {
                  this.setState({ priceMin: e.target.value })
                }}
              />
              -
              <Input
                value={this.state.priceMax}
                onInput={(e) => {
                  this.setState({ priceMax: e.target.value })
                }}
              />
            </View>
          </AtModalContent>
          <AtModalAction>
            {' '}
            <Button
              onClick={() => {
                this.setState({ priceModal: false })
              }}
            >
              取消
            </Button>{' '}
            <Button onClick={() => this.handleConfirm()}>确定</Button>{' '}
          </AtModalAction>
        </AtModal>

        <AtActivityIndicator
          mode="center"
          isOpened={loading}
          content="加载中..."
        ></AtActivityIndicator>
        <Tabs current={0} />
        <ScrollView
          className="scrollview"
          scrollY
          scrollWithAnimation
          scrollTop={0}
          style={{ height: Taro.getSystemInfoSync().windowHeight - 70 + 'px' }}
          lowerThreshold={20}
          upperThreshold={20}
          onScrollToLower={this.onScrollToLower.bind(this)}
        >
          <View className="body">
            <View className="title">
              {!isTruthUser && (
                <Text>首先完成体验官认证，方可向摄影师发起验真申请！</Text>
              )}
              {!isTruthUser && (
                <AtButton
                  type="primary"
                  onClick={() => {
                    if(validateLogin()){
                      Taro.navigateTo({ url: `/pages/publish/verificateChecker` })
                    }
                  }
                  }
                >
                  认证验真官
                </AtButton>
              )}
              <AtInput
                name="value"
                title=""
                type="text"
                placeholder="参加验真约拍， 体验服务拿报酬，为摄影服务验真"
                value={this.state.value}
                onChange={this.onChange.bind(this)}
                onConfirm={this.onConfirm.bind(this)}
              />
            </View>

            <View className="content">
              <View className="selectBox">
                <View className="at-row">
                  <View
                    className="picker at-col"
                    onClick={() => this.showArea() }
                  >
                    地点
                  </View>
                  <Picker
                    className="at-col"
                    mode="selector"
                    range={makeups}
                    onChange={(e) => {
                      this.fetchyzlist('makeupFlag', e)
                    }}
                  >
                    <View className="picker">妆面</View>
                  </Picker>
                  <Picker
                    className="at-col"
                    mode="selector"
                    range={clothes}
                    onChange={(e) => {
                      this.fetchyzlist('clothesFlag', e)
                    }}
                  >
                    <View className="picker">服装</View>
                  </Picker>
                  <Picker
                    className="at-col"
                    mode="selector"
                    range={types}
                    onChange={(e) => {
                      this.fetchyzlist('type', e)
                    }}
                  >
                    <View className="picker">类型</View>
                  </Picker>
                  <Picker
                    className="at-col"
                    mode="selector"
                    range={prices}
                    onChange={(e) => {
                      this.fetchyzlist('price', e)
                    }}
                  >
                    <View className="picker">报酬</View>
                  </Picker>
                </View>
              </View>

              <View className="box">
                {records && records.length > 0 ? (
                  records.map((item, i) => (
                    <View key={i} className="item">
                      <View
                        onClick={() => {
                         
                            Taro.navigateTo({
                              url: `/pages/index/serviceDetail?id=${item.id}&price=${item.price}&isPhotographer=1`,
                            })
                          
                        }
                        }
                      >
                        <View className="info">
                          <View className="info1">
                            <Image src={getImageUrl(item.headPic)}></Image>
                            <View>
                              <Text>
                                {item.name}
                                <Text className={item.sex ? 'man' : ''}></Text>
                              </Text>
                              {item.area}
                            </View>
                          </View>
                      <View>提供报酬：{item.priceType ? `¥${item.price}` : '无'}</View>
                        </View>

                        <View className="image">
                          <View className="text">{item.detail}</View>
                          <View className="img">
                            <Image
                              mode="heightFix"
                              src={getImageUrl(item.imgPath)}
                            ></Image>
                            <View className="badge">new</View>
                          </View>
                        </View>
                      </View>

                      <View className="price">
                        <Text>当前{item.count}人申请</Text>
                        <View>
                          {isTruthUser && <AtButton
                            type="primary"
                            size="small"
                            onClick={(e) => this.applyYZ(e, item)}
                            disabled={userId == item.userId || item.isBook}
                          >
                            验真申请
                          </AtButton>}
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
            </View>
          </View>
        </ScrollView>
        <AtModal isOpened={this.state.isOpenedArea}>
        <AtModalHeader>请选择地区</AtModalHeader>
          <AtModalContent>
          <View className="p">国家地区</View>
          <Picker
            mode="selector"
            range={this.state.country}
            onChange={this.onChangeCountry}
          >
            <View className="pickerArea">
              {this.state.countryed || '请选择国家'}
            </View>
          </Picker>
            <View>
              <View className="p">省份</View>
              <Picker mode="selector" range={this.state.province} onChange={this.onChangeProvince}>
                <View className="pickerArea">{this.state.provinceed || '请选择省份'}</View>
              </Picker>
            </View>
           <View className='p'>城市</View>
            <Picker mode='selector' range={this.state.city} onChange={this.onChangeCity} >
              <View className='pickerArea'>
                {this.state.cityed || '请选择城市'}
              </View>
            </Picker> 
           {this.state.showDistrict && <View>
              <View className='p'>区/县</View>
              <Picker mode='selector' range={this.state.district} onChange={(e) => this.setState({districted:this.state.district[e.target.value]})} >
                <View className='pickerArea'>
                  {this.state.districted || '请选择区/县'}
                </View>
              </Picker> 
             </View>} 

          </AtModalContent>
          <AtModalAction> <Button onClick={() => this.setState({isOpenedArea:false})}>取消</Button> <Button onClick={() => this.selectCity()}>确定</Button> </AtModalAction>
        </AtModal>
      
  </View>
    )
  }
}
