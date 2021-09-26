import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Request from '../../utils/request';

import {baseUrl,ImageUrl} from '../../config';
import { AtActivityIndicator, AtImagePicker} from "taro-ui"

import './index.scss';
export default class imageUpload extends Component {

    constructor (props) {
      super(props)
      this.setState ({
        files: [],
        loading: false,

      })
    }


    componentWillMount () {

    }

    componentDidMount () {
      console.log(this.props.files,999)
      this.setState({files:this.props.files})

    }

    componentWillReceiveProps(nextProps) {
      
     
      
    }




    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    onChangeFile(files, operationType) {
      console.log(files, operationType,9998877);
      if (operationType === 'remove') {
        this.setState({
          files,
        })
      }
  
      // console.log(files)
      //  this.setState({
      //    files
      //  })
      if (operationType === 'add') {
        files.map((item, i) => {
          if (!item.url.startsWith(ImageUrl)) {
            const file = item
            console.log(file)
            this.setState({
              //files
              loading: true,
            })
            const that = this
            Taro.uploadFile({
              url: baseUrl + 'api/img',
              filePath: file.url,
              name: 'file',
              formData: {
                file: files,
              },
              header: {
                //  Authorization : getAccessToken(),
                'Content-Type': 'multipart/form-data',
                accept: 'application/json',
              },
              success(res) {
                const data = JSON.parse(res.data)
                files[i].url = data.data.path
  
                that.setState({
                  files,
                  loading: false,
                })

                that.props.onOk && that.props.onOk({ files });
                
  
                //do something
              },
              fail() {
                console.log(1111)
              },
            })
          }
        })
      }
    }

    render () {
      //console.log(this.state.isOpened,98989)
        

        return (
          <View>
             <AtActivityIndicator
              mode="center"
              isOpened={this.state.loading}
              content="上传中..."
              ></AtActivityIndicator>
              <AtImagePicker
               className="imageUpload"
                files={this.state.files}
                onChange={this.onChangeFile.bind(this)}
                showAddBtn={this.state.files.length < 10}
                multiple
              />

          </View>
        )
    }
}
