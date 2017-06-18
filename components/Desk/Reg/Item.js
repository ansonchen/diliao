import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Alert,Icon,Row,Col,Button,message,Select, Checkbox,Radio,Form,Input,Upload,DatePicker,Switch  } from 'antd';
import JSON from '../../Tools/Json';
import rest from '../../../utils/rest';
import reqwest from 'reqwest';
import db from '../../../config/data';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const Regitem = React.createClass({
    getInitialState() {
       return {
         pages:[],
         allowReg:true,
         catch:[],
         itemId:'',
         detailid:'',
         personId:'',
         curpage:-1,
         normBody:'读取中...',
         normBodyOk:false,
         ireadAgree:false,
         sending:false,
         addsuss:false,
       };
     },
      //取条款
     getNorm(nid){

         reqwest({
           url: 'json/norm_'+nid+'.js',
           type:'json',
           method: 'GET'
         }).then((data) => {
             this.setState({
                 normBody: data.body,
                 normBodyOk:true,
             });
         });

     },
     //取详细报名表
     getList(){
         const {itemid,id,detailid} = this.props.params ;
         reqwest({
           url: 'json/formreg_'+id+'.js',
           type:'json',
           method: 'GET'
         }).then((data) => {
             this.getNorm(data.normId);
             const pages = JSON.parse(data.pages);
             this.setState({
                pages,
                personId:data.forFormPersonId,
                itemId:itemid,
                detailid:detailid
             })
         });
     },

     scrollToTop(){
         setTimeout(()=>{
             window.scrollTo(0,0);
         },200);
     },

     //判断是否已停止报名
    getDetailItem(){

        const {itemid,id,detailid} = this.props.params ;

        rest.ajax({
             url: ajaxPath + `/addressitem/${detailid}`,
             cb:(data)=>{

                 if(data.finished == 0){
                     this.getList();

                 }else{

                      this.setState({allowReg:false})

                 }

             }
         })

    },

     componentWillMount(){
         this.getDetailItem();
     },
      //条款确定
     normSubmit(){
         if(this.state.ireadAgree){
             this.scrollToTop();
             this.setState({curpage:0})
         }
         else{
             message.warning('请务必认真阅读并同意条款');
         }
     },
     //已读同意
    onReadChange(e) {
        this.setState({ireadAgree:e.target.checked})
    },
    //最后表单发送
    handleSubmit(data){

        rest.ajax({
             url:  ajaxPath +'/regresult',
             method: 'POST',
             data: data,
             cb:(data)=>{
                  this.setState({addsuss:true});
             }
         })

    },
    //文件上件处理
    normFile(e){
       if (Array.isArray(e)) {
         return e;
       }
       return e && e.fileList;
   },
   handleUpload(info){
       if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }

   },
   //设置每页缓存
   setCatch(values,db,page){
       //处理下数据
       let ndata=[]
       db[page].map((spage,i)=>{

           let val = values[`input_${page}_${i}`];
           let ig = false;
           switch (spage.type) {
               case 'Show':
                    ig = true;
               break;
               case 'Radio':
               break;
               case 'checkbox':
                    val = val.join(',');
               break;
               case 'droplist':

               break;
               case 'Boolean':
                    val = val ? '是' : '否';
               break;
               case 'File':

               break;

               case 'Date':
                    val = val.format('YYYY-MM-DD');
               break;

           }
           if(!ig){
               ndata.push({
                 [`${spage.name}`]:val
               })
           }
       })
       return ndata;
   },

   //每页确定
   nextSubmit(page){
       this.scrollToTop();
     //  e.preventDefault();
       this.props.form.validateFieldsAndScroll((err, values) => {
         if (!err) {
            let sl = this.state.pages.length;
            //最后一页
            if(sl === (page +1)){
               let dd = this.setCatch(values,this.state.pages,page);
                dd = this.state.catch.concat(dd);
                let sdata = {
                    personId:this.state.personId,
                    addressitemId:this.state.detailid,
                    pass:0,
                    reg:JSON.stringify(dd),
                }
                //console.log(sdata);
                if(this.state.sending){
                    message.warning('正在处理，请勿重复确定');
                }else{
                    this.setState({sending:true});
                    this.handleSubmit(sdata);

                }
            }else{
               //非最后一页，
               let dd = this.setCatch(values,this.state.pages,page);
               dd = this.state.catch.concat(dd);
                 this.setState({
                     catch:dd,
                     curpage:page+1
                 })

              }


           }


       });

   },
   //对不同选项的处理
     getType(obj,i,pi){
         const { getFieldDecorator } = this.props.form;
         const formItemLayout = {
             labelCol: { span: 6 },
             wrapperCol: { span: 14 },
           };
         let html = '';
        switch (obj.type) {

            case 'text':

                html = <FormItem
                        key={`keyinput_${pi}_${i}`}
                        {...formItemLayout}
                        label={obj.name}
                        extra={obj.sub}
                        >
                        {getFieldDecorator(`input_${pi}_${i}`, {
                        rules: [
                        { required: obj.required, message: '请输入'+ obj.name },
                        ],
                        })(<Input />)}
                        </FormItem>

            break;

            case 'textarea':
                html = <FormItem
                        key={`keyinput_${pi}_${i}`}
                        {...formItemLayout}
                        label={obj.name}
                        extra={obj.sub}
                        >
                        {getFieldDecorator(`input_${pi}_${i}`, {
                        rules: [
                        { required: obj.required, message: '请输入'+ obj.name },
                        ],
                        })(<Input type="textarea" rows={4} />)}
                        </FormItem>
            break;
            case 'Radio':
            html = <FormItem
                      {...formItemLayout}
                      key={`keyinput_${pi}_${i}`}
                      label={obj.name}
                      extra={obj.sub}
                    >
                      {getFieldDecorator(`input_${pi}_${i}`, {
                      rules: [
                      { required: obj.required, message: '请选择'+ obj.name },
                      ],
                      })(
                        <RadioGroup>

                        { obj.option.split('&&&').map((ki,oi)=> <Radio key={`radio_${pi}_${i}_${oi}`} value={ki}>{ki}</Radio>)}

                        </RadioGroup>
                      )}
                    </FormItem>

            break;
            case 'checkbox':
            html = <FormItem
                      {...formItemLayout}
                      key={`keyinput_${pi}_${i}`}
                      label={obj.name}
                      extra={obj.sub}
                    >
                      {getFieldDecorator(`input_${pi}_${i}`, {
                      rules: [
                      { required: obj.required, message: '请选择'+ obj.name },
                      ],
                  })(<
                      CheckboxGroup options={obj.option.split('&&&')} />

                      )}
                    </FormItem>
            break;
            case 'droplist':
                html = <FormItem
                    {...formItemLayout}
                    key={`keyinput_${pi}_${i}`}
                    label={obj.name}
                    extra={obj.sub}
                  >
                    {getFieldDecorator(`input_${pi}_${i}`, {
                    rules: [
                    { required: obj.required, message: '请选择'+ obj.name },
                    ],
                    })(
                      <Select placeholder={`请选择${obj.name}`}>
                      { obj.option.split('&&&').map((ki,oi)=> <Option key={`select_${pi}_${i}_${oi}`} value={ki}>{ki}</Option>)}
                      </Select>
                    )}
                  </FormItem>
            break;
            case 'Boolean':
                html =<FormItem
                      {...formItemLayout}
                      key={`keyinput_${pi}_${i}`}
                      label={obj.name}
                      extra={obj.sub}
                     >
                     {getFieldDecorator(`input_${pi}_${i}`, { valuePropName: 'checked' })(
                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
                      )}
                     </FormItem>
            break;
            case 'File':
                // html =<FormItem
                //       {...formItemLayout}
                //       key={`keyinput_${pi}_${i}`}
                //       label={obj.name}
                //       extra={obj.sub}
                //      >
                //       {getFieldDecorator(`input_${pi}_${i}`, {
                //         rules: [{ required: obj.required, message: '请选择'+obj.name }],
                //         valuePropName: 'fileList',
                //         getValueFromEvent: this.normFile,
                //       })(
                //         <Upload name="logo" action="/upload.do" listType="picture" onChange={this.handleUpload}>
                //           <Button>
                //             <Icon type="upload" /> Click to upload
                //           </Button>
                //         </Upload>
                //       )}
                //     </FormItem>
            break;
            case 'Show':
            html =<Row key={`row_${pi}_${i}`}>
                  <Col span={6}></Col>
                  <Col span={14} style={{paddingBottom:10}}> {obj.name}</Col>
                </Row>

            break;
            case 'Date':
                html =<FormItem
                    {...formItemLayout}
                    key={`${obj.name}_${pi}_${i}`}
                    label={obj.name}
                    extra={obj.sub}
                    >
                      {getFieldDecorator(`input_${pi}_${i}`, {
                          rules: [{ type: 'object', required: obj.required, message: '请选择'+obj.name }],
                        })(
                        <DatePicker />
                      )}
                    </FormItem>
            break;
            default:

            break;

        }
        return html;
    },

     render() {
        let curpage = this.state.pages.map((values,pi)=>{
                          if(pi===this.state.curpage){
                              return(
                                  <div key={`page_${pi}`}>
                                    {
                                        values.map((page,i)=>this.getType(page,i,pi))
                                    }
                                    <div className="normBodyOption">
                                         <Button key={`page_btn_${pi}`} type="primary" size="large"  onClick={this.nextSubmit.bind(null,pi)}>确定</Button>
                                     </div>
                                  </div>)
                          }
                        });

        return (
            <div className="regBox">
                { this.state.curpage === -1 ?
                <div key="curpageNorm">
                    {this.state.allowReg ?
                        <div className="normBody" dangerouslySetInnerHTML={{__html: this.state.normBody}} />
                        :
                        <Alert
                            message="报名已结束"
                            description="对不起，本次课程已结束报名。"
                            type="warning"
                            showIcon
                          />
                    }

                    {this.state.normBodyOk ?
                        <div className="normBodyOption">
                         <Checkbox onChange={this.onReadChange}>我已认真阅读并同意以上条款</Checkbox>
                         <Button type="primary" size="large" onClick={this.normSubmit}>确定</Button>
                      </div>
                      :''
                    }
                </div>

               :this.state.addsuss ?
                   <Alert
                       message="报名成功"
                       description="请注意查收邮件并保持手机畅通，审核通过后将会用邮件或手机的方式通知到您。"
                       type="success"
                       showIcon
                     />
                   :
                   <Form  key="regformKey">
                       {curpage}
                    </Form>

                }

            </div>
        );
      }
})







module.exports = Form.create()(Regitem);
