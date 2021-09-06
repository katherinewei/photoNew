import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import './index.scss'
import {
  AtImagePicker,
  AtTextarea,
  AtButton,
  AtForm,
  AtActivityIndicator,
} from 'taro-ui'
import { ImageUrl } from '../../config'
import { typeS } from '../../utils/help'

export default class publishService extends Component {
  config = {
    navigationBarTitleText: '发布约拍验真',
  }

  state = {
    clothes: 0,
    makeup: 0,
    files: [],
    country: [],
    countryed: '',
    provinceed: '',
    cityed: '',
    typeed: '写真',
    title: '',
    detail: '',
    price: '0',
    phone: '',
    loading: false,
    priceType:0,
    priceDis:true,
    districted:'',
    showDistrict:false
  }
  componentWillMount() {}

  componentDidMount() {
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

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
    })
  }

  onChangeFile(files, operationType) {
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
        if (!item.url.startsWith(ImageUrl)) {
          const file = item
          console.log(file)
          this.setState({
            //files
            loading: true,
          })
          const that = this
          Taro.uploadFile({
            url: ImageUrl + '/wx/client/img',
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
              files[i].url = data.path

              that.setState({
                files,
                loading: false,
              })

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
  onFail(mes) {
    console.log(mes)
  }
  onImageClick(index, file) {
    console.log(index, file)
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

  onChangeType = (e) => {
    const val = e.detail.value

    this.setState({
      typeed: typeS[val],
    })
  }

  //提交
  onSubmit() {
    let {
      countryed,
      provinceed,
      cityed,
      districted,
      typeed,
      clothes,
      makeup,
      files,
      detail,
      price,
      sel_country,
      priceType
    } = this.state
    let imgPath = ''
    if (files.length > 0) {
      imgPath = []
      files.map((item) => {
        let url = item.url.replace(ImageUrl, '')
        imgPath.push(url)
      })
      imgPath = imgPath.join(',')
    }
    let type = 1
    typeS.map((item, i) => {
      if (item === typeed) {
        type = i + 1
      }
    })
    if (!price) {
      Taro.showToast({
        title: '请输入价格',
        icon: 'none',
        mask: true,
      })
      return false
    }
   
    const data = {
      country: countryed,
      area: districted,
      province: provinceed,
      city: cityed,
      type,
      clothesFlag: clothes ? 0 : 1,
      makeupFlag: makeup ? 0 : 1,
      imgPath,
      detail,
      price,
      status: 0,
      priceType
    }

    console.log(data)
    // 发送数据
    Request(
      {
        url: 'photo-truth',
        method: 'POST',
        data,
      },
      (data) => {
        Taro.showToast({
          title: '发布成功！',
          icon: 'success',
          mask: true,
        })
        setTimeout(() => {
          // Taro.navigateBack({delta: 1})
          Taro.redirectTo({
            url: `/pages/index/index`,
          })
        }, 1000)
      },
    )
  }


  render() {
    const clothesS = ['是的，我为客户提供服装', '不是的，客户需要自理服装']
    const makeupS = ['是的，我为客户提供化妆', '不是的，客户需要自理化妆']
    const rewardS = ['我选择互免验真', '我选择支付报酬']
    return (
      <View className="publishService">
        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <View className="title">发布约拍验真，邀请验真官！</View>
          <View className="desc">
            首次认证摄影师，需先完成服务验真，完成约拍，验真自提交样片
            后，方可自由发布服务。
          </View>
          <View className="h">您在何地拍摄？</View>
          <View className="p">国家地区</View>
          <Picker
            mode="selector"
            range={this.state.country}
            onChange={this.onChangeCountry}
          >
            <View className="picker">
              {this.state.countryed || '请选择国家'}
            </View>
          </Picker>
            <View>
              <View className="p">省份</View>
              <Picker mode="selector" range={this.state.province} onChange={this.onChangeProvince}>
                <View className="picker">{this.state.provinceed || '请选择省份'}</View>
              </Picker>
            </View>
           <View className='p'>城市</View>
            <Picker mode='selector' range={this.state.city} onChange={this.onChangeCity} >
              <View className='picker'>
                {this.state.cityed || '请选择城市'}
              </View>
            </Picker> 
           {this.state.showDistrict && <View>
              <View className='p'>区/县</View>
              <Picker mode='selector' range={this.state.district} onChange={(e) => this.setState({districted:this.state.district[e.target.value]})} >
                <View className='picker'>
                  {this.state.districted || '请选择区/县'}
                </View>
              </Picker> 
             </View>} 

          <View className="h">您提供的服务与类型？</View>
          <View className="p">类型</View>

          <Picker mode="selector" range={typeS} onChange={this.onChangeType}>
            <View className="picker">{this.state.typeed}</View>
          </Picker>

          <View className="p">您为客户提供服装吗？</View>

          <View className="radio">
            {clothesS.map((item, i) => (
              <View
                
                className={this.state.clothes == i && 'active'}
                onClick={() => this.setState({ clothes: i })}
              >
                {item}
              </View>
            ))}
          </View>

          <View className="p">您为客户提供化妆吗？</View>

          <View className="radio">
            {makeupS.map((item, i) => (
              <View
                
                className={this.state.makeup == i && 'active'}
                onClick={() => this.setState({ makeup: i })}
              >
                {item}
              </View>
            ))}
          </View>

          <View className="h">
            上传您的样片<Text>（最多9张，大小不超过10MB）</Text>
          </View>
          <AtActivityIndicator
            mode="center"
            isOpened={this.state.loading}
            content="上传中..."
          ></AtActivityIndicator>

          <AtImagePicker
            files={this.state.files}
            onChange={this.onChangeFile.bind(this)}
            showAddBtn={this.state.files.length < 10}
          />

          <View className="h">邀请说明</View>

          <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
            maxLength={300}
            placeholder="对验真官的要求与条件，可以拍摄的时间段等"
            value={this.state.detail}
            onChange={(e) => {
              this.setState({ detail: e })
            }}
          />

          <View className="p">
            提供报酬<Text>提供适当的报酬可以吸引更优质的验真官</Text>
          </View>

          <View className="p">
            <Text>选择报酬类型将决定验真期限：互免验真15天；提供报酬为30天。</Text>
          </View>

          <View className="radio">
            {rewardS.map((item, i) => (
              <View
                className={this.state.priceType == i && 'active'}
                onClick={() => {
                  this.setState({ priceType: i,price: i=== 0 ? '0' : '',priceDis:  i=== 0})
                }}
              >
                {item}
              </View>
            ))}
          </View>


          <Input
            class="input price"
            type="digit"
            placeholder="请输入价格"
            name="price"
            disabled={this.state.priceDis}
            value={this.state.price}
            onInput={(e) => {
              this.setState({ price: e.target.value })
            }}
          />

          <View className="tips">
            请在体验完成时与体验官结清报酬，支付方式自议
          </View>

          <AtButton type="primary" formType="submit">
            发布
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
