import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import {getImageUrl} from '../../utils/help';
import '../index/detail.scss'
import { AtButton   } from 'taro-ui'
export default class applicationDetail extends Component {

    config = {
        navigationBarTitleText: '申请详情'
    }

    componentWillMount () {
      const id =  this.$router.params.id
      const type = Number(this.$router.params.type);
      Request({
        url: 'photo-subscribe-detail',
        method: 'PUT',
        data:{id,type:2}
      },(data) => {
        let detail = data.data
        if(detail.imgPath){
          detail.imgPath = detail.imgPath.split(',')
        }
        else {
          detail.imgPath = []
       }
        this.setState({data:detail,type})
      })
    }

    componentDidMount () {


 

    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onSubmit(){
      const {type} = this.state;
      if(type){
        return false
      }

      
      const {id,serviceId} =  this.$router.params
      Request({
        url: 'photo-truth-sure',
        method: 'POST',
        data:{id}
      },(data) => {
        Taro.showToast({
          title: '邀请成功',
          icon: 'success',
          mask: true,
        });
        this.setState({type:1})
      })
    }


    render () {
        const {data,type} = this.state
   
        return (
          data &&   <View className='appointmentDetail'>
                <View className='head'>
                  <View className="info">
                    <View  className="info1">
                      <Image src={getImageUrl(data.headPic)}  ></Image>
                      <View>
                          <Text>{data.userName}<Text  className={data.sex ? 'man' : ''}></Text></Text>
                      期望拍摄日期：{data.expectedDate}
                      </View>
                    </View>
                    <View className="right">
                    <View>手机：{data.mobile}</View>
                    <View >微信：{data.wxNumber}</View>
                    </View>
                  </View>
                </View>
                <View className='content'>
                  <View className='imgs'>

                  {data.imgPath && data.imgPath.length > 0 && data.imgPath.map((item,i) => (
                      <Image mode="widthFix" src={getImageUrl(item)} key={i} style={{marginTop:'5px'}}></Image>
                  ))}

                      {data.detail}
                      <View className='p' style={{marginTop:'40rpx'}}>
                      {data.introduction}

                      </View>
                  </View>
                  <AtButton type="primary" onClick={() => data.status == 0 && this.onSubmit()}>{data.status ? '已邀请':'确定邀请'}</AtButton>

                </View>

            </View>
        )
    }
}
