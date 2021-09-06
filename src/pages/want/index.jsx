import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import '../index/index.scss'
import { AtButton,AtTabBar  } from 'taro-ui'
import {getImageUrl} from '../../utils/help';
import Tabs from '../../components/tab'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '想拍'
    }
    state = {
        current:1,
    }



    componentWillMount () {
      this.fetchData()

    }

    fetchData(callback){
      Request({
        url: 'photo-like-list',
        method: 'get',


      },(data) => {

        if(callback){
          callback()
        }else {
          this.setState({...data.data})
        }
      })
    }

    componentDidMount () {


    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }




    // 想拍
    handleLike(id){
      Request({
        url: 'photo-like',
        method: 'post',
        data: {
           serviceId:id
        },

      },(data) => {
        this.fetchData()
      })

    }



      onScrollToLower() {

        const {pages,current,records} = this.state;
        if(pages > current){
          const callback = (data) => {
            data.data.records = [...records,...data.data.records];
            this.setState({...data.data})
          }
          this.fetchData(callback)

        }


      }






    render () {
        const {records} = this.state
        return ( <View className='content'>
            <Tabs current={1}/>

            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={0}
              style={{height: (Taro.getSystemInfoSync().windowHeight - 70) + 'px'}}
              lowerThreshold={20}
              upperThreshold={20}

              onScrollToLower={this.onScrollToLower.bind(this)}

            >

              <View className='box' style={{paddingBottom:'30px'}}>
              {records && records.length > 0 ? records.map((item,i) => (
                <View className="item" >
                  <View  onClick={() =>   Taro.navigateTo({  url: `/pages/index/serviceDetail?id=${item.id}`  })}>
                        <View className="info">
                          <View  className="info1">
                            <Image src={getImageUrl(item.headPic)} ></Image>
                            <View>
                              <Text>{item.name}<Text></Text></Text>
                              {item.area}
                            </View>
                          </View>


                        </View>

                        <View className="image">

                          <View className="img">
                            <Image mode="heightFix" src={getImageUrl(item.imgPath)} ></Image>
                            {item.flag && <View className="badge"> 已验真</View>}
                          </View>
                        </View>
                   </View>


                    <View className="price">
                      <Text>¥{item.price}</Text>
                      <View><AtButton type='primary' size='small' onClick={()=>this.handleLike(item.id)}>取消想拍</AtButton></View>
                    </View>

                </View>
              )) : <View className="noData" style={{marginTop:'150px'}}>
                <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                <View >暂无数据</View>
              </View>}


              </View>

            </ScrollView>

            </View>
        )
    }
}
