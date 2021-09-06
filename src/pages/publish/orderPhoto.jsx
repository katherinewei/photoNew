import Taro, { Component } from '@tarojs/taro'
import { View, Text,Picker,Input  } from '@tarojs/components'
import Request from '../../utils/request';
import {timeString} from '../../utils/help';

import './index.scss'
import {AtImagePicker,AtTextarea ,AtButton,AtForm ,AtActivityIndicator} from "taro-ui"
import { ImageUrl } from '../../config';



export default class publishService extends Component {

    config = {
        navigationBarTitleText: '拍照预约'
    }

    state = {

        dateSel: timeString(new Date().getTime()),
        files: [],
        loading:false

      }
    componentWillMount () {


    }

    componentDidMount () {


    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    onChange = e => {
      this.setState({
      dateSel: e.detail.value
    })
      }

      onChangeFile (files,operationType) {

        if (operationType === 'remove') {
          this.setState({
            files
          })
        }
  
  
        // console.log(files)
        //  this.setState({
        //    files
        //  })
        if (operationType === 'add') {
          files.map((item,i) => {
            if(!item.url.startsWith(ImageUrl)){
              const file = item
              console.log(file)
              this.setState({
                //files
                loading:true
              })
              const that = this;
              Taro.uploadFile({
                 url: ImageUrl + '/wx/client/img',
                 filePath: file.url,
                 name: 'file',
                 formData: {
                  file: files
                 },
                 header:{
                 //  Authorization : getAccessToken(),
                  'Content-Type':'multipart/form-data',
                  'accept':'application/json',
                 },
                 success (res){
                   const data = JSON.parse(res.data);
                   files[i].url = data.path;
     
                   
     
                   that.setState({
                     files,
                     loading:false
                   })
     
     
                   //do something
                 },
                 fail(){
                   console.log(1111)
                 }
               })
     
            }
          })
        }
     }

   onFail (mes) {
     console.log(mes)
   }
   onImageClick (index, file) {
     console.log(index, file)
   }


 //提交
 onSubmit(){
   const {condition,  wxName,  dateSel,files,mobile } = this.state;


   let imgPath = ''
   if(files.length > 0){
     imgPath = [];
     files.map(item => {
      let url = item.url.replace(ImageUrl,"");
       imgPath.push(url)
     })
     imgPath = imgPath.join(',')
   }




   const data = {condition,wxName,expectedDate:dateSel,imgPath,mobile,serviceId:this.$router.params.id}


   if(!wxName){
     Taro.showToast({
       title: '微信号不能为空',
       icon: 'none',
       mask: true,
     });
     return false
   }
   if(!mobile || !/^1[3456789]\d{9}$/.test(mobile)){
     Taro.showToast({
       title: '请填写正确的手机号',
       icon: 'none',
       mask: true,
     });
     return false
   }
   if(!dateSel){
     Taro.showToast({
       title: '请填写期望日期',
       icon: 'none',
       mask: true,
     });
     return false
   }


 //  console.log(data)
   // 发送数据
   Request({
     url: 'photo-subscribe',
     method: 'POST',
     data,
   },(data) => {
     Taro.showToast({
       title: '预约成功！',
       icon: 'success',
       mask: true,
     });

     setTimeout(() => {
      // Taro.navigateBack({delta: 1})
       Taro.redirectTo({
        url: '/pages/index/serviceDetail?id='+this.$router.params.id
      })
     },1000)


   })

 }

    render () {



        return (
            <View className='publishService'>

                <AtForm
                  onSubmit={this.onSubmit.bind(this)}
                >
                  <AtTextarea
                  //  value={this.state.value}
                  //  onChange={this.handleChange.bind(this)}
                    maxLength={300}
                    placeholder='说明一下您的需求和条件，比如年龄/身高，拍摄人数,以及 要询问或留言信息'
                    value={this.state.condition}
                    onChange={(e) => {this.setState({condition:e})}}
                  />

                        <View className='h'>上传您的样片</View>
                        <View className='desc mb'>别害羞，上传自拍与全身照，可以提供一些想拍的服装照片，便 于摄影师为你定制摄影方案!</View>
                        <AtActivityIndicator mode='center' isOpened={this.state.loading} content='上传中...'></AtActivityIndicator>
                        <AtImagePicker
                           files={this.state.files}
                           onChange={this.onChangeFile.bind(this)}
                         />


                        <View className='h'>填写以下信息方便摄影师直接联系您！</View>

                        <View className='p'>微信</View>
                        <Input class="input"  placeholder="请输入微信" value={this.state.wxName}  onInput={(e) => {this.setState({wxName:e.target.value})}}/>

                        <View className='p'>手机</View>
                        <Input class="input"  placeholder="请输入手机" value={this.state.mobile}  onInput={(e) => {this.setState({mobile:e.target.value})}}/>

                        <View className='h'>期望拍摄日期</View>
                        <View className='p'>日期</View>


                        <Picker mode='date' onChange={this.onChange} >
                         <View className='picker'>
                           {this.state.dateSel}
                         </View>
                       </Picker>

                        <View className='tips'>实际日期以您与摄影师最终商议为准</View>

                        <AtButton type='primary' formType='submit'>发布</AtButton>
                </AtForm>
            </View>
        )
    }
}
