import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,Picker,Button } from '@tarojs/components'
import { AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction, } from "taro-ui"
import Request from '../../utils/request';

import {baseUrl} from '../../config';
import './area.scss'

export default class Area extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        isOpenedArea: props.visible,
        showDistrict: !props.hideDistrict
       

      })
    }

    state = {
      // eslint-disable-next-line react/no-unused-state
      country: [],
      countryed: '中国',
      province:[], 
      provinceed: '',
      city:[],
      cityed: '',
      districted:'',
      showDistrict:false,

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
        
      } else {
        
        data.area = data.city;
        data.city = data.province;
        
      }

      if(!data.area && !this.props.hideDistrict){
        Taro.showToast({
          title: '请选择地区',
          icon: 'none',
          mask: true,
        });
        return false
      }

      this.setState({ isOpenedArea: false })
      this.props.onOk && this.props.onOk({ data,showDistrict });

    }
  
    showArea(){
      this.setState({ isOpenedArea: true })
     this.onChangeCountry()
  
    }
  
  
    onChangeCountry = () => {
      // if (e.target.value == 0) {
      //   this.setState({
      //     provinceed: '北京市,北京市,东城区',
      //   })
      // }
      
      Request(
        {
          url: baseUrl+'area/province',
          method: 'get',
          data:{id:1}
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
           
            // eslint-disable-next-line react/no-unused-state
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
              // eslint-disable-next-line react/no-unused-state
              districts,
              districted:'',
              showDistrict:true
            })
          }  
        },
      )
    }

    onClose(){
      this.setState({ isOpenedArea: false });
      this.props.onClose && this.props.onClose()
    }



    render () {
     // console.log(this.state.isOpenedArea,98989)
      //  console.log(this.state.provinceed,this.props.hideDistrict,112222444)


        return (
          <AtModal isOpened={this.state.isOpenedArea} closeOnClickOverlay={false} onClose={() =>  this.onClose()}>
          <AtModalHeader>请选择地区</AtModalHeader>
            <AtModalContent>
            
              <View>
                <View className='p'>省份</View>
                <Picker mode='selector' range={this.state.province} onChange={this.onChangeProvince}>
                  <View className='pickerArea'>{this.state.provinceed || '请选择省份'}</View>
                </Picker>
              </View>
             <View className='p'>城市</View>
              <Picker mode='selector' range={this.state.city} onChange={this.onChangeCity} >
                <View className='pickerArea'>
                  {this.state.cityed || '请选择城市'}
                </View>
              </Picker> 
             {this.state.showDistrict && !this.props.hideDistrict && <View>
                <View className='p'>区/县</View>
                <Picker mode='selector' range={this.state.district} onChange={(e) => this.setState({districted:this.state.district[e.target.value]})} >
                  <View className='pickerArea'>
                    {this.state.districted || '请选择区/县'}
                  </View>
                </Picker> 
               </View>} 
  
            </AtModalContent>
            <AtModalAction> <Button onClick={() => this.onClose()}>取消</Button> <Button onClick={() => this.selectCity()}>确定</Button> </AtModalAction>
          </AtModal>
  
        )
    }
}
