import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import '../index/detail.scss'
import {getImageUrl} from '../../utils/help';
import { AtButton   } from 'taro-ui'
export default class appointmentDetail extends Component {

    config = {
        navigationBarTitleText: '预约详情'
    }

    componentWillMount () {
      const id =  this.$router.params.id
      Request({
        url: 'photo-subscribe-detail',
        method: 'put',
        data:{id}
      },(data) => {
          let detail = data.data
          if(detail.imgPath){

            detail.imgPath = detail.imgPath.split(',')
          } else {
             detail.imgPath = []
          }

          this.setState({data:detail,type:detail.status})
      })

    }

    componentDidMount () {




    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    onSubmit(){
      const {data} = this.state;
      const {id} =  this.$router.params
      Request({
        url: 'photo-subscribe-sure', 
        method: 'POST',
        data:{id,serviceId:data.serviceId}
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

      console.log(data)

        return (
          data && data.serviceId ?   <View className='appointmentDetail'>
                <View className='head'>
                  <View className="info">
                    <View  className="info1">
                      <Image src={getImageUrl(data.headPic)} ></Image>
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

                  {data && data.imgPath && data.imgPath.length > 0 ? data.imgPath.map((item,i) => (
                      <Image  mode="widthFix" src={getImageUrl(item)}  style={{marginTop:'5px'}}></Image>
                  )):<view></view>}

                      <View className='p' style={{marginTop:'40rpx'}}>
                      {data.condition}

                      </View>
                  </View>
                 {/* {!type &&  <AtButton type="primary" onClick={() => this.onSubmit()}>确定邀请</AtButton>} */}
                </View>

            </View>:''
        )
    }
}
