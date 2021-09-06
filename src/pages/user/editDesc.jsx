import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {AtForm,AtTextarea ,AtButton } from "taro-ui"


export default class Index extends Component {

    config = {
        navigationBarTitleText: '修改个人简介'
    }



    constructor () {
      super(...arguments)
      this.state = {
          introduction:''
      }
    }


    componentWillMount () {

        const introduction = this.$router.params.value

        this.setState({introduction})



    }

    componentDidMount () {




    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    onSubmit(){
      Request({
        url: 'photo-user',
        method: 'post',
        data:{introduction:this.state.introduction}
      },(data) => {
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
          mask: true,
        });

        setTimeout(() => {
          Taro.redirectTo({  url: `/pages/user/Info`})
        },100)



      })
    }




    render () {


        return (
            <View className='Info'>
              <View className="title">编辑个人简介</View>

              <AtForm
                onSubmit={this.onSubmit.bind(this)}
                className="form"
              >
                <AtTextarea

                  maxLength={140}
                  placeholder='将同步于您的发布详情中'
                  value={this.state.introduction}
                  onChange={(e) => {this.setState({introduction:e})}}
                />

                <AtButton type='primary' formType='submit'>保存</AtButton>
        </AtForm>




          </View>
        )
    }
}
