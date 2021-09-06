import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';
import './index.scss'
import {getImageUrl,setUserInfo} from '../../utils/help';
import { AtGrid,AtTabs, AtTabsPane,AtButton,AtTabBar } from "taro-ui"
import Tabs from '../../components/tab'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '我的'
    }



    constructor () {
      super(...arguments)
      this.setState ({
        current: 0,
        index:0,
        nav:4,
        user:{},
        serviceList:{},
        truthList:[],
        speechList:{},
        records:[],

        // typeS: [null,'20000','20001','20002','20003','20004','20005','20006','20007','20008','20009','200010'],
        // typeed:Taro.getStorageSync('userId') || '20000',

      })
    }


    componentWillMount () {

    }

    componentDidMount () {


      // 个人信息
          Request({
            url: 'user_info',
            method: 'get',
            data: {
            //  code: res.code
            //    id:10000
            },

          },(data) => {

              this.setState({user:data.data})
              setUserInfo(data.data)
              console.log(data.data)

              if(!data.data.head_pic){
                this.getUser()
              }
          })


          this.fetchService(1)




    }

    fetchService(status){
      // 发布信息
          Request({
            url: 'photo-service-list',
            method: 'get',
            data: {
              status
            },

          },(data) => {

              this.setState({serviceList:data.data})
            //  console.log(data.data)
          })

    }


    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    getUser(){
        let that = this;
       const callback = () => {
              Taro.getUserInfo({
                lang:'zh_CN',
                success: function(res) {

                      var userInfo = res.userInfo
                      var nickName = userInfo.nickName
                      var avatarUrl = userInfo.avatarUrl
                      var gender = userInfo.gender //性别 0：未知、1：男、2：女
                      var province = userInfo.province
                      var city = userInfo.city
                      var country = userInfo.country


                      let data = {nickName,gender:gender == 1 ? 1 : 0,city,province,country,avatarUrl};

                      Request({
                        url: 'photo-user',
                        method: 'post',
                        data
                      },(res) => {
                        Taro.showToast({
                          title: '获取成功',
                          icon: 'success',
                          mask: true,
                        });

                        that.setState({user:{head_pic:data.avatarUrl,userName:data.nickName,address:data.province + ' ' + data.city}})



                      })

                    }
                  })
            }

            Taro.getSetting({
              success(res1) {
                console.log(res1)
                if (!res1.authSetting['scope.userInfo']) {
                  Taro.authorize({
                    scope: 'scope.userInfo',
                    success () {
                      console.log(111)
                      callback()
                    }
                  })
                } else {
                  console.log(2222)
                  callback()
                }
              }
            })

    }

    handleClick (value) {
      this.setState({
        current: value
      })

      if(this.state.index === 0){
          this.fetchService(value ? 2 : 1)
      }

      if(this.state.index === 1){

          this.fetchTruthList(value)
      }

    }

    handleGrid(value){

        if(value.index === 3){
          Taro.navigateTo({
            url: `/pages/user/Info`
          })
          return false
        }


      this.setState({
        current: 0,
        index:value.index
      })

      switch (value.index) {
        case 0:
          this.fetchService(1)
          break;
        case 1:
          this.fetchTruthList(0)
        break;
        case 2:
            this.speechList()
          break;
        default:

      }
    }


    //  //验真列表
    fetchTruthList (status)  {

      let url = 'photo-truth-list'
      if(status){
        console.log(1111)
        url = 'photo-speech-sure-list'
      }


      //验真列表
      Request({
        url: url,
        method: 'GET',

      },(data) => {
         // data.data.records = [{price:1}]
          this.setState({truthList:data.data})
      })
    }

    // 已收验真
    speechList (status)  {

      let url = 'photo-speech-list'

      //已收验真列表
      Request({
        url: url,
        method: 'GET',

      },(data) => {
          this.setState({speechList:data.data})
      })
    }


    handleClickNav(value){

      this.setState({
          nav: value
        })

        if(value !== 4){
          Taro.navigateTo({
            url: `/pages/${href[value]}/index`
          })
        }

    }


    onScrollToLower() {
      let {speechList,current,serviceList,truthList,index} = this.state;
      let url = 'photo-service-list'
      let pages,page,records=[];
      switch (index) {
        case 0:
          url = 'photo-service-list'
          pages = serviceList.pages
          page = serviceList.current
          records = serviceList.records
          break;
        case 1:
          url = 'photo-truth-list'
          if(current){
            url = 'photo-speech-sure-list'
          }
          pages = truthList.pages
          page = truthList.current
          records = truthList.records

          break;
        case 2:
          url = 'photo-speech-list'
          pages = speechList.pages
          page = speechList.current
          records = speechList.records
          break;
        default:
      }
      if(pages > page){
        Request({
          url: url,
          method: 'GET',
          data:{page:page + 1},
          //isToken:false
        },(data) => {
            data.data.records = [...records,...data.data.records];
            switch (index) {
              case 0:
                this.setState({serviceList:data.data})
                break;
              case 1:
                this.setState({truthList:data.data})
                break;
              case 2:
                this.setState({speechList:data.data})
                break
              default:
              break;

            }
        })
      }
    }

    //删除发布
    deleteService(id,url){
      let {serviceList} = this.state;


      Request({
        url,
        method: 'delete',
        data:{id},
      },(data) => {
        Taro.showToast({
          title: `删除成功`,
          icon: 'none',
          mask: true,
        });
          serviceList.records.map((item,i) => {
            if(item.id === id){
              serviceList.records.splice(i,1)
            }
          })
         this.setState({serviceList})
      })
    }


    // onChangeType(e){
    //   const code = this.state.typeS[e.target.value]
    //   Taro.setStorageSync('userId', code)
    //   Taro.navigateTo({
    //     url: `/pages/index/index?code=${code}`
    //   })
    //   console.log(e.target)
    // }


    //已收验真- --查看验真
     reviceView(row){
      if(row.status){
        Taro.navigateTo({url: `/pages/index/reportDetail?id=${row.id}`});
      } else {
        Taro.showToast({
          title: '该用户暂时还没有发布验真报告。',
          icon: 'none',
          mask: true,
        });
      }

    }


    render () {
        const tabList = [{ title: '待发布' }, { title: '已发布' }]
        const tabList1 = [{ title: '发布服务' }, { title: '发布邀请' }]
        const {user,records,speechList,current,serviceList,truthList } = this.state;



        console.log(current)

        return (
            <View className='user'>


              <Tabs current={4}/>


              {/* <Picker mode='selector' range={this.state.typeS} onChange={this.onChangeType} >
                 <View className='picker'>
                   {this.state.typeed}
                 </View>
               </Picker> */}



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



              {user && user.head_pic ? <View className='header' >
                    <Image mode="widthFix" src={getImageUrl(user.head_pic)} ></Image>
                    <View className='name'> {user.wxName} </View>
                    <View className='location'> {user.address} </View>
              </View> : <Button openType='getUserInfo' onGetUserInfo={this.getUser.bind(this)} className="bindBtn">微信授权登录</Button>}
              <View className='nav' >
              <AtGrid hasBorder={false} columnNum={4} onClick={this.handleGrid.bind(this)} data={
                          [
                            {
                              image: require('../../images/icon/myPublish.png'),
                              value: '我的发布',
                              index:0
                            },
                            {
                              image: require('../../images/icon/myTurth.png'),
                              value: '我的验真',
                              index:1
                            },
                            {
                              image: require('../../images/icon/truthed.png'),
                              value: '已收验真',
                              index:2
                            },
                            {
                              image: require('../../images/icon/edit.png'),
                              value: '修改资料',
                              index:3
                            }

                          ]
                          } />
              </View>

              <View className='content' >
              {(this.state.index === 0 || this.state.index === 1 ) &&   <AtTabs current={this.state.current} tabList={this.state.index === 0 ? tabList1:tabList} onClick={this.handleClick.bind(this)}>
                  {this.state.index === 0 ?
                    <View>
                         <AtTabsPane current={this.state.current} index={0} >


                           <View className="tabContent">

                             <View className="list">
                             {serviceList && serviceList.records && serviceList.records.length > 0 ? serviceList.records.map((item,i) => (
                               <View className='box box2' key={item.id}>
                                 <View>
                                     <View className='img'>
                                       <Image  src={getImageUrl(item.imgPath)} ></Image>
                                     </View>
                                     <View className='name'>
                                       {item.title}
                                       <View className='sex'>价格：￥{item.price}</View>
                                     </View>
                                  </View>
                                  <View className='bottom'>
                                    <View className='left'>
                                      <Text>想拍：<Text>{item.logsCount}</Text></Text>
                                      <Text>浏览：<Text>{item.browseCount}</Text></Text>
                                    </View>
                                    <View className='btns'>
                                        <AtButton onClick={() =>   Taro.navigateTo({url: `/pages/user/appointmentList?id=${item.id}`})}>查看预约</AtButton>
                                        <AtButton className="sure" onClick={() => this.deleteService(item.id,'photo-service')}>删除</AtButton>
                                    </View>
                                  </View>
                               </View>
                             )) : <View className="noData" style={{marginTop:'60px'}}>
                               <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                               <View >暂无数据</View>
                             </View>}




                             </View>

                           </View>
                         </AtTabsPane>
                         <AtTabsPane current={this.state.current} index={1}>
                               <View className="tabContent">

                                 <View className="list">
                                 {serviceList && serviceList.records && serviceList.records.length > 0 ? serviceList.records.map((item,i) => (
                                   <View className='box box2' key={item.id}>
                                     <View>
                                         <View className='img'>
                                           <Image  src={getImageUrl(item.imgPath)} ></Image>
                                         </View>
                                         <View className='name'>
                                           {item.title}
                                           <View className='sex'>价格：￥{item.price}</View>
                                         </View>
                                      </View>
                                      <View className='bottom'>
                                        <View className='left'>
                                          <Text>申请：<Text>{item.logsCount}</Text></Text>
                                          <Text>浏览：<Text>{item.browseCount}</Text></Text>
                                        </View>
                                        <View className='btns'>
                                            <AtButton  onClick={() =>   Taro.navigateTo({url: `/pages/user/applicationList?id=${item.id}`})}>查看申请</AtButton>
                                            <AtButton className="sure"  onClick={() => this.deleteService(item.id,'photo-truth')}>删除</AtButton>
                                        </View>
                                      </View>
                                   </View>
                                 )) : <View className="noData" style={{marginTop:'60px'}}>
                                   <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                                   <View >暂无数据</View>
                                 </View>}




                                 </View>

                               </View>

                         </AtTabsPane>
                    </View> :  this.state.index === 1 &&  <View>
                           <AtTabsPane current={this.state.current} index={0} >


                             <View className="tabContent">
                             <View className="tip">从您的验真列表中选择对应的验真</View>
                             <View className="list">
                             {truthList && truthList.records && truthList.records.length > 0 ? truthList.records.map((item,i) => (
                               <View className='box' key={i}>
                                 <View className='img'>
                                   <Image  src={getImageUrl(item.imgPath)} ></Image>
                                 </View>
                                 <View className='name'>
                                   {item.title}
                                   <View className='sex'>报酬：￥{item.price}</View>
                                 </View>
                                 <View className='btns'>
                                     <AtButton onClick={() => user.isTruthUser  && Taro.navigateTo({url: `/pages/publish/publishReport?id=${item.id}`})}>验真发布</AtButton>

                                 </View>
                                 <Text className="badge">{item.type === 0 ? '验真约拍' : '验真服务'}</Text>    
                               </View>
                             )): <View className="noData" style={{marginTop:'60px'}}>
                               <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                               <View >暂无数据</View>
                             </View>}



                             </View>

                             </View>
                           </AtTabsPane>
                           <AtTabsPane current={this.state.current} index={1}>

                             <View className="tabContent tabContent2">
                             <View className="tip">管理您已发布的验真</View>
                             <View className="list">
                             {truthList && truthList.records && truthList.records.length > 0 ? truthList.records.map((item,i) => (
                               <View className='box' key={i}>
                                 <View className='img' >
                                   <Image  src={getImageUrl(item.imgPath)} ></Image>
                                 </View>

                                 <View className='btns' >
                                     <AtButton onClick={() =>  !item.expire && Taro.navigateTo({url: `/pages/index/reportDetail?id=${item.id}`})}>查看验真</AtButton>
                                     <AtButton className="sure"  onClick={() =>   Taro.navigateTo({url: `/pages/index/complaints?id=${item.id}&type=2`})}>投诉</AtButton>
                                 </View>
                               </View>
                             )): <View className="noData" style={{marginTop:'60px'}}>
                               <Image mode="widthFix" src={require('../../images/icon/noData.png')}></Image>
                               <View >暂无数据</View>
                             </View>}






                             </View>

                             </View>
                           </AtTabsPane>
                      </View>

                  }

               </AtTabs>}


               { this.state.index === 2 &&
                 <View>
                    <View className="tip">已有{speechList.total}人为您的服务验真</View>
                    <View className="list">
                    {speechList && speechList.records && speechList.records.length > 0 && speechList.records.map((item,i) => (
                      <View className='box box2 box3' key={i}>
                      <View className='userName'>用户名: {item.name}</View>
                        <View className='item'>
                         <View className='img' >
                          <Image  src={getImageUrl(item.headPic)} ></Image>
                        </View>

                        <View className='btns' >
                            <AtButton onClick={() =>  this.reviceView(item)}>查看验真</AtButton>
                            <AtButton className="sure"  onClick={() =>   Taro.navigateTo({url: `/pages/index/complaints?id=${item.id}&type=2`})}>投诉</AtButton>
                        </View>
                        </View>
                      </View>
                    ))}

                    </View>
               </View>
               }


            </View>

            </ScrollView>

          </View>
        )
    }
}
