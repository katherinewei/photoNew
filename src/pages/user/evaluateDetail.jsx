import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Swiper, SwiperItem,Image } from '@tarojs/components'
import { AtAvatar  } from "taro-ui"
import Request from '../../utils/request';
import './photo.scss'
import {getToken,getUserInfo} from '../../utils/help';

export default class MyPhoto extends Component {


    constructor () {
      super(...arguments)
      
    }
    state = {
      data:{}
    }

    componentWillMount () {

    }

    componentDidMount () {
      const $instance = Taro.getCurrentInstance()
      getToken(() => {
        // 查看自己评价内容详情
        
          Request({
            url: 'api/wxSelfCommentDetail',
            method: 'get',
            data: {
              commentId: $instance.router.params.id
            },
  
          },(data) => {
            if(data.code === 200){
            this.setState ({
              ...data})
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

    onScrollToLower(){

    }

    render () {
        
      const { data } = this.state
        return (
         
          data.id ?  <View className='myPhotoPage'> <View className='at-article'>
            <View className='header' >
                  <AtAvatar  circle  image={data.headPic}   ></AtAvatar>
                  <View className='right'>
                    <View className='name'>{getUserInfo().nickName}</View>
                   
                  </View>
                </View>
              <View className='at-article__content'>
             {data.commentImgUrlList.length > 0 &&  <Swiper
               className='myswipe'
               indicatorColor='#DCDCDC'
               indicatorActiveColor='#5299FB'
                  
               circular
               indicatorDots
              
             >
                    {data.commentImgUrlList.map((item,i) =>(
                      <SwiperItem key={i}>
                         <View className='demo-text-1'style={{textAlign: 'center'}}><Image src={item} mode='heightFix' /></View>
                      </SwiperItem>
                    ))}
                </Swiper>}
                <View className='at-article__section'>
                  <View className='at-article__h3'>{data.title}</View>
                 
                  <View className='at-article__p'>
                  {data.content}
                  </View>
                </View>
              </View>
          </View></View>:<View></View>
        ) 
    }
}
