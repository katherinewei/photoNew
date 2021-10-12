import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import './publishService.scss'
import {
  getToken

} from '../../utils/help'
import {
  AtImagePicker,
  AtTextarea,
  AtButton,
  AtForm,
  AtActivityIndicator,
  AtInput,
  AtIcon,AtTag
} from 'taro-ui'
import { baseUrl,ImageUrl } from '../../config'
import ImageUpload from '../../components/imageUpload';
export default class publishService extends Component {
  config = {
    navigationBarTitleText: '发布返片',
    navigationBarBackgroundColor: '#fff',
  }

  state = {
    files: [],
    mobile: '',
    title:'',
    description:'',
    loading: false,
    cates:[],
    typeSelect: {},
    tagSelect: {},
    numShow:false,
    limitSize: 5
    
  }
  componentWillMount() {
   
  }

  componentDidMount() {
    getToken(() => {})
    this.fetchCate()
    console.log(this.$router.params.hasChoose,33333)
    if(!this.$router.params.hasChoose){
      Taro.removeStorageSync('typeId'); 
      Taro.removeStorageSync('tagId');

      Taro.removeStorageSync('mobile'); 
      Taro.removeStorageSync('title');
      Taro.removeStorageSync('description'); 
      Taro.removeStorageSync('limitSize');
      Taro.removeStorageSync('files');
      
    } else {
      this.setState({
        typeSelect:Taro.getStorageSync('typeId') ? JSON.parse(Taro.getStorageSync('typeId')) : {},
        tagSelect:(Taro.getStorageSync('tagId')) ? JSON.parse(Taro.getStorageSync('tagId')) : {},
        mobile:Taro.getStorageSync('mobile'),
        title:Taro.getStorageSync('title'),
        description:Taro.getStorageSync('description'),
        limitSize:Taro.getStorageSync('limitSize') || 5,
        files:Taro.getStorageSync('files') ? JSON.parse(Taro.getStorageSync('files')) : []

      },() => {
        console.log(this.state.files,878787)
      })
      
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  fetchCate(){
    // 品类
    Request(
      {
        url: 'api/category',
        method: 'GET',
        //isToken:false
      },
      (res) => {
      //  console.log(res.data,11110000)
      if(res.code === 200){
        this.setState({ cates:res.data},() => {
          // 获取返片
        //  this.fetchNotePage()
        })
      }

        else {
          Taro.showToast({
            title: res.msg,
            icon:'none',
            mask: true
          });
        }
      },
    )
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
      description,
      mobile,
      limitSize,
      typeSelect,
      tagSelect
    } = this.state
    let imgPath = []
    if (files.length > 0) {
     
      files.map((item) => {
        let url = item.url.replace(ImageUrl, '')
        imgPath.push(item.url)
      })

    }

    if(imgPath.length === 0){
      Taro.showToast({
        title: '请上传图片',
        icon: 'none',
        mask: true,
      })
      return false
    }

   // console.log(222,limitSize,imgPath)

    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Taro.showToast({
        title: '输入正确的手机号码',
        icon: 'none',
        mask: true,
      })
      return false
    }


    let address = Taro.getStorageSync('curAddr')
    let province = ''
    let city = ''
    if(address){
      address = JSON.parse(address)
      province = address[1]
      city = address[2]

    }


   
    const data = {
      imgUrlList:imgPath,
      title,
      description,
      mobile,
      limitSize,
      typeId:typeSelect.value,
      tagId:tagSelect.value,
      province,
      city
    }
    if(!data.typeId){
      Taro.showToast({
        title: '请关联类型',
        icon: 'none',
        mask: true,
      })
      return false
    }
    if(!data.tagId){
      Taro.showToast({
        title: '请关联标签',
        icon: 'none',
        mask: true,
      })
      return false
    }

    console.log(data)
    // 发送数据
    Request(
      {
        url: 'api/noteSave',
        method: 'POST',
        data,
      },
      (data) => {
        if(data.code === 200){
          Taro.showToast({
            title: '发布成功',
            icon: 'success',
            mask: true,
          })
          setTimeout(() => {
            // Taro.navigateBack({delta: 1})
            Taro.switchTab({
              url: `/pages/index/index`,
            })
          }, 1000)
        }else {
          Taro.showToast({
            title: data.msg,
            icon:'none',
            mask: true
          });
        }
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
    this.setState({limitSize:item})
    this.expand()
    
    Taro.setStorageSync('limitSize', item);
  }

  onClickType(){
    const types = this.state.cates.map(item => {
      return {value:item.id,label:item.dictVal}
    })
    Taro.removeStorageSync('tagId')
    
    Taro.navigateTo({url: `/pages/index/associationType?type=1&data=${JSON.stringify(types)}`})
  }

  onClickTage(){
    if(!this.state.typeSelect.value){ // 没有选择类型
      Taro.showToast({
        title: '请关联类型',
        icon: 'none',
        mask: true,
      })
      return false
    }
    let tags = []
    this.state.cates.map(item => {
      if(item.id === this.state.typeSelect.value){
        item.child.map(c => {
          tags.push({value:c.id,label:c.dictVal})
        })
      }
    })
    console.log(tags,7777)
    Taro.navigateTo({url: `/pages/index/associationType?type=2&data=${JSON.stringify(tags)}`})
  }
  
 
  render() {

    const {typeSelect,tagSelect,numShow,limitSize,cates,files} = this.state

    const nums = [0,5,10,15]

    const {hasChoose} = this.$router.params
    
    

    return (
      <View className="publishService">
        <AtForm onSubmit={this.onSubmit.bind(this)} className="form">
          <View className="formCont">
          <ImageUpload files={hasChoose ? Taro.getStorageSync('files') ? JSON.parse(Taro.getStorageSync('files')) : []:[]} onOk={e => {
            this.setState({files:e.files})
            Taro.setStorageSync('files', JSON.stringify(e.files));
            }} />
          <AtInput
            placeholder="添加标题会吸引更多人哦"
            value={this.state.title}
            name="title"
            onChange={(e) => {
              this.setState({ title: e })
              Taro.setStorageSync('title',  e);
            }}
          />
          <AtTextarea
            //  value={this.state.value}
            //  onChange={this.handleChange.bind(this)}
            maxLength={300}
            placeholder="添加正文"
            name="description"
            value={this.state.description}
            onChange={(e) => {
              this.setState({ description: e })
              Taro.setStorageSync('description',  e);
            }}
          />
          <AtInput
            className="input"
            type="phone"
            title='联系方式' 
            placeholder="请输入电话"
            name="mobile"
            value={this.state.mobile}
            onBlur={(e) => {
              this.setState({ mobile: e })
              Taro.setStorageSync('mobile',  e);
            }}
          />
          </View>
          <View className="formCont" style="margin-bottom:10px">
          <View className="setNumber">
            设置摄影师联系限量
            <View className="number" onClick={() => this.expand()}>{limitSize}人<AtIcon value='chevron-down' size='10' color='#fff' ></AtIcon>
            <View className={(numShow?'show' : '') + ` options`}>{nums.map(item=> (<View onClick={e => this.setNum(e,item)} className="option">{item}人</View>))}</View>
            </View>
          </View>
          <View className="tip">* 摄影师可在摄影师端联系约拍您，设置获取您联系方式的摄影师数量,免除过多打扰</View>
          </View>
          <View className="formCont" style="margin-bottom:10px">
            <View className="type">关联类型<View className="chooseType" onClick={() => this.onClickType()}>{typeSelect.value ? 
            <AtTag  size="small" type='primary'  circle  >{typeSelect.label}<AtIcon value='close' size='8' color='#333' onClick={(e) => this.cancelSelect(e)}></AtIcon></AtTag> : '关联合适的类型获得更多曝光'}<AtIcon value='chevron-right' size='14' color='#333'></AtIcon></View></View>
          </View>
          <View className="formCont">
            <View className="type">关联标签<View className="chooseType" onClick={() => this.onClickTage()}>
            {tagSelect.value ? 
            <AtTag  size="small" type='primary'  circle  >{tagSelect.label}<AtIcon value='close' size='8' color='#333' onClick={(e) => this.cancelSelect(e)}></AtIcon></AtTag> : '去选择'}
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
