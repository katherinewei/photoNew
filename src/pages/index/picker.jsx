import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Input } from '@tarojs/components'
import Request from '../../utils/request'
import { AtButton,AtInputNumber  } from 'taro-ui'
import '../../components/common.scss'
import './picker.scss'
export default class publishService extends Component {
  config = {
    navigationBarTitleText: '预约条件',
    navigationBarTextStyle: 'white',
  }

  state = {
    data:{selType1:[{id:1,label:'数码拍摄'},{id:2,label:'胶片拍摄'},{id:3,label:'视频拍摄'}],
          selType2:[{id:1,label:'成人',number:0},{id:2,label:'儿童',number:0},{id:3,label:'情侣',number:0}],
          selType3:[{id:1,label:'我会化妆'},{id:2,label:'帮我化妆'}],
          selType4:[{id:1,label:'自备服装'},{id:2,label:'帮我搭配'}],
          selType5:[{id:1,label:'男摄影师'},{id:2,label:'女摄影师'},{id:3,label:'性别不限'}],
          selType6:[{id:1,label:'室内/棚拍'},{id:2,label:'外景'},{id:3,label:'上门拍摄'}]
  },
    current:{},
   // type:this.$router.params.type
    
  }

  componentDidMount() {
  
  }

  
 
  handleChange (item,e) {
    const {isNumber} = this.$router.params
    let {current,data} = this.state
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
    let bookSel = Taro.getStorageSync('bookSel')
    if(bookSel){
      bookSel = JSON.parse(bookSel)
    } else {
      bookSel = {}
    }
   // console.log(this.$router)

    bookSel[this.$router.params.type] = this.state.current
   
    Taro.setStorageSync('bookSel', JSON.stringify(bookSel));
    Taro.redirectTo({
      url: `/pages/index/bookPhotographer?sel=1`
    })
  }



  render() {
    const {current,data} = this.state
    const {type,isNumber} = this.$router.params
    return (
      <View className="PickSingle">
        <View className="content">
          {data[type] && data[type].map(item => (
            <View className={`${isNumber ? 'isNumber ' : ''} ${current.id == item.id ? 'active': ''} item`} onClick={() => !isNumber && this.handleChange(item)}>
                {item.label}
                {isNumber && <AtInputNumber  min={0} step={1}  value={item.number} onChange={e => this.handleChange(item,e)}  />}
              </View>
          ))}
        </View>
        <View className="foot">
            <AtButton size="small" type="primary" circle  onClick={this.onComplete.bind(this)}>完成</AtButton>
        </View>
      </View>
    )
  }
}
