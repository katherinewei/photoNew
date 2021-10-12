import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import './recruitment.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtInput ,AtButton } from "taro-ui"
import Area from '../../components/area';
import '../../components/common.scss'
import Countdown from '../../components/countdown';
export default class Recruitment extends Component {

    config = {
        navigationBarTitleText: '摄影师招募',
        navigationBarBackgroundColor: '#fff',
    }



    constructor () {
      super(...arguments)
      this.setState ({
        phone:'',
        code:'',
        sended:false,
        isOpenedArea:false,
        curAddr:'',
        province:'', 
        city:'',
        district:''

      })
    }


    componentWillMount () {
      clearInterval(this.backInterval)
    }

    componentDidMount () {


    }



    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    handleChange(){

    }
    onTimeUp () {
      this.setState({ sended: false })
    }

    //省市选择
    selectCity(e) {
      const {province,city,area} = e.data;
      let curAddr =  `${province} ${city}  ${area}`
      
       this.setState({ isOpenedArea: false,curAddr,province, city,district:area})
     }

     join(){
      const {phone,code,curAddr,province, city,district} = this.state
      console.log(phone,code)
       if(!phone){
        Taro.showToast({
          title: '请输入手机号',
          icon: 'none',
          mask: true,
        });
        return false
       }
       if(!code){
        Taro.showToast({
          title: '请输入验证码',
          icon: 'none',
          mask: true,
        });
        return false
       }
       if(!curAddr){
        Taro.showToast({
          title: '请选择地区',
          icon: 'none',
          mask: true,
        });
        return false
       }

       const data = {province, city,district,mobile:phone,verificationCode:code,password:'a123456'}

       // 发送数据
      Request(
        {
          url: 'api/wxNewUserSaveInfo',
          method: 'POST',
          data,
        },
        (data) => {
          if(data.code === 200){
            Taro.navigateTo({url: `/pages/user/register?id=${data.data.id}`})
          } else {
            Taro.showToast({
              title: data.msg,
              icon:'none',
              mask: true
            });
          }
         
        },
      )

       



     }



    render () {
        
      const {sended,phone,code,curAddr} = this.state
        return (
            <View className='user recruitment'>
                <View className="container">
                  <View className="title">完善信息加入摄影师行列</View>
                  <AtInput
                    name='phone'
                    border={false}
                    title=''
                    type='phone'
                    placeholder='手机号码'
                    value={phone}
                    onChange={(e) =>{this.setState({phone:e})}} 
                    className="inputCustomize phone"
                    placeholderClass="phcolor"
                  />

                  <AtInput
                    clear
                    title=''
                    type='number'
                    placeholder='验证码'
                    value={code}
                    onChange={(e) => {this.setState({code:e})}}
                    className="inputCustomize code"
                    placeholderClass="phcolor"
                  >
                      <Countdown phone={phone} />

                    
                  </AtInput>
                  <View className="inputCustomize area"  onClick={() => {this.setState({isOpenedArea:true})} }>
                 <Text className={curAddr ? 'active' : ''}> {curAddr?curAddr:'选择地区'}</Text>
                  </View>
                  

                </View>
                <View className="tip">摄影师加盟基础要求</View>

                <Area visible={this.state.isOpenedArea} onOk={e=>this.selectCity(e)} onClose={() => {this.setState({isOpenedArea:false})}}></Area>
                <View className="foot">
                <AtButton size="small" type="primary" circle  onClick={() => this.join()}>我要加入</AtButton>
                </View>
          </View>
        )
    }
}
