import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce';
import Load from './Load';

const Fulledit = React.createClass({
    getInitialState() {
      return {
        tmc: '',
        ready:false
      }
    },

  getDefaultProps(){
      return {
        obj:''
      };
  },
   handleInit(e) {
       if(this.state.tmc==''){
         this.setState({tmc:e.target})
       }

   },
  handleEditorChange(e) {
      let that = this.props.obj;
      that.setState({
          fullText:e.target.getContent()
      })
    //console.log(e.target.getContent());
    // this.refs.body.value = e.target.getContent()
  },
  componentWillReceiveProps(){
      let that = this.props.obj;
      if(this.state.tmc!=''){
          this.state.tmc.setContent(that.state.fullText);
      }
  },

  componentWillMount(){

      if(typeof(tinymce)==='undefined'){
          //首次加载编辑器
          Load.js('//tinymce.cachefly.net/4.1/tinymce.min.js',()=>{
             Load.js('zh_CN.js',()=>{
                 this.setState({ready:true})
             })
          })
      }else{
           this.setState({ready:true})
      }
  },

  render() {
      let that = this.props.obj;
      let html = this.state.ready ?

      <TinyMCE
        content={that.state.fullText}
        config={{
          height : 460,
          plugins: 'autolink link image lists print preview',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
        }}
        onInit={this.handleInit}
        onChange={this.handleEditorChange}
      />
      : <div style={{height:460}}>加载中...</div>;

    return (
        <div>{html}</div>
    );
  }
});

module.exports = Fulledit;
