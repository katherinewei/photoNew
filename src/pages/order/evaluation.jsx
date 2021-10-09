import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import '../index/publishService.scss'
import {
  AtTextarea,
  AtButton,
  AtForm,
  AtInput,
} from 'taro-ui'
import { ImageUrl,baseUrl } from '../../config'
import ImageUpload from '../../components/imageUpload';
export default class evaluation extends Component {
  config = {
    navigationBarTitleText: '评价',
    navigationBarTextStyle: 'white',
  }

  state = {
    files: [],
    phone: '',
    loading: false,
  
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
      title,
      content, 
    } = this.state
    let imgPath = ''
    if (files.length > 0) {
      imgPath = []
     // console.log(files)
      files.map((item) => {
        //let url = item.url.replace(ImageUrl, '')
        imgPath.push(item.url)
      })
     
    }
    const data = {
      commentImgUrlList:imgPath,
      title,
      content,
      tradeId:this.$router.params.id
    }
    console.log(data)
    // 发送数据
    Request(
      {
        url: 'api/wxCommentSave',
        method: 'POST',
        data,
      },
      (data) => {
        Taro.showToast({
          title: '发布成功',
          icon: 'success',
          mask: true,
        })
        setTimeout(() => {
           Taro.navigateBack({delta: 1})
         
        }, 1000)
      },
    )
  }


  
 
  render() {


    return (
      <View className="publishService">
        <AtForm onSubmit={this.onSubmit.bind(this)} className="form">
          <View className="formCont">

          <ImageUpload  onOk={e => {
            this.setState({files:e.files})
           
            }} />
          <AtInput
            placeholder="添加标题会吸引更多人哦"
            value={this.state.title}
            name="title"
            onChange={(e) => {
              this.setState({ title: e })
            }}
          />
          <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
            count={false}
            maxLength={300}
            placeholder="添加正文"
            name="content"
            value={this.state.content}
            onChange={(e) => {
              this.setState({ content: e })
            }}
            className="evaluationCon"
          />
          
          </View>
          <AtButton type="primary" formType="submit" className="evaluationBtn">
            发布评论
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
