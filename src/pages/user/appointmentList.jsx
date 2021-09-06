import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl} from '../../utils/help';
import { AtButton   } from 'taro-ui'
export default class appointmentList extends Component {

    config = {
        navigationBarTitleText: '查看预约'
    }



    componentWillMount () {

        const serviceId =  this.$router.params.id
        Request({
          url: 'photo-subscribe-list',
          method: 'GET',
          data:{serviceId}
        },(data) => {
            this.setState({...data.data})
        })


    }

    componentDidMount () {




    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

   

    onScrollToLower(){
      const {pages,current,records} = this.state;
      if(pages > current){
        const id =  this.$router.params.id
        Request({
          url: 'photo-subscribe-userlist',
          method: 'GET',
          data:{id,page:current + 1}
        },(data) => {
            data.data.records = [...records,...data.data.records];
            this.setState({...data.data})
        })
      }
    }

    invite(item){

      if(item.type){
        return false
      }

      Request({
        url: 'photo-subscribe-sure',
        method: 'post',
        data:{id:item.id}
      },(data) => {
        Taro.showToast({
          title: '邀请成功',
          icon: 'success',
          mask: true,
        });
        const {records} = this.state;
        records.map(row => {
          if(row.id === item.id){
            item.status = 1
          }
        })
        this.setState({records})

      })
    }


    render () {
        const {records} = this.state;
        return (
            <View className='applicationList'>
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={0}
              style={{height: (Taro.getSystemInfoSync().windowHeight) + 'px'}}
              lowerThreshold={20}
              upperThreshold={20}
              onScrollToLower={this.onScrollToLower.bind(this)}
            >
                <View className='title'>
                    收到的预约
                  
                </View>
                <View className='list'>
                  {records && records.length > 0 && records.map((item,i) => (
                    <View className='box'>
                      <View className='img'>
                        <Image mode="widthFix" src={getImageUrl(item.headPic)} ></Image>
                      </View>
                      <View className='name'>
                        {item.name}
                        <View className='sex'>性别：<Text className={item.sex ? 'man' : ''}></Text></View>
                      </View>
                      <View className='btns'>
                          <AtButton  onClick={() =>   Taro.navigateTo({url: `/pages/user/appointmentDetail?id=${item.id}`})}>查看详情</AtButton>
                          {/* <AtButton className="sure" onClick={() => this.invite(item)}>{item.status == 1 ? '已邀请':'确定邀请'}</AtButton> */}
                         
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
        )
    }
}
