module.exports = {

    _isArray(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    },

    toRecords(tableName,data){
        if(this._isArray(data)){
            return data;
        }else{
            //组装下数据
            let name = tableName.split('?').shift().replace('/','');
            let columns = data[name]['columns'];
            let records = data[name]['records'];
            let ndata =[];

            records.map((rec)=>{
                let cols={}
                columns.map((col,i)=>{
                    cols[`${col}`] = rec[i]
                })
                ndata.push(cols);
                cols = null;
            })
            //console.log(ndata)
            return ndata;


        }

    },
    
    formatUrl(url){
        //`?filter=typeid,eq`
        // 本地数据
        if(ajaxPath.indexOf(':3000') > -1 && url.indexOf('?filter=')>-1){
            url = url.replace('?filter=','?').replace(',eq,','=')        
        }
        
         if(ajaxPath.indexOf(':3000') === -1 && url.indexOf('?filter=')=== -1){
            url = url.replace('=',',eq,').replace('?','?filter=');        
        }
        
        return url;
    },
    
    getRecords(data){

        if(this._isArray(data.records)){
            return data.records
        }
    }

}
