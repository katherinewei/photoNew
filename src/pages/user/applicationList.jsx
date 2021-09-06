import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl} from '../../utils/help';
import { AtButton   } from 'taro-ui'
export default class applicationList extends Component {

    config = {
        navigationBarTitleText: '查看申请'
    }

    componentWillMount () {
        this.state = {

        }
    }

    componentDidMount () {


        this.fetch()
 

    }

    fetch(){
      const id =  this.$router.params.id
      Request({
        url: 'photo-subscribe-userlist',
        method: 'GET',
        data:{id}
      },(data) => {
          this.setState({...data.data})
      })
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
    handleDelete = (id) => {

      const serid =  this.$router.params.id;
      const {records} = this.state;
      Request({
        url: 'photo-speech-del',
        method: 'POST',
        data:{id}
      },(data) => {
        Taro.showToast({
          title: '删除成功！',
          icon: 'success',
          mask: true,
        });
          records.map((item,i) => {
            if(item.id === id){
              records.splice(i,1)
            }
          })
          this.setState({records})
      })
    }

    render () {
        let {records} = this.state;
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
                    收到的申请
                    <Text>仅可邀请一位，选定后其他申请将清空。请与您确定的人选完成 拍摄沟通后，再点击确认邀请！</Text>
                </View>

                <View className='list'>
                    {records && records.length > 0 ? records.map((item,i) => (
                      <View className='box' >
                        <View className='img'>
                          <Image  src={getImageUrl(item.headPic)} ></Image>
                        </View>
                        <View className='name'>
                          {item.name}
                          <View className='sex'>性别：<Text className={item.sex ? 'man' : ''}></Text></View>
                        </View>
                        <View className='btns'>
                            <AtButton onClick={() =>  Taro.navigateTo({url: `/pages/user/applicationDetail?id=${item.id}&serviceId=${item.targetId}&type=${item.type}`})}>查看详情</AtButton>
                            {/* <AtButton className="sure" onClick={() => this.invite(item)}>{item.type ? '已邀请':'确定邀请'}</AtButton> */}
                            {!item.status && <AtButton className="sure" onClick={() => this.handleDelete(item.id)}>删除</AtButton>}
                        </View>
                      </View>
                    )) : <View className="noData" style={{marginTop:'110px'}}>
                      <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                      <View >暂无数据</View>
                    </View>}
                </View>
            </ScrollView>
        </View>
        )
    }
}
