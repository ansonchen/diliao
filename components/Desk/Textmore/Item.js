import React from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';

const Textmore = React.createClass({
    getInitialState() {
       return {
         data:[],
         requesting:false,
         ready:false
       };
     },
     getDefaultProps(){
      return {
        id:'',
      };
     },

     getList(){
            const id = this.props.id ;
            reqwest({
              url: 'json/book_'+id+'.js',
              type:'json',
              method: 'GET'
            }).then((data) => {
                this.setState({
                  data: data,
                  requesting:false,
                  ready:true
                });
            });
     },

     componentWillMount(){
         this.setState({
             requesting:true
           });
         this.getList();
     },

     componentWillReceiveProps(nextProps){

          if(this.state.requesting) return false;

          this.setState({
                ready:false
           });

         if(this.props.id===nextProps.id){
             this.getList();
         }
     },

     showDetail(e){
        if(this.refs[e].className!=='show'){
            this.refs[e].className='show'
        }else{
            this.refs[e].className='hide'
        }

     },
      render() {

        const {ready,data} = this.state;

        const dhtml = data.length ? data.map((k,i)=>
                            <div key={`bookBox_${k.id}_${i}`}>
                            { i > 0 ?
                            <dl key={`book_${k.id}_${i}`}>
                             <dt><a href="javascript:void(0)"  onClick={this.showDetail.bind(null,`dd_${k.id}_${i}`)}>{k.name}</a></dt>
                             <dd ref={`dd_${k.id}_${i}`} className="hide"><div dangerouslySetInnerHTML={{__html: k.body}} /></dd>
                            </dl>

                            :
                            <dl key={`book_${k.id}_${i}`}>
                             <dt>{k.name}</dt>
                             <dd><div dangerouslySetInnerHTML={{__html: k.body}} /></dd>
                            </dl>
                            }
                            </div>
                       ):'暂无数据';


        return (
            <div className="bookRead">
                 {ready ? dhtml : '加载中...'}
             </div>
             )


      }
})

module.exports = Textmore
