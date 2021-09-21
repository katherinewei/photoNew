import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import './publishService.scss'
import {
  AtImagePicker,
  AtTextarea,
  AtButton,
  AtForm,
  AtActivityIndicator,
  AtInput,
  AtIcon,AtTag
} from 'taro-ui'
import { baseUrl } from '../../config'

export default class publishService extends Component {
  config = {
    navigationBarTitleText: '发布返片',
    navigationBarBackgroundColor: '#fff',
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
            url: baseUrl + 'api/img',
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
              files[i].url = data.data.path

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
            maxLength={300}
            placeholder="添加正文"
            name="detail"
            value={this.state.detail}
            onChange={(e) => {
              this.setState({ detail: e })
            }}
          />
          <AtInput
            className="input"
            type="number"
            title='联系方式' 
            placeholder="请输入电话"
            name="phone"
            value={this.state.phone}
            onInput={(e) => {
              this.setState({ phone: e.target.value })
            }}
          />
          </View>
          <View className="formCont" style="margin-bottom:10px">
          <View className="setNumber">
            设置摄影师联系限量
            <View className="number" onClick={() => this.expand()}>{numValue}人<AtIcon value='chevron-down' size='10' color='#fff' ></AtIcon>
            <View className={(numShow?'show' : '') + ` options`}>{nums.map(item=> (<View onClick={e => this.setNum(e,item)} className="option">{item}人</View>))}</View>
            </View>
          </View>
          <View className="tip">* 摄影师可在摄影师端联系约拍您，设置获取您联系方式的摄影师数量,免除过多打扰</View>
          </View>
          <View className="formCont" style="margin-bottom:10px">
            <View className="type">关联类型<View className="chooseType" onClick={() => Taro.navigateTo({url: `/pages/index/associationType?type=1`})}>{typeSelect || typeSelect === 0 ? 
            <AtTag  size="small" type='primary'  circle  >{types[typeSelect]}<AtIcon value='close' size='8' color='#333' onClick={(e) => this.cancelSelect(e)}></AtIcon></AtTag> : '关联合适的类型获得更多曝光'}<AtIcon value='chevron-right' size='14' color='#333'></AtIcon></View></View>
          </View>
          <View className="formCont">
            <View className="type">关联标签<View className="chooseType" onClick={() => Taro.navigateTo({url: `/pages/index/associationType?type=2`})}>
            {tagSelect || tagSelect === 0 ? 
            <AtTag  size="small" type='primary'  circle  >{tags[tagSelect]}<AtIcon value='close' size='8' color='#333' onClick={(e) => this.cancelSelect(e)}></AtIcon></AtTag> : '去选择'}
            <AtIcon value='chevron-right' size='14' color='#333'></AtIcon></View></View>
            <View className="tip">* 所有上传图片需向平台保证拥有合法版权，如因用户上传产生的相关纠纷，造成相关损失，平台将有权利进行处理。</View>
          </View>
         
          
         

          <AtButton type="primary" formType="submit">
            发布
          </AtButton>
        </AtForm>
      </View>
    )
  }
}
