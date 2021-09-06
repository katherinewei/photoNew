import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request'
import { getImageUrl, typeS, getUserId, getToken, setUserId, setUserInfo,validateLogin } from '../../utils/help'
import './detail.scss'
import {
  AtButton,
  AtIcon,
  AtFab,
  AtTabBar,
  AtAvatar,
  AtSearchBar,
  AtInput,
  AtCurtain,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtTextarea,
} from 'taro-ui'
import Share from '../../components/share'

export default class serviceDetail extends Component {
  config = {
    navigationBarTitleText: '服务详情',
  }

  componentWillMount() {
    const { id, price, isPhotographer,isShare } = this.$router.params
    this.state = {
      speechList: {},
      id,
      detail: {},
      isPhotographer,
      price,
      likeBtn: true,
      messageModal: false, //留言弹框
      replyId: false, //是否是回复
      isShare,//分享进来的
    }
  }

  onShareAppMessage(res) {
    //放在父组件上执行，子组件上不被执行！
    const { detail, id,price, isPhotographer } = this.state
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮

    //   return {
    //     title: detail.title,
    //     path: `/pages/index/serviceDetail?id=${id}`,
    //     imageUrl:getImageUrl(detail.imgPath[0]),
    //   }
    // }
    let path = `/pages/index/serviceDetail?id=${id}&isShare=1`
    if(isPhotographer){
      path += `&price=${price}&isPhotographer=1`
    }
    
    return {
      title: '拍好照：' + typeS[detail.type - 1] + '服务',
      path,
      imageUrl: getImageUrl(detail.imgPath[0]),
    }
  }

  getData() {
    const { id, isPhotographer } = this.state

    // 查看验真服务详情内容
    Request(
      {
        url: 'photo-service-detail',
        method: 'put',
        data: {
          id,
          type: isPhotographer ? 2 : 1,
        },
      },
      (data) => {
        let detail = data.data

        if (detail.imgPath) {
          detail.imgPath = detail.imgPath.split(',')
        } else {
          detail.imgPath = []
        }

        this.setState({ detail, id })
      },
    )

    // 验真报告列表
    if (!isPhotographer) {
      Request(
        {
          url: 'photo-speech',
          method: 'GET',
          data: {
            targetid: id,
            pageSize:100
          },
        },
        (data) => {
          this.setState({ speechList: data.data })
          // console.log(data.data)
        },
      )
    }
    if (!isPhotographer) {
      // 留言列表
      Request(
        {
          url: 'photo-comment',
          method: 'GET',
          data: {
            yzId: id,
          },
        },
        (data) => {
          this.setState({ comments: data.data })
        },
      )
    }
  }

  componentDidMount() {
    //获取参数

    getToken(() => this.getData(),this.state.isShare)

  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleClickDetail(value) {
    Taro.navigateTo({
      url: `/pages/index/reportDetail`,
    })
  }

  // 想拍
  handleLike() {
    if(validateLogin()){
      const { id, detail, likeBtn } = this.state
      if (likeBtn) {
        this.setState({ likeBtn: false })
        Request(
          {
            url: 'photo-like',
            method: 'post',
            data: {
              serviceId: id,
            },
          },
          (data) => {
            detail.like = !detail.like
  
            this.setState({ detail, likeBtn: true })
          },
        )
      }
    }
    
  }

  makePhone(phone) {
    Taro.makePhoneCall({
      phoneNumber: phone,
    })
  }

  //申请验真
  applyYZ() {
    if(validateLogin()){
    const { id } = this.state
    Request(
      {
        url: 'user_info',
        method: 'get',
        data: {
          //  code: res.code
          //    id:10000
        },
      },
      (data) => {
        setUserId(data.data.id)  
        setUserInfo(data.data)
       
        if (!Number(data.data.isTruthUser) ) {
          Taro.showModal({
            content: '你不是验真官,请认证验真官。',
            confirmText: '前往',
            success: (result) => {
              if (result.confirm) {
                Taro.navigateTo({
                  url: `/pages/publish/verificateChecker?source=applicate`,
                })
              }
            },
            mask: true,
          })
          return false
        }
        const userId = getUserId()
        if(userId === this.state.detail.userid){
          Taro.showToast({
            title: '这是您自己发布的验真约拍，无法申请！',
            icon: 'none',
            mask: true,
          })
          return false
        }
    
        Taro.navigateTo({ url: `/pages/publish/appointApplication?id=${id}` })
      },
    )
    }
    
    // Request(
    //   {
    //     url: 'photo-speech-add',
    //     method: 'POST',
    //     data: { id },
    //     //isToken:false
    //   },
    //   (data) => {
    //     Taro.showToast({
    //       title: '申请成功！',
    //       icon: 'success',
    //       mask: true,
    //     })
    //   },
    // )
  }

  //打开留言

  handleMessageModal(flag, replyId) {
    if(validateLogin()){
    this.setState({ messageModal: flag, replyId, comment: '' })
    }
  }

  //提交留言

  handleConfirm() {
    if(validateLogin()){
    const { id, comment, replyId } = this.state
    let data = {
      yzId: id,
      comment,
      isReply: 0,
    }
    if (!comment) {
      Taro.showToast({
        title: '请填写留言内容',
        icon: 'none',
        mask: true,
      })
      return false
    }
    console.log(replyId)
    if (replyId) {
      data.replyId = replyId
      data.isReply = 1
    }
    Request(
      {
        url: 'photo-comment',
        method: 'post',
        data,
      },
      (data) => {
        // 留言列表
        Request(
          {
            url: 'photo-comment',
            method: 'GET',
            data: {
              yzId: id,
            },
          },
          (data) => {
            this.setState({ comments: data.data })
          },
        )

        this.setState({ ReplyId: false, messageModal: false })
      },
    )
    }
  }

  onScrollToLower() {
    const { pages, current, records } = this.state.comments
    if (pages > current) {
      Request(
        {
          url: 'photo-comment',
          method: 'GET',
          data: { page: current + 1 },
          //isToken:false
        },
        (data) => {
          data.data.records = [...records, ...data.data.records]
          console.log(data)
          this.setState({ comments: data.data })
        },
      )
    }
  }

  //拍照预约
  orderYY() {}

  //删除留言
  handleDeleteMessage(id) {
    if(validateLogin()){
    const that = this;
    Taro.showModal({
      title: '',
      content: '确定要删除这条留言吗？',
      success (res) {
        if (res.confirm) {
          Request(
            {
              url: 'photo-comment-del',
              method: 'post',
              data: {id,serverid: that.$router.params.id},
              //isToken:false
            },
            (data) => {
              const comments = that.state.comments   
              comments.records.map((item,i) => {
                if(item.id === id){
                  comments.records.splice(i,1)
                }
              })
              that.setState({ comments })  
            },
          )
        } else if (res.cancel) {
         
        }
      }
    })
  }
    
  }

  viewDetail(item){
    console.log(item)
    if(validateLogin()){
    if(item.expire){
      Taro.showToast({
        title: '验真报告已过期！',
        icon: 'none',
        mask: true,
      });
      return false
    } 
    Taro.navigateTo({
      url: `/pages/index/reportDetail?id=${item.id}&name=${item.name}&area=${item.area}&headPic=${item.headPic}`,
    })
  }
  }


  render() {
    const {
      detail,
      id,
      speechList,
      comments,
      price,
      isPhotographer,
      messageModal,
      replyId,
    } = this.state

     console.log(comments)
    return (
      detail &&
      detail.name && (
        <View className="detail">
          <ScrollView
            className="scrollview"
            scrollY
            scrollWithAnimation
            scrollTop={0}
            style={{
              height: Taro.getSystemInfoSync().windowHeight - 70 + 'px',
            }}
            lowerThreshold={20}
            upperThreshold={20}
            onScrollToLower={this.onScrollToLower.bind(this)}
          >
            <View className="head">
              <View className="info">
                <View className="info1">
                  <Image src={getImageUrl(detail.headPic)}></Image>
                  <View>
                    <Text>
                      {detail.name}
                      <Text className={detail.sex ? 'man' : ''}></Text>
                    </Text>
                    {detail.province}
                    {detail.city}
                  </View>
                </View>
                <View className="right">
                  <Text>¥{price || detail.price}</Text>
                  {!isPhotographer && (
                    <Text
                      class="Complaints"
                      onClick={() =>
                        detail.userid !== getUserId() &&
                        Taro.navigateTo({
                          url: `/pages/index/complaints?id=${id}&page=complaints&type=3`,
                        })
                      }
                    >
                      投诉
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View className="content">
              <View className="p">{detail.introduction}</View>

              {/*
          <View className='time'>
             最近一次来过：2020年3月2日
         </View>
          */}

              <View className="pai">
                <Text class="h">{detail.title}</Text>
                <View className="row">
                  <View className="col">
                    <Text>拍摄类型:</Text>
                    <Text>{typeS[detail.type - 1]}</Text>
                  </View>
                  <View className="col">
                    <Text>是否提供服装:</Text>
                    <Text>{detail.clothesFlag ? '是' : '否'}</Text>
                  </View>
                  <View className="col">
                    <Text>是否提供化妆:</Text>
                    <Text>{detail.makeupFlag ? '是' : '否'}</Text>
                  </View>
                </View>
              </View>

              <View className="imgs">
                <Text class="h">详情须知</Text>
                <View className="p">{detail.detail}</View>
                {detail.imgPath &&
                  detail.imgPath.length > 0 &&
                  detail.imgPath.map((item, i) => (
                    <Image
                      mode="widthFix"
                      src={getImageUrl(item)}
                     
                      style={{ marginBottom: '5px' }}
                    ></Image>
                  ))}
              </View>

              {!isPhotographer && speechList && speechList.total && (
                <View className="listYZ">
                  <Text class="h">有{speechList.total}人为此服务验真</Text>
                  <View className="list">
                    {speechList.records.length > 0 &&
                      speechList.records.map((item, i) => (
                        <View className="item">
                          <View className="info1">
                            <Image src={getImageUrl(item.headPic)}></Image>
                            <View>
                              <Text>{item.name}</Text>
                              {item.area}
                            </View>
                          </View>
                          <View
                            className="view"
                            onClick={() =>
                              this.viewDetail(item)
                            }
                          >
                            {' '}
                            查看验真报告
                            <AtIcon value="chevron-right" size="16"></AtIcon>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {!isPhotographer && (
                <View className="Message">
                  {comments && (
                    <Text class="h">全部留言({comments.total})</Text>
                  )}
                  {comments && comments.total > 0 ? (
                    <View className="list">
                      {comments.records.map((item, i) => (
                        <View className="item" key={item.id}>
                          <Image
                            mode="widthFix"
                            src={getImageUrl(item.headPic)}
                          ></Image>
                          <View className="right">
                            <View>
                              <Text className="name">{item.name}</Text>
                              <Text className="timeM">{item.time}</Text>
                              <Text className="cont">{item.comment}</Text>
                            </View>

                            {item.reply && (
                              <View className="reply">
                                主人回复：
                                <View>{item.reply}</View>
                              </View>
                            )}
                            {detail.userid == getUserId() && (
                              <View className="replyButtonGroup">
                                <AtButton
                                  size="small"
                                  type="secondary"
                                  onClick={() =>
                                    this.handleMessageModal(true, item.id)
                                  }
                                >
                                  回复
                                </AtButton>
                                <AtButton
                                  size="small"
                                  type="secondary"
                                  onClick={() =>
                                    this.handleDeleteMessage(item.id)
                                  }
                                >
                                  删除
                                </AtButton>
                              </View>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="noData">
                      <Text> 还没人留言，我来当第一人</Text>
                      <AtButton onClick={() => this.handleMessageModal(true)}>
                        留言
                      </AtButton>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
          <View className="bottom">
            <View className="left">
              {/* <View className='col share' onClick={() => this.setState({isOpened:true})}>分享</View> */}
              <Share className="detailBtn" />

              {!isPhotographer && (
                <View
                  className={`col want ${detail.like ? 'active' : ''}`}
                  onClick={() => this.handleLike()}
                >
                  想拍
                </View>
              )}
              {!isPhotographer && (
                <View
                  className="col msg"
                  onClick={() => this.handleMessageModal(true)}
                >
                  留言
                </View>
              )}
            </View>
            <View className="right">
              {!isPhotographer && (
                <View
                  className="btn"
                  onClick={() => this.makePhone(detail.mobile)}
                >
                  电话咨询
                </View>
              )}
              {!isPhotographer && (
                <View
                  className={`btn yuyue ${
                    (detail.isBook || detail.userid == getUserId()) && 'disable'
                  }`}
                  onClick={() =>
                    {if(validateLogin()){
                      if(!(detail.isBook || detail.userid == getUserId())){
                        Taro.navigateTo({
                          url: `/pages/publish/orderPhoto?id=${id}`,
                        })
                      }
                    }
                  }
                  }
                >
                  我要预约
                </View>
              )}
              {isPhotographer && (
                <View className="btn" onClick={() => this.applyYZ()}>
                  验真申请
                </View>
              )}
            </View>
          </View>

          {messageModal && (
            <AtModal isOpened={messageModal}>
              <AtModalHeader>{replyId ? '我在回复' : '我要留言'}</AtModalHeader>
              <AtModalContent>
                <View className="modalInput">
                  <AtTextarea
                    value={this.state.comment}
                    onChange={(e) => {
                      this.setState({ comment: e })
                    }}
                    maxLength={100}
                    placeholder="请输入您想说的话..."
                  />
                </View>
              </AtModalContent>
              <AtModalAction>
                {' '}
                <Button
                  onClick={() => {
                    this.setState({ messageModal: false })
                  }}
                >
                  取消
                </Button>{' '}
                <Button onClick={() => this.handleConfirm()}>确定</Button>{' '}
              </AtModalAction>
            </AtModal>
          )}
        </View>
      )
    )
  }
}
