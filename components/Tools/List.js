import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Icon,Table,Button,Popconfirm,message } from 'antd';
const ButtonGroup = Button.Group;
import rest from '../../utils/rest';
import db from '../../config/data';
import JSON from './Json';

const List = React.createClass({

     getDefaultProps(){
      return {
        path:'',
        params:'',
        buildPath:'',
        showBuild:false,
        btn:[],
        columns:[],
      };
     },

     getInitialState() {
        return {
          data: [],
          pagination: {},
          loading: false,
        };
      },
     delNorm(id){
          const path = this.props.path;
          const  pid = this.props.params !== '' ? this.props.params.id : '' ;
          const spath = path.toLowerCase().split('?')[0];

          rest.ajax({
              url:  ajaxPath +  spath +'/'+ id ,
              method:'DELETE',
              cb:(data)=>{
                  message.success('成功');
                   let that = this;
                   setTimeout(()=>{

                       that.props.router.replace(spath+'/'+pid)
                   },600)
              }
          })

      },
      handleTableChange(pagination, filters, sorter) {

        const pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });

        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });

      },

      buildData() {

         let data = this.state.data;
         let id = this.props.params.id || 'json';


         rest.data2js({
             name:id+'.js',
             path:this.props.buildPath,
             data:JSON.stringify(data),
             cb:(data)=>{
                  console.log(data)
                  message.success('成功');
             }

         });



      },
      fetch(params = {}) {

        console.log('params:', params);
        const path = this.props.path;

        rest.ajax({
             url: ajaxPath + path,
             data: {
               _limit: 10,
               ...params,
             },
            cb:(data)=>{
              const records = db.toRecords(path,data);

               // console.log(data)

              const pagination = this.state.pagination;
              // Read total count from server
               pagination.total = records.length;
              //pagination.total = 200;

              this.setState({
                loading: false,
                data: records,
                pagination,
              });

            }
        })

      },

      componentDidMount() {
         this.setState({ loading: true });
         this.fetch();
      },
      componentWillReceiveProps(nextProps){

          if(this.state.loading) return false;
//          console.log('now:'+this.props.path);
//           console.log('nex:'+nextProps.path);
          if(this.props.path===nextProps.path){
                this.fetch();
          }
      },
      linkTo(){
          const  idPath = this.props.params !== '' ? '/'+this.props.params.id : '' ;
          const path = this.props.path.toLowerCase().split('?')[0];
          this.props.router.replace(`${path}add${idPath}/0`);
      },

      render() {

        const  idPath = this.props.params !== '' ? '/'+this.props.params.id : '' ;
        const columns = this.props.columns.concat([
              {
            title: '操作',
            dataIndex: 'id',
            render: text =>[<ButtonGroup key={`bg_${text}`}>
                <Button><Link to={`${this.props.path.toLowerCase().split('?')[0]}add${idPath}/${text}`} className="button block">修改</Link></Button>
                <Popconfirm placement="top" title="确定要删除吗？" onConfirm={this.delNorm.bind(null,text)}><Button>删除</Button></Popconfirm>
                {
                 this.props.btn.map((k,bi)=><Button key={`btn_${text}_${bi}`}>
                 <Link to={`${k[1]}/${text}`} className="button block">{k[0]}</Link>
                 </Button>)}
                 </ButtonGroup>],
            width: '200px',
          }]);

        return (
            <div>
            <div className="optionBar">
            <Button type="primary" onClick={this.linkTo}>添加</Button>
            {this.props.showBuild ?
                <Button onClick={this.buildData} style={{marginLeft:10}}>生成静态</Button>
                :''
            }
            </div>
              <Table columns={columns}
                rowKey={record => record.id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
          </div>
        );
      }
})

module.exports = List
