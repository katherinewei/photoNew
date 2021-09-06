import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import '../user/index.scss'
import {AtForm,AtTextarea ,AtButton } from "taro-ui"


export default class Index extends Component {

    config = {
        navigationBarTitleText: '投诉'
    }



    constructor () {
      super(...arguments)
      this.state = {
        message:'',
        prevent:false
      }
    }


    componentWillMount () {





    }

    componentDidMount () {




    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    onSubmit(){
      const {id,page,type} = this.$router.params
      const {message,prevent} = this.state;
      if(prevent){
        return false
      }

      if(!message){
        Taro.showToast({
          title: '请输入投诉内容',
          icon: 'none',
          mask: true,
        });
        return false
      }
      this.setState({prevent:true})
      Request({
        url: 'photo-complain',
        method: 'post',
        data:{message:this.state.message,id,type}
      },(data) => {
        this.setState({prevent:false})
        Taro.showToast({
          title: '投诉成功',
          icon: 'success',
          mask: true,
        });

        setTimeout(() => {
          Taro.navigateBack({delta: 1})
        },1000)



      })
    }




    render () {


        return (
            <View className='Info'>
              <View className="title">投诉</View>

              <AtForm
                onSubmit={this.onSubmit.bind(this)}
                className="form"
              >
                <AtTextarea
                  maxLength={200}
                  placeholder='请输入投诉建议'
                  value={this.state.message}
                  onChange={(e) => {this.setState({message:e})}}
                />

                <AtButton type='primary' formType='submit'>提交</AtButton>
        </AtForm>




          </View>
        )
    }
}
