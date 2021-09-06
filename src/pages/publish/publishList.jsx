import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import {getImageUrl} from '../../utils/help';
import './list.scss'
import { AtList, AtListItem,AtButton } from "taro-ui"


export default class Index extends Component {

    config = {
        navigationBarTitleText: '验真发布'
    }

    componentWillMount () {

      Request({
        url: 'photo-truth-list',
        method: 'get',


      },(data) => {

          this.setState({yzList:data.data})
        //  console.log(data.data)
      })


    }

    componentDidMount () {


    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }





    render () {
      const{yzList} = this.state

        return (
            <View className='index'>
                <View className="desc">从您的验真列表中选择对应的验真</View>
                <View className="list">
                {yzList && yzList.records && yzList.records.length > 0 && yzList.records.map((item,i) => (
                  <View className="item" key={i}>
                    <Image src={getImageUrl(item.imgPath)} ></Image>
                    <View className='name'>
                      {item.title}
                      <View className='sex'>价格：￥{item.price}</View>
                    </View>
                    <AtButton type='secondary'  onClick={() =>   Taro.navigateTo({url: `/pages/publish/publishReport?id=${item.id}`})}>发布验真</AtButton>

                  </View>
                ))}


                </View>
            </View>
        )
    }
}
