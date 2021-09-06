import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
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
import './index.scss'
import {
  AtButton,
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
} from 'taro-ui'
import Tabs from '../../components/tab'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '拍好照',
  }

  componentWillMount() {
    // let areas = [[],[]]
    // Area[0].children.map(province => {
    //   areas[0].push(province.value)
    // })
    // areas[1].push(Area[0].children[0].children[0].value)

    this.setState({
      loading: true,
      current: 0,
      value: '',
      isOpened: false,
      isOpenedArea: false,
      records: [],
      Photographers: [],
      makeup: 0,
      cloth: 0,
      type: 0,
      price: 0,
      area: ['广东省', '广州市'],
      notfirstYz: {},
      priceModal: false,
      likeBtn: true, // 想拍
      currentSearch: {},
      country: [],
      countryed: '',
      province:[],
      provinceed: '',
      city:[],
      cityed: '',
      districted:'',
      showDistrict:false
      // initArea:[0,0], //默认地区
    })

    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }

  onChangeCity(value) {
    if (value.detail.column == 0) {
      const val = value.detail.value
      const { areas } = this.state
      Area[0].children.map((province, i) => {
        if (i == val) {
          areas[1] = []
          province.children.map((city) => {
            areas[1].push(city.value)
          })
        }
      })
      this.setState({ areas })
    }
  }

  componentDidMount() {
    getToken(() => this.fetchData(), true)

    // const that = this;
    // //const code = this.$router.params.code
    // const code = Taro.getStorageSync('userId')
    // Taro.login({
    //     success: function (res) {
    //       console.log(res)
    //       if (res.code) {
    //         //发起网络请求

    //         let data = {}
    //         if(code){
    //           data.id = code;
    //         } else {
    //           data.code = res.code
    //         }

    //         const login = () => {
    //           Request({
    //           //  url: 'wxLogin',
    //             //method: 'post',
    //             url: 'testLogin',
    //             method: 'get',

    //             data,
    //             isToken:false
    //           },(data) => {

    //            setAccessToken(data.data)
    //           //  setAccessToken(data.data.token)
    //             that.fetchData()

    //           })
    //         }

    //         login()

    // const callback = () => {
    //   Taro.getUserInfo({
    //     lang:'zh_CN',
    //     success: function(res) {

    //           var userInfo = res.userInfo
    //           var nickName = userInfo.nickName
    //           var avatarUrl = userInfo.avatarUrl
    //           var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //           var province = userInfo.province
    //           var city = userInfo.city
    //           var country = userInfo.country

    //           data.userName = nickName;
    //           data.headPic = avatarUrl;
    //           console.log(data,1111)
    //           login()

    //         }
    //       })
    // }

    // Taro.getSetting({
    //   success(res1) {
    //     console.log(res1)
    //     if (!res1.authSetting['scope.userInfo']) {
    //       Taro.authorize({
    //         scope: 'scope.userInfo',
    //         success () {
    //           console.log(111)
    //           callback()
    //         }
    //       })
    //     } else {
    //       console.log(2222)
    //       callback()
    //     }
    //   }
    // })

    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  }

  getPhoneNumber(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }

  fetchData() {
    //个人信息
    Request(
      {
        url: 'user_info',
        method: 'get',
        data: {
          //  code: res.code
          //    id:10000
        },
      },
      (data) => {
        setUserId(data.data.id)  
        setUserInfo(data.data)
        //console.log(data.data.wxName == '',555)
        // if(data.data.wxName == ''){
        //   console.log(Taro)
        //   // Taro.redirectTo({url: '/pages/index/login'})
        //   // return false
        // }
        this.setState({ user: data.data, isOpened: data.data.flag >= 2 })
      },
    )

    //摄影师列表
    Request(
      {
        url: 'photoer-list',
        method: 'GET',
        data: {
          //  code: res.code
          //    id:10000
        },
        isToken: false,
      },
      (data) => {
        this.setState({ Photographers: data.data.records })
      },
    )

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

  handleConfirm() {
    // 价格筛选
    const { priceMax, priceMin } = this.state
    const currentSearch = { priceMax, priceMin }
    this.setState({ currentSearch })
    Request(
      {
        url: 'photo-index',
        method: 'GET',
        data: currentSearch,
        //isToken:false
      },
      (data) => {
        this.setState({ ...data.data, priceModal: false })
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

  // 想拍
  handleLike(id) {
    if(validateLogin()){
      const { likeBtn, records } = this.state
      if (likeBtn) {
        this.setState({ likeBtn: false })
        Request(
          {
            url: 'photo-like',
            method: 'post',
            data: {
              serviceId: id,
            },
          },
          (data) => {
            records.map((item) => {
              if (item.id === id) {
                item.like = !item.like
                if (item.like) {
                  item.logCount += 1
                } else {
                  item.logCount -= 1
                }
              }
            })

            this.setState({ records, likeBtn: true })
          },
        )
      }
    }
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
      Photographers,
      records,
      notfirstYz,
      loading,
      priceModal,
      user,
      initArea,
      areas,
    } = this.state

    return (
      <View className="index">
        {/*<button type='primary' open-type='getUserInfo' onClick={()=>  this.getUserInfo()  }>获取用户信息</button>
        <button type='primary' open-type='getPhoneNumber' onClick={(e)=>  this.getPhoneNumber(e)  }>获取用户信息</button>*/}
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
            <View className="list">
              <View
                className="item"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/index/newPhotographer?isTruthUser=${user.isTruthUser}&userId=${user.id}`,
                  })
                }
              >
                <AtAvatar
                  circle
                  image={require('../../images/icon/photo.png')}
                ></AtAvatar>
                <text class={'add'}></text>验真约拍
              </View>

              {Photographers && Photographers.length > 0 ? (
                Photographers.map((item, i) => (
                  <View className="item" >
                    <AtAvatar
                      circle
                      image={getImageUrl(item.imgPath)}
                    ></AtAvatar>
                    {item.isNew ? <text class="new">new</text> : ''}

                    {item.name}
                  </View>
                ))
              ) : (
                <View></View>
              )}
            </View>
            <View className="title">
              <Text class="text">服务验真 约拍免费</Text>

              {user && user.isTruthUser == 0 && (
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
                  {/* <Picker className='at-col'  mode="region" onColumnchange={(e) => this.onChangeCity(e)} value={initArea} range={areas} onChange={(e)=>this.fetchyzlist('area',e)}>
                        <View className='picker'>
                         地点
                        </View>
                        
                     </Picker> */}

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
                    <View className="picker">价格</View>
                  </Picker>
                </View>
              </View>

              <View className="box">
                {records && records.length > 0 ? (
                  records.map((item, i) => (
                    <View  className="item">
                      <View
                        onClick={() =>
                          
                            Taro.navigateTo({
                              url: `/pages/index/serviceDetail?id=${item.id}&userId=${user.id}`,
                            })
                          
                         
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
                        </View>

                        <View className="image">
                          <View className="img">
                            <Image
                              mode="heightFix"
                              src={getImageUrl(item.imgPath)}
                            ></Image>
                            {item.flag && <View className="badge">已验真</View>}
                          </View>
                        </View>
                      </View>

                      <View className="price">
                        <Text>￥{item.price}</Text>
                        <View>
                          <View
                            onClick={() => this.handleLike(item.id)}
                            className={`heart ${item.like ? 'active' : ''}`}
                          ></View>
                          {item.logCount}想拍
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

                {/**/}
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
