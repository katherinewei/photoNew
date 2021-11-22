import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton,AtInputNumber,AtIcon  } from 'taro-ui'
import '../../components/common.scss'
import './picker.scss'
import {dataType} from '../../config'

const $instance = Taro.getCurrentInstance()
export default class Picker extends Component {


  state = {
    data:dataType,
    current:{},

   // type:this.$router.params.type
    
  }

  componentWillMount () {

    // eslint-disable-next-line no-undef
    const { top, height } = wx.getMenuButtonBoundingClientRect()
    // eslint-disable-next-line no-undef
    const { statusBarHeight, platform } = wx.getSystemInfoSync()
    console.log(top, height,statusBarHeight,platform,9632145)
    let navigationBarHeight;
    if (top && top !== 0 && height && height !== 0) {
      navigationBarHeight = (top - statusBarHeight) * 2 + height
    } else {
    if(platform === 'android'){
      navigationBarHeight = 48;
    }else{
      navigationBarHeight = 40;
    }
  }
  this.setState({
     statusBarHeight:statusBarHeight,
     barHeight:navigationBarHeight,
  })

  }

  componentDidMount() {
    
   let bookSel = Taro.getStorageSync('bookSel')
      if(bookSel){
        bookSel = JSON.parse(bookSel)
      } 
      const {type} = $instance.router.params
      let current = {}
      for(let item in bookSel){
        if(item === type){
          current = bookSel[item]
        } 
      }
      dataType.selType2.map(item => {
        item.number = 0
        current.length > 0 && current.map(c => {
          if(item.id === c.id){
            item.number = c.number
          }
        })
        
      })
      this.setState({current})
  }

  
 
  handleChange (item,e) {
    const {isNumber} = $instance.router.params
    let {data} = this.state
    console.log(e)
    if(isNumber){
      let sel = []
      data.selType2.map(ii => {
        if(ii.id ===item.id){
          ii.number = e
        }
        if(ii.number){
          sel.push(ii)
        }
          
      })
      
      this.setState({
        current:sel
      })
     
    } else{
      this.setState({
        current:item
      })
    }
  }

  onComplete(){
    //bookSel[this.$router.params.type]

    const {isNumber} = $instance.router.params
    const {current} = this.state
    if(isNumber){
      if(!current.length){
        Taro.showToast({
          title: '请选择人数',
          icon:'none',
          mask: true
        });
        return false
      }
      let valid = false
      current.map(item =>{
        if(item.number){
          valid = true
        }
      })
      if(!valid){
        Taro.showToast({
          title: '请选择人数',
          icon:'none',
          mask: true
        });
        return false
      }

    } else {
     
      if(!(current.id == 0 || current.id)){
        Taro.showToast({
          title: '请选择',
          icon:'none',
          mask: true
        });
        return false
      }
    }

    let bookSel = Taro.getStorageSync('bookSel')
    if(bookSel){
      bookSel = JSON.parse(bookSel)
    } else {
      bookSel = {}
    }
   // console.log(this.$router)

    bookSel[$instance.router.params.type] = this.state.current
   
    Taro.setStorageSync('bookSel', JSON.stringify(bookSel));
    Taro.redirectTo({
      url: `/pages/index/bookPhotographer?sel=1&hasChoose=1`
    })
  }



  render() {
    const {current,data, barHeight,  statusBarHeight} = this.state
    const {type,isNumber} = $instance.router.params
    
    return (
      <View className='PickSingle'>
        <View className='navbar' style={{paddingTop:statusBarHeight+"px",lineHeight:barHeight+"px"}}>
          <View className='icon' onClick={() => Taro.redirectTo({url: `/pages/index/bookPhotographer`})}><AtIcon value='chevron-left' size='26' color='#fff'></AtIcon></View>
          <View className='title' >预约条件</View>

        </View>
        <View className='content' style={{paddingTop:statusBarHeight+barHeight+"px"}}>
          {data[type] && data[type].map((item,i) => (
            <View key={i} className={`${isNumber ? 'isNumber ' : ''} ${current.id == item.id ? 'active': ''} item`} onClick={() => !isNumber && this.handleChange(item)}>
                {item.label}
                {isNumber && <AtInputNumber  min={0} step={1}  value={item.number} onChange={e => this.handleChange(item,e)}  />}
              </View> 
          ))}

            {type === 'selType3' && current.id === 0 && <View className='pTip'>您选择了自备化妆，因此摄影师仅对拍摄与后期服务负责。因化妆对成片产生的影响，不会成为任何售后原因。</View>}
            {type === 'selType4' && current.id === 0 && <View className='pTip'>您选择了自备服装，因此摄影师仅对拍摄与后期服务负责。因服装对成片产生的影响，不会成为任何售后原因。</View>}
        </View>
        <View className='foot'>
            <AtButton size='small' type='primary' circle  onClick={this.onComplete.bind(this)}>完成</AtButton>
        </View>
      </View>
    )
  }
}
