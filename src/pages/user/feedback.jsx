import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View,  } from '@tarojs/components'
import { AtTextarea, AtButton, AtForm, AtInput,} from 'taro-ui'
import Request from '../../utils/request'
import '../index/publishService.scss'
import ImageUpload from '../../components/imageUpload';

export default class feedback extends Component {


  state = {
    files: [],
    // eslint-disable-next-line react/no-unused-state
    phone: '',
    // eslint-disable-next-line react/no-unused-state
    name:''
   
  }
  componentWillMount() {}

  componentDidMount() {
    
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}


  //提交
  onSubmit() {
    let {
      files,
      userName,
      contract,
      content
    } = this.state
    let imgUrlList = []
    if (files.length > 0) {
      imgUrlList = files.map(item => item.url )
    }

    if (!/^1[3456789]\d{9}$/.test(contract)) {
      Taro.showToast({
        title: '输入正确的手机号码',
        icon: 'none',
        mask: true,
      })
      return false
    }
    const data = {
      contract,
      imgUrlList,
      userName,
      content,
    }

    console.log(data)
    // 发送数据
    Request(
      {
        url: 'api/wxSuggestApply',
        method: 'POST',
        data,
      },
      (res) => {
        if(res.code === 200){
          Taro.showToast({
            title: '发布成功',
            icon: 'success',
            mask: true,
          })
          setTimeout(() => {
            // Taro.navigateBack({delta: 1})
            Taro.switchTab({
              url: `/pages/user/index`,
            })
          }, 1000)
        }else {
          Taro.showToast({
            title: res.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )
  }


 
  render() {
    return (
      <View className='feedback publishService'>
        <AtForm onSubmit={this.onSubmit.bind(this)} className='form'>
          <View className='formCont '>
            <View className='txt-title'>问题描述</View>  
            <AtTextarea
              //  value={this.state.value}
              //  onChange={this.handleChange.bind(this)}
              count={false}
              maxLength={300}
              placeholder='添加正文'
              name='detail'
              value={this.state.content}
              onChange={(e) => {
                this.setState({ content: e })
              }}
            />
           </View>
          <View className='formCont'>
           <View className='txt-title'>上传凭证</View>  
           <ImageUpload onOk={e => { this.setState({files:e.files})}} />
          </View>
          <View className='formCont noPadding'>
            <AtInput
              required
              className='input'
              title='联系人' 
              placeholder='请输入'

              value={this.state.userName}
              onChange={(e) => {
                this.setState({ userName: e })
              }}
            />
          </View>
          <View className='formCont noPadding'>
            <AtInput
              required
              type='phone'
              className='input'
              title='联系方式' 
              placeholder='请输入'
              name='phone'
              value={this.state.contract}
              onChange={(e) => {
                this.setState({ contract: e })
              }}
            />
          </View>
          
          
          
         
          <View className='foot'>
          <AtButton type='primary' formType='submit'>
            立即提交
          </AtButton>
          </View>
         
        </AtForm>
      </View>
    )
  }
}
