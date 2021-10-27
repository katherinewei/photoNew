import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text,Picker } from '@tarojs/components'
import {  AtInput ,AtButton, AtList, AtListItem } from "taro-ui"
import Request from '../../utils/request';
import './register.scss'
import '../../components/common.scss'



import ImageUpload from '../../components/imageUpload';

export default class Register extends Component {



    constructor () {
      super(...arguments)

    }

    state = {
      current: 0,
      files:[],
      name:'',
      sex:'',
      idcard:'', wxCode:'',cameraCode:'',cameraName:'',files1:[],files2:[],check:0,
      ways: [
        // {title:'诚信服务',text:'保证金签约',price:'300'},
        // {title:'官方免费提供安卓设备，参与到功能改进中',text:'安卓测试官签约',price:'600'},
        {title:'凭实力证明自己',text:'先试用 ',price:''}]

    }


    componentWillMount () {

    }

    componentDidMount () {


    }


    onNext () {

      const {name, sex, idcard, wxCode,current,cameraCode,cameraName,files,files1,files2,ways,check} = this.state
        if(current === 2){
          let cameraNumImgUrl =files1.map((item) => item.url).join('')
          let cameraImgUrl =files2.map((item) => item.url).join('')
          let wxImgUrl =files.map((item) => item.url).join('')
          const $instance = Taro.getCurrentInstance()
          Request(
            {
              url: 'api/wxNewUserUpdateInfo',
              method: 'POST',
              data: { 
                id:$instance.router.params.id,
                camera:cameraName,cameraImgUrl,cameraNum:cameraCode,cameraNumImgUrl,identityNum:idcard,realName:name,sex:sex=== '女' ? 1 : 2,wxImgUrl,
                depositAmount:ways[check].price, wxNum:wxCode},
              //isToken:false
            },
            (data) => {
              if(data.code === 200){
                Taro.redirectTo({url: `/pages/user/registerFinish`})
               
              } else {
                Taro.showToast({
                  title: data.msg,
                  icon:'none',
                  mask: true
                });
              }
              
            },
          )
          return false
        }

        if(current === 0){
          if (!name) {
            Taro.showToast({
              title: '请输入姓名',
              icon: 'none',
              mask: true,
            })
            return false
          }
          if (!sex) {
            Taro.showToast({
              title: '请输入性别',
              icon: 'none',
              mask: true,
            })
            return false
          }
          if (!idcard) {
            Taro.showToast({
              title: '请输入身份证',
              icon: 'none',
              mask: true,
            })
            return false
          }
          if (!wxCode) {
            Taro.showToast({
              title: '请输入微信号',
              icon: 'none',
              mask: true,
            })
            return false
          }
        }
        else if(current === 1){
          if (!cameraName) {
            Taro.showToast({
              title: '请输入相机名称',
              icon: 'none',
              mask: true,
            })
            return false
          }
          if (!cameraCode) {
            Taro.showToast({
              title: '请输入相机编码',
              icon: 'none',
              mask: true,
            })
            return false
          }
        }
        this.setState({
          current:current+1
        })
      
      
     
    }

    onPrev(){
      this.setState({
        current:this.state.current-1
      })
    }





    render () {
      const items = [
        { 'title': '个人信息' },
        { 'title': '器材信息' },
        { 'title': '签约选择' }
      ]
      const {current,check,ways} = this.state
        return (
           <View className='register'>
               <View  className='steps'> {items.map((item,i )=> (<View key={i} className={(i <= current ? 'active' :'') + " step"}>{item.title}</View>))}</View>
                
               {current === 0 &&
               <View>
                 <View className='content'>
                  <View className='formCont'>
                    <View className='txt-title'>上传微信二维码</View>  
                    <ImageUpload single onOk={e => this.setState({files:e.files})} />
                  </View>
                  <View className='formCont'>
                  <AtInput
                    className='input'
                    title='真实姓名' 
                    placeholder='请输入'
                    name='name'
                    value={this.state.name}
                    onChange={(e) => {
                      
                      this.setState({ name: e})
                    }}
                  />
                  </View>
                  <View className='formCont'>

                  <Picker mode='selector' range={['女','男']} onChange={(e) => {
                    console.log(e)
                      this.setState({ sex: e.detail.value === '1' ? '男' :'女' })
                    }}
                  >
                    <AtList>
                      <AtListItem
                        title='性别'
                        extraText={this.state.sex || '请选择'}
                        className={`${this.state.sex ? 'selected':''}`}
                      />
                    </AtList>
                  </Picker>

                  
                  </View>
                  <View className='formCont'>
                  <AtInput
                    
                    className='input'
                    type='idcard'
                    title='身份证号' 
                    placeholder='请输入'
                    name='idcard'
                    value={this.state.idcard}
                    onChange={(e) => {
                      this.setState({ idcard: e })
                    }}
                  />
                  </View>
                  <View className='formCont'>
                  <AtInput
                    
                    className='input'
                    type='wxCode'
                    title='微信号' 
                    placeholder='请输入'
                    name='wxCode'
                    value={this.state.wxCode}
                    onChange={(e) => {
                      this.setState({ wxCode: e })
                    }}
                  />
                  </View>
                  
                </View>
                <Text className='tip'>温馨提示:证件信息仅用于认证摄影师真实有效，我们会竭力保护每位摄影师的信息安全!</Text>
                </View>} 
                {current === 1 &&
                  <View>
                    <View className='content'>
                      <View className='formCont'>
                        <View className='txt-title'>上传相机编码</View>  
                          <ImageUpload single onOk={e => this.setState({files1:e.files})} />
                        </View>
                      <View className='formCont'>
                        <View className='txt-title'>上传相机正面图</View>  
                          <ImageUpload single onOk={e => this.setState({files2:e.files})} />
                      </View>
                      <View className='formCont'>
                        <AtInput
                          className='input'
                          title='相机名称' 
                          placeholder='请输入'
                          name='name'
                          value={this.state.cameraName}
                          onChange={(e) => {
                            
                            this.setState({ cameraName: e})
                          }}
                        />
                      </View>
                      <View className='formCont'>
                          <AtInput
                            className='input'
                            title='相机编码' 
                            placeholder='请输入'
                            name='cameraCode'
                            value={this.state.cameraCode}
                            onChange={(e) => {
                              this.setState({ cameraCode: e })
                            }}
                          />
                        </View>
                    </View>
                  </View>     
                  }
                  {current === 2 &&
                  <View>
                    <View className='content'>
                      <View className='txt-title'>我们提供{ways && ways.length}种方式</View>  
                      {ways && ways.map((item,i) => (<View className='box' key={i}>
                        <View className='txt-subTitle'>· {item.title}</View>
                        <View className={`${check === i ? 'active' : ''} price`} onClick={() => this.setState({check:i})}>
                          <View>{item.text}{item.price ? '￥' :''} <text>{item.price}</text></View>
                          </View>
                        </View>))}
                    </View>
                  </View>}  
                <View className='foot'>
                  {current !== 0 && <View><AtButton size='small' type='primary' circle  onClick={() => this.onPrev()}>上一步</AtButton></View>}
                  <View><AtButton size='small' type='primary' circle  onClick={() => this.onNext()}>下一步</AtButton></View>
                </View>
          </View>
          
        )
    }
}
