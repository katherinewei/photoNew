import Taro, { Component } from '@tarojs/taro'
import { View, Text,Picker ,Input } from '@tarojs/components'
import Request from '../../utils/request';
import {getAccessToken} from '../../utils/help'
import './index.scss'
import { AtList, AtListItem,AtImagePicker,AtTextarea ,AtButton,AtForm,AtActivityIndicator } from "taro-ui"
import { ImageUrl } from '../../config'; 

export default class publishService extends Component {

    config = {
        navigationBarTitleText: '发布验真报告'
    }

    state = {

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
   const {comment,files } = this.state;
   let imgPath = ''
   if(files.length > 0){
     imgPath = [];
     files.map(item => {
       let url = item.url.replace(ImageUrl,"");
       imgPath.push(url)
     })
     imgPath = imgPath.join(',')
   }
   if(!comment){
     Taro.showToast({
       title: '请填写您的约拍感受',
       icon: 'none',
       mask: true,
     });
     return false
   }


   const data = {
     comment,
     imgPath,
     id: this.$router.params.id// todo 需修改
   }

   console.log(data)
   // 发送数据
   Request({
     url: 'photo-speech',
     method: 'POST',
     data,
   },(data) => {
       console.log(data)
       Taro.showToast({
         title: `发布成功`,
         icon: 'none',
         mask: true,
       });

       setTimeout(() => {
         Taro.navigateBack({delta: 1})
       },1000)


   })

 }


    render () {

        return (
            <View className='publishService'>
            <AtForm
              onSubmit={this.onSubmit.bind(this)}

            >

            <View className='h'>请真实公正地描述一下您的约拍感受</View>

            <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
              maxLength={300}
              placeholder='摄影师的拍摄质量与提供的服务是否属实，您的体验结果...'
              value={this.state.comment}
              onChange={(e) => {this.setState({comment:e})}}
            />


              <View className='h'>上传您的样片与当天的花絮<Text>（最多12张，大小不超过10MB）</Text></View>

              <AtActivityIndicator mode='center' isOpened={this.state.loading} content='上传中...'></AtActivityIndicator>
              <AtImagePicker
                 files={this.state.files}
                 onChange={this.onChangeFile.bind(this)}
                showAddBtn={this.state.files.length < 13}
               />



                  <AtButton type='primary' formType='submit'>发布</AtButton>

                   </AtForm>
            </View>
        )
    }
}
