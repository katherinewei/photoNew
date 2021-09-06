import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {AtForm,AtTextarea ,AtButton } from "taro-ui"


export default class Index extends Component {

    config = {
        navigationBarTitleText: '修改昵称'
    }



    constructor () {
      super(...arguments)
      this.state = {
          name:''
      }
    }


    componentWillMount () {

      const name = this.$router.params.value

      this.setState({name})


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
        data:{nickname:this.state.name}
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
              <View className="title">编辑昵称</View>

              <AtForm
                onSubmit={this.onSubmit.bind(this)}
                className="form"
              >
                <AtTextarea

                  maxLength={25}
                  placeholder='请输入您的昵称'
                  value={this.state.name}
                  onChange={(e) => {this.setState({name:e})}}
                />

                <AtButton type='primary' formType='submit'>保存</AtButton>
        </AtForm>




          </View>
        )
    }
}
