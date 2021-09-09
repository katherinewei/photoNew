import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import '../index/publishService.scss'
import {
  AtImagePicker,
  AtTextarea,
  AtButton,
  AtForm,
  AtActivityIndicator,
  AtInput,
  AtIcon,AtTag
} from 'taro-ui'
import { ImageUrl } from '../../config'

export default class evaluation extends Component {
  config = {
    navigationBarTitleText: '评价',
    navigationBarTextStyle: 'white',
  }

  state = {
    files: [],
    phone: '',
    loading: false,
    types:['写真约拍','婚纱摄影','商务公关','商业广告'],
    tags:['个人写真','情侣写真','证件形象','汉服古风','儿童写真','cosplay','毕业照','全家福'],
    typeSelect:Number(Taro.getStorageSync('typeId')),
    tagSelect:Number(Taro.getStorageSync('tagId')),
    numShow:false,
    numValue: 5
  
  }
  componentWillMount() {}

  componentDidMount() {
    
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  
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

  //提交
  onSubmit() {
    let {
    
     
      files,
      title,
      detail,
      phone,
      price,
     
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

    if (!/^1[3456789]\d{9}$/.test(phone)) {
      Taro.showToast({
        title: '输入正确的手机号码',
        icon: 'none',
        mask: true,
      })
      return false
    }
    let type = 1
   
    const data = {
     
     
      type,
     
     
      imgPath,
      title,
      detail,
      phone,
      price,
      status: 0,

    }

    console.log(data)
    // 发送数据
    Request(
      {
        url: 'photo-service',
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
          // Taro.navigateBack({delta: 1})
          Taro.redirectTo({
            url: `/pages/index/index`,
          })
        }, 1000)
      },
    )
  }

  cancelSelect(e,type){

    e.stopPropagation()
    if(type ===1){
      Taro.removeStorageSync('typeId')
    } else {
      Taro.removeStorageSync('tagId')
    }

    
  }
  expand(){
    this.setState({numShow:!this.state.numShow})
    
  }
  setNum(e,item){
    e.stopPropagation()
    this.setState({numValue:item})
    this.expand()

  }
  
 
  render() {

    const {typeSelect,tagSelect,types,tags,numShow,numValue} = this.state

    const nums = [0,5,10,15]

    
    

    return (
      <View className="publishService">
        <AtForm onSubmit={this.onSubmit.bind(this)} className="form">
          <View className="formCont">
          <AtActivityIndicator
            mode="center"
            isOpened={this.state.loading}
            content="上传中..."
          ></AtActivityIndicator>
          <AtImagePicker
            files={this.state.files}
            onChange={this.onChangeFile.bind(this)}
            showAddBtn={this.state.files.length < 10}
            multiple
          />
          <AtInput
            placeholder="添加标题会吸引更多人哦"
            value={this.state.title}
            name="title"
            onInput={(e) => {
              this.setState({ title: e.target.value })
            }}
          />
          <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
            count={false}
            maxLength={300}
            placeholder="添加正文"
            name="detail"
            value={this.state.detail}
            onChange={(e) => {
              this.setState({ detail: e })
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
