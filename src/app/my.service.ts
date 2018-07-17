import { Injectable,ViewChild,ElementRef } from '@angular/core';


import {Router,ActivatedRoute}  from '@angular/router';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

import { Observable,fromEvent,timer, Subject, throwError,forkJoin,of} from 'rxjs';
import { map, takeUntil, tap,catchError,finalize,debounceTime, timeout } from 'rxjs/operators';

@Injectable()
export class MyService {
    @ViewChild("toastRef") toastRef: ElementRef;
    loading:Boolean=false;
    mId:String="M0000001"
    isMask:Boolean=false;
    store:Object={};
    error:Boolean=false;
    message:String="";
    delayTime:any=2.5;
    errorType:String="";
    user:Object={"navs":[]};
    w:Number=4;
    customer:Object={};
    
    Math:any;
    order:Object={"total":0,"subTotal":0,"Delivery":"","Discount":0,"tax":0,"items":[]};
    orderObj:Object={};
    colors:Array<String>=[
   "#b3ffe1","#d3ffce"
   ,"#b0e0e6"
   ,"#f4cccc"
   ,"#b5b632"
   ,"#ffc100"
   ,"#d3f8a3"
   ,"#f8a3d3"
   ,"#a3d3f8"
   ,"#cbb076","#e4eddb","#ffe2e2","#fff9e0","#bad7df","#c4eada","#c5f0a4"] 	
    orderType:Array<String>=["All","Dine In","To Go","Delivery","Pick Up"];
  public eventBus:Subject<Object>=new Subject<Object>();
  constructor(public http: HttpClient,
  public router:Router) {

    this.Math=Math;
  }
  openMessage(msgJson){
       let type=msgJson["type"] || ".toastError";
       let icon=(type=='.toastError')?'fa-exclamation-triangle':'fa-check-circle';
       let origin=document.querySelector(type);  
       let originCopy =origin.cloneNode(true);
       originCopy["classList"].remove("dsn");
       origin["after"](originCopy);
       originCopy.parentNode.removeChild(origin);
       originCopy["innerHTML"]='<i class="fa '+icon+' ria-hidden="true"></i>&nbsp;&nbsp;'+(msgJson["message"] || "Connect error or timeout");
    
       
      
 } 


   /*
   error:false,显示错误;
   loading:true,要loading
   errorType:error
   */
   service(sendData){
    this.loading=true;
    if(sendData["loading"])this.loading=false;
    let method=sendData["method"] || "post";
    let data=sendData["data"] || {};  
    let url=sendData["url"];
    this.error=sendData["error"];
   
    if(sendData["file"]){
      let fileName=data["fileName"] || new Date().getTime();
      let formData = new FormData(); 
      formData.append("file", sendData["file"]);
      formData.append("name",fileName);
    }
  const params = sendData["params"] || {};//new HttpParams({fromObject:params });
  data["mId"]="M0000001";//new Date().getTimezoneOffset()*60;
   if(method=="get"){
       url+="?mId=M0000001&"+Object.keys(params).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
        }).join("&");
   }
    console.log(environment.apiBase+url)
  data["mId"]=this.mId;
  return this.http[method](environment.apiBase+url, data, {params:new HttpParams({fromObject:params })})
            .pipe(
                    map(res =>{
                      
                      if(!this.error && res["message"]){this.openMessage(res)};
                       return res;
                     }),
                    catchError(err=>{
                      
                       this.openMessage(err);
                       return err;
                      
                       
                    }),finalize(() => {
                      if(!sendData["loading"])
                      this.loading=false;
                })
          )  
      
    }
   /* randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(parseInt(this.Math.random())*minNum+1)); 
        break; 
        case 2: 
            return parseInt(this.Math.random())*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} */
 checkout(){
      /*this.order={"total":0,"subTotal":0,"delivery":0,"discount":0,"tax":0,"tip":0,"items":[]
      ,"orderType":"Pick Up","paymentType":"Cash","firstName":[],"lastName":[],"phone":[],
       
      address:{
        "addr":[],"city":[],"state":[],"zipCode":[]},
        credit:{"cardNo":[],"expires":[],"ccv":[],"holderName":[]}};
      for(let i in this.orderObj){
          this.order["items"].push(JSON.parse(JSON.stringify(this.orderObj[i])));
      }
      this.order["items"].sort(function(a,b){
          
          return a["time"]>b["time"];
      })
      for(let i in this.order["items"]){
        this.order["items"][i]["currentPrice"]=this.order["items"][i]["price"];
        this.order["items"][i]["taxesTotal"]=0;
          for(let j in this.order["items"][i]["selectOptions"]){
            this.order["items"][i]["currentPrice"]+=this.order["items"][i]["selectOptions"][j]["price"];
          }
          this.order["subTotal"]+=parseFloat((this.order["items"][i]["currentPrice"]*this.order["items"][i]["qty"]).toFixed(2));

         for(let j in this.order["items"][i]["taxes"]){
              this.order["items"][i]["taxes"][j]["tax"]=
              parseFloat((this.order["items"][i]["currentPrice"]*this.order["items"][i]["taxes"][j]["tax"]).toFixed(2));
             
              this.order["items"][i]["taxesTotal"]+=this.order["items"][i]["taxes"][j]["tax"];
          }


          this.order["items"][i]["taxesTotal"]=parseFloat(this.order["items"][i]["taxesTotal"].toFixed(2));
          this.order["tax"]+=parseFloat((this.order["items"][i]["taxesTotal"]*this.order["items"][i]["qty"]).toFixed(2));
        
       }
       this.order["total"]=parseFloat((this.order["subTotal"]+this.order["tax"]
         +this.order["delivery"]+this.order["discount"]).toFixed(2));
         window.localStorage.setItem(this.mId,JSON.stringify(this.orderObj));*/
       
     }

     

}
