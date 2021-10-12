import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import Request from '../../utils/request';
import './photo.scss'
import {getToken} from '../../utils/help';
import { AtAvatar  } from "taro-ui"
import Tabs from '../../components/tab'
export default class MyPhoto extends Component {

    config = {
        navigationBarTitleText: '我的写真',
        navigationBarBackgroundColor: '#fff',
    }



    constructor () {
      super(...arguments)
      this.setState ({
        data:{}
      })
    }


    componentWillMount () {

    }

    componentDidMount () {
      getToken(() => {
        // 查看自己评价内容详情
        Request({
          url: 'api/wxNoteDetail',
          method: 'get',
          data: {
            id:this.$router.params.id
          },
  
        },(data) => {
          if(data.code === 200){
           this.setState({data:data.data})
          }else {
            Taro.showToast({
              title: data.msg,
              icon:'none',
              mask: true
            });
          }
        })
      })
    }
    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    render () {
        
      const { data} = this.state
        return (
         
         data.id &&  <View className='at-article'>
            <View className="header" >
                  <AtAvatar  circle  image={data.headPic}   ></AtAvatar>
                  <View className="right">
                    <View className="name">{data.nickName}</View>
                   
                  </View>
                </View>
              <View className='at-article__content'>
                {data.imgUrlList && data.imgUrlList.length > 0 && 
              <Swiper
                  className='myswipe'
                  indicatorColor='#DCDCDC'
                  indicatorActiveColor='#5299FB'
                  
                  circular
                  indicatorDots
                  autoplay>
                    {data.imgUrlList.map(item =>(
                      <SwiperItem>
                        <View className='demo-text-1'><Image src={item} mode="widthFix"/></View>
                      </SwiperItem>
                    ))}
                  
                  
                </Swiper>}

                <View className='at-article__section'>
                  <View className='at-article__h3'>{data.title}</View>
                 
                  <View className='at-article__p'>
                  {data.description}
                  </View>
                 
                 
                </View>
              </View>
          </View>
        )
    }
}
