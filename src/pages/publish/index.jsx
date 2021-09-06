import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import { AtList, AtListItem,AtCurtain ,AtButton} from "taro-ui"



export default class Index extends Component {

    config = {
        navigationBarTitleText: '发布'
    }

    componentWillMount () {
        this.setState({notfirstYz:{}})

    }

    componentDidMount () {


      Request({
        url: 'user_info',
        method: 'get',
        data: {
        //  code: res.code
        //    id:10000
        },

      },(data) => {

          this.setState({user:data.data})
        //  console.log(data.data)
      })

  


    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    handleClick(value,i){
      console.log(value)
      if(i === 0 && this.state.user.flag !== 3){
        Taro.showToast({
          title: '不符合条件发布服务！',
          icon: 'none',
          mask: true,
        });
        return false
      }
      if(i === 1 && this.state.user.flag == 0){
        Taro.showModal({
          content: '你不是摄影师角色,无法发布。是否前往认证摄影师?',
          confirmText:'前往',
          success:(result) => {
            if(result.cancel){
              return false
            }
            if(result.confirm){

              Taro.navigateTo({url: `/pages/publish/verificatePhotographer`  })
            }

          }  ,
          mask: true,
        });
        return false

      }

      if(i === 2 && this.state.user.isTruthUser !== 1){
        Taro.showModal({
          content: '你不是验真官角色,无法发布。是否前往认证验真官?',
          confirmText:'前往',
          success:(result) => {
            if(result.cancel){
              return false
            }
            if(result.confirm){

              Taro.navigateTo({url: `/pages/publish/verificateChecker`  })
            }

          }  ,
          mask: true,
        });
        return false

      }
      if(i === 1 && this.state.user.flag > 1){
        this.setState({
          isOpened: true
        })
        //摄影师非首次发布验真的弹窗调用接口   
        Request({
          url: 'photo-notfirstYz',
          method: 'POST',
          data: {},
        },(data) => {
            this.setState({notfirstYz:data.data})
        })
        return false
      }


      Taro.navigateTo({
        url: `/pages/publish/${value}`
      })
    }
    onClose () {
      this.setState({
        isOpened: false
      })
    }

   


    render () {


      const items = [
        {
          title:'发布服务',
          note:'摄影师发布服务信息，首次发布前需先完成约拍验真',
          thumb:require('../../images/icon/publish1.png'),
          url:'publishService'
        },
        {
          title:'约拍验真',
          note:'邀请验真官约拍验真',
          thumb:require('../../images/icon/publish2.png'),
          url:'publishTruth'
        },
        {
          title:'验真发布',
          note:'验真官完成约拍验真后发布样片,真实体验',
          thumb:require('../../images/icon/publish3.png'),
          url:'publishList'
        },
      ]

      const {user,notfirstYz} = this.state

        return (
            <View className='index'>
            {items.map((item,i) => (
              <View className={`list-item ${user.flag !== 3 && i==0 ? 'disable' : ''}`}   onClick={() => this.handleClick(item.url,i)} >
                <Image mode="widthFix" src={item.thumb}></Image>
                <View>
                  <Text className="tit">{item.title}</Text>
                  <Text>{item.note}</Text>
                </View>

              </View>
            ))}
    

    <AtCurtain
        isOpened={this.state.isOpened}
        onClose={this.onClose.bind(this)}
      >
      <View className="CurtainBody">
        <Image className="bg" src={require('../../images/icon/head.png')} ></Image>
        <Text class="tit">发布更多约拍验真,真金不怕火炼！</Text>
        <Text class="p">为平衡与保证约拍验真报告的真实有效性，\n防止恶意刷屏行为我们设立发布次数门槛；\n摄影师每日可发布3次约拍验真。\n当日未使用次数不会保留。</Text>
        <Text class="count">当前可用次数：<Text class="num">{notfirstYz.use}</Text></Text>
        {/* <Text class="resetTime">下次重置时间在{notfirstYz && notfirstYz.cycleDate}</Text> */}
        <View className="btns">
          <AtButton type='primary'  onClick={()=>  notfirstYz.use > 0 && Taro.navigateTo({url: `/pages/publish/publishTruth`  })} >发布约拍验真</AtButton>
          {/* <AtButton type='primary'  onClick={()=>  Taro.navigateTo({url: `/pages/publish/share`  })}  className="share">去分享，获得额外一次</AtButton> */}
          {/* <Share title="去分享，获得额外一次" /> */}
        </View>
      </View>
      
      </AtCurtain>



            </View>
        )
    }
}
