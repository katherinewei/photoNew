import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../utils/request';
import './area.scss'
import {baseUrl} from '../config';
import { AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction, } from "taro-ui"

export default class Area extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        isOpenedArea: props.visible,
        country: [],
        countryed: '',
        province:[], 
        provinceed: '',
        city:[],
        cityed: '',
        districted:'',
        showDistrict:false,

      })
    }


    componentWillMount () {

    }

    componentDidMount () {


    }

    componentWillReceiveProps(nextProps) {
      
     // console.log(nextProps.visible,741474)
      if(nextProps.visible){
        this.showArea()
      }
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    //省市选择
    selectCity() {
      const {provinceed,cityed,districted,countryed,showDistrict} = this.state;
      const data = {
        province:provinceed,
        city:cityed,
        area:districted,
        country:countryed
      }
      if(showDistrict){
        if(!data.area){
          Taro.showToast({
            title: '请选择地区',
            icon: 'none',
            mask: true,
          });
          return false
        }
      } else {
        if(!data.city){
          Taro.showToast({
            title: '请选择地区',
            icon: 'none',
            mask: true,
          });
          return false
        }
      }
      this.setState({ isOpenedArea: false })
      this.props.onOk && this.props.onOk({ data,showDistrict });

    }
  
    showArea(){
      this.setState({ isOpenedArea: true })
      Request(
        {
          url: baseUrl+'area/country',
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
          url: baseUrl+'area/province',
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
          url: baseUrl+'area/city',
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
          url: baseUrl+'area/district',
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



    render () {
     // console.log(this.state.isOpenedArea,98989)
        

        return (
          <AtModal isOpened={this.state.isOpenedArea} closeOnClickOverlay={false} onClose={ () =>  {this.setState({ isOpenedArea: false })} }>
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
  
        )
    }
}