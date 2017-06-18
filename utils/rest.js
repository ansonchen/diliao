import reqwest from 'reqwest';
module.exports = {

    sending: !1,

    maxNum:100,
    
    rootObj:document.getElementById('root'),
    
    _token:'',
    
    setToken(cb){
      
      let that = this;

      //const lt = localStorage._token;
      const lt = that.rootObj.getAttribute('data-token');
      if (lt) {
          return cb ? cb(lt) : lt ;
      }
      if(that.sending) {

          console.log('wait token...')

          setTimeout(()=>{
              that.maxNum--;
              if(that.maxNum === 0 ){
                  that.sending = !1;
                  that.maxNum = 100;
                  console.log('timeout error...')
              }else{
                  that.setToken(cb);
              }

          },100)

          return false;
      }
      that.sending = !0;

      reqwest({
        url:  '/php-api-auth-master/login_token.php' ,
        method:'post',
        data: {
          username:'admin',
          password:'admin',
        },
      }).then((data) => {

          data = data.replace(/"/g,'');

          reqwest({
            url:  '/api.php' ,
            method:'post',
            data: {
              token:data
            },
          }).then((csrf) => {
             that.sending = !1;
             csrf = csrf.replace(/"/g,'');
             that.rootObj.setAttribute('data-token',csrf);
             that._token = csrf;
             //localStorage._token = csrf;
             return cb ? cb(csrf) : csrf ;

          }).fail(function (err, msg) {
             console.log(msg)
          });


      }).fail(function (err, msg) {
         console.log(msg)
      });

    },

    getToken(cb) {
        const lt = this.rootObj.getAttribute('data-token');
        lt ? cb(lt) : this.setToken(cb)

     },

    getCsrf(cb) {
        if(this._token!==''){
            cb(this._token)
        }else{
            
            this.getToken(cb);
            
        }
        
    },

    clearToken(){
        //delete localStorage._token;
        this.rootObj.removeAttribute('data-token');
    },

    resetToken(cb){
        this.clearToken();
        this.getCsrf(cb);
    },
    ajaxNoCSRF(option){
        let url = option.url;
        reqwest({
          url: url,
          method: option.method || 'GET',
          type: option.type || 'json',
          data:option.data || {},
        }).then((data) => {
            option.cb(data)
        });
    },
    ajax(option){

        if(!option.url) return false;
        //this.ajaxNoCSRF(option);

         let url = option.url.indexOf('?') >-1  ?  option.url + '&' : option.url + '/?';
         this.getCsrf((csrf)=>{
        
                 reqwest({
                   url: url + 'csrf='+ csrf,
                   method: option.method || 'GET',
                   type: option.type || 'json',
                   data:option.data || {},
                 }).then((data) => {
                     option.cb(data)
                 });
        
         })
    }

}
