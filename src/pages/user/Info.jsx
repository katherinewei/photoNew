import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtList, AtListItem } from "taro-ui"
import { ImageUrl } from '../../config';

export default class Index extends Component {

    config = {
        navigationBarTitleText: '修改资料'
    }



    constructor () {
      super(...arguments)
      this.state = {
        current: 0,
        index:0,
        nav:4,
        user:{},

      }
    }


    componentWillMount () {
      // 个人信息
          Request({
            url: 'user_info',
            method: 'get',

          },(data) => {

              this.setState({user:data.data})
              setUserInfo(data.data)
          })



    }

    componentDidMount () {




    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    handleClick(){
      console.log(this)
      const that = this;
      const {user} = that.state;
      
      Taro.chooseImage({
        success (res) {
          const tempFilePaths = res.tempFilePaths
          Taro.uploadFile({
            url: ImageUrl + '/wx/client/img',
            name: 'file',
            filePath: tempFilePaths[0],
           
            success (res){
              const data = JSON.parse(res.data)
              console.log(data.img)
             
              user.head_pic = data.img

              

              Request({
                url: 'photo-user',
                method: 'post',
                data:{avatarUrl:data.img}
              },(res) => {
                Taro.showToast({
                  title: '修改成功',
                  icon: 'success',
                  mask: true,
                });

                that.setState({user})



              })



            
            }
          })
        }
      })
    }




    render () {
      const {user} = this.state;


        return (
            <View className='Info'>
              <View className="title">基本信息</View>
              {user.id ? <AtList  className="list">
                <AtListItem title='头像' onClick={() => this.handleClick()}  extraThumb={getImageUrl(user.head_pic)} arrow='right'/>
                <AtListItem title='昵称' arrow='right'  extraText={user.wxName} onClick={() => {Taro.redirectTo({  url: `/pages/user/editName?value=${user.wxName}`})}}/>
                <AtListItem title='性别' extraText={user.sex ? '男': '女'} arrow='right'/>
                <AtListItem title='个人简介' extraText={user.introduction} arrow='right'  onClick={() => {Taro.redirectTo({  url: `/pages/user/editDesc?value=${user.introduction}`})}}/>
              </AtList>:''}





          </View>
        )
    }
}
