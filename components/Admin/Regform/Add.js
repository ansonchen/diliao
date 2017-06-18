import React from 'react';
import ReactDOM from 'react-dom';
import rest from '../../../utils/rest';
import { Select,Tabs, Radio, Checkbox, Button, DatePicker, TimePicker,Input, InputNumber, Form, Cascader, Icon,message } from 'antd';
import Ajaxselect from '../../Tools/Ajaxselect';
import Addinput from '../../Tools/Addinput';
import JSON from '../../Tools/Json';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;


let NormForm = React.createClass({
    getInitialState() {

        const panes = [
          { title: '第1页', key: 'newTab0', skey:0 },
        ];
        return {
          activeKey: panes[0].key,
          panes,
          data:[],
          [`data0`]:[],
        };
    },
    onTabsChange(activeKey) {
      this.setState({ activeKey });
    },

    onTabsEdit(targetKey, action) {

      //console.log(action+':'+targetKey)
      // this[action](targetKey);
       this.removeTabs(targetKey);
    },
    addTabs() {

        const panes = this.state.panes;

        const nt = panes.length ? Number(panes[panes.length-1]['skey'])+1 : 0;

        const activeKey = `newTab${nt}`;

        panes.push({ title: `第${nt+1}页`, key: activeKey,skey:nt,[`data${nt}`]:[] });

        this.setState({ panes, activeKey });
    },
    removeTabs(targetKey) {

      let activeKey = this.state.activeKey;
      let lastIndex;

      this.state.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });

      const panes = this.state.panes.filter(pane => pane.key !== targetKey);

      if (lastIndex >= 0 && activeKey === targetKey) {

        activeKey = panes[lastIndex].key;

      }
      this.setState({ panes, activeKey });
  },
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },


  fetch() {

    let id = this.props.params.id ;

    rest.ajax({
         url: ajaxPath +'/formreg/'+id,
        cb:(data)=>{

          //对数据进行处理
          let val = {
              name:data.name,
              forFormPersonId:data.forFormPersonId,
              normId:data.normId
          };

          const {getFieldDecorator} = this.props.form;
          //分页；
          if(typeof(data.pages)==='string'){

              let pages = JSON.parse(data.pages);
              const panes = [];
              pages.map((values,pi)=>{
                  //分页
                  panes.push({
                       title: `第${pi+1}页`,
                       key: `newTab${pi}`,
                       skey: pi ,
                       //[`data${pi}`]:values
                  })

                  let keys_p = [];

                  values.map((k,index)=>{

                      keys_p.push(index);

                      val[`names-${pi}-${index}`]=k.name;
                      val[`sub-${pi}-${index}`]=k.sub;
                      val[`required-${pi}-${index}`]=k.required;
                      val[`addtype-${pi}-${index}`]=k.type;

                      // 防止tabs 不提交表单
                      getFieldDecorator(`names-${pi}-${index}`, { initialValue:k.name });
                      getFieldDecorator(`sub-${pi}-${index}`, { initialValue:k.sub });
                      getFieldDecorator(`required-${pi}-${index}`, { initialValue:k.required });
                      getFieldDecorator(`addtype-${pi}-${index}`, { initialValue:k.type });


                      if(typeof(k.option)==='string'){

                          let typekeys = k.option.split('&&&');

                          let additemtypekeys = [];

                          typekeys.map((ki,indexi)=>{
                              additemtypekeys.push(indexi);
                              val[`keys-${pi}-${index}-names-${indexi}`] = ki;
                              getFieldDecorator(`keys-${pi}-${index}-names-${indexi}`, { initialValue:ki});
                          })

                          val[`additemtypekeys-${pi}-${index}`] = additemtypekeys;
                          getFieldDecorator(`additemtypekeys-${pi}-${index}`, { initialValue:additemtypekeys});
                      }

                  })

                  val[`keys_${pi}`] = keys_p;
                  getFieldDecorator(`keys_${pi}`, { initialValue:keys_p });

                   this.setState({
                      //[`keys_${pi}`]:keys_p,
                      [`data${pi}`]:val,
                   });

              })

              this.setState({
                data: val,
                panes
              });


          }else{

            this.setState({
              data: val
            });
        }
     }
    })


  },

  componentDidMount() {

    if(this.props.params.id != 0){
        this.fetch();
    }
  },

  addformReg(values,add){

      let id = this.props.params.id;
      if(add){id = 0}
      rest.ajax({
          url: (id != 0) ? ajaxPath +'/formreg/'+ id : ajaxPath +'/formreg',
          method: (id != 0) ? 'PUT': 'POST',
          data: values,
          cb:(data)=>{
              message.success('成功');
               let that = this;
               setTimeout(()=>{
                   that.props.router.replace('/formreg')
               },1000)
          }
      })
  },
  curentTime(){
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day  : day;
        hh = hh < 10 ? "0" + hh  : hh;
        mm = mm < 10 ? "0" + mm  : mm;
        return `${year}-${month}-${day} ${hh}-${mm}`;
    },

  sendform(add){

      this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      values.creatTime = this.curentTime();

     // console.log(values);
      //重新封装下数据
      let val = {
          name:values.name,
          forFormPersonId:values.forFormPersonId,
          normId:values.normId,
          creatTime:values.creatTime,

      };

      //分页；
      if(typeof(this.state.panes) === 'object'){
          let pages= [];


          this.state.panes.map((p,i)=>{

              let pi = p.skey;

              if(typeof(values[`keys_${pi}`])==='object'){

                  let include=[];

                  values[`keys_${pi}`].map((k,index)=>{

                      let inv={
                          name:values[`names-${pi}-${k}`],
                          sub:values[`sub-${pi}-${k}`],
                          required:values[`required-${pi}-${k}`],
                          type:values[`addtype-${pi}-${k}`]
                         };

                        //对选项处理
                      if(['Radio','checkbox','droplist'].indexOf(inv.type) > -1 &&  typeof(values[`additemtypekeys-${pi}-${k}`])==='object'){
                            let items = [];
                            values[`additemtypekeys-${pi}-${k}`].map((ki,indexi)=>{

                                items.push(values[`keys-${pi}-${k}-names-${ki}`]);

                            })
                            inv.option = items.join('&&&');

                      }

                      include.push(inv);


                  });

                   pages.push(include);
                  //val.include = include;
                  //console.log(include)
                  //提交一个字符串
                 // val.include = JSON.stringify(include);

              }


          })


          val.pages = JSON.stringify(pages);

      }


       //console.log(val)
       this.addformReg(val,add);

      })




  },
  handleSubmit(e) {
    e.preventDefault();
    this.sendform(0);
  },


  copySubmit(e) {
    e.preventDefault();
    this.sendform(1);
  },

  render() {

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const copyBtn =   (this.props.params.id != 0) ? <Button type="primary" onClick={this.copySubmit}>复制增加</Button> :'';
    const operations = <Button onClick={this.addTabs}>添加页</Button>;
    const ndata = this.state.data;
    return (
      <Form horizontal >

          <FormItem
            {...formItemLayout}
            label="报名表名称"
          >
          {getFieldDecorator('name', {
            initialValue:ndata.name,
            rules: [
              { required: true, message: '请输入报名表名称' },
            ],
        })(<Input />)}
          </FormItem>

          <Ajaxselect
              form={this.props.form}
              path="/_Person"
              name="forFormPersonId"
              label="报名对象"
              defaultValue={ndata.forFormPersonId}
          />
          <Ajaxselect
              form={this.props.form}
              path="/norm"
              name="normId"
              label="规范"
              defaultValue={ndata.normId}
          />

             <Tabs tabBarExtraContent={operations}
               hideAdd
               onChange={this.onTabsChange}
               activeKey={this.state.activeKey}
               type="editable-card"
               onEdit={this.onTabsEdit}
             >
               {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}> <Addinput form={this.props.form} akeys={pane.skey} data={this.state[`data${pane.skey}`]}/></TabPane>)}
             </Tabs>




        <FormItem
          wrapperCol={{ span:20, offset: 4 }}
        >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
           {copyBtn}
           &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>

        </FormItem>
      </Form>
    );
  },
});

NormForm = createForm()(NormForm);
module.exports = NormForm;
