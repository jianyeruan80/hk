import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { MyService } from '../my.service';
import { FormGroup, FormControl, FormArray, FormBuilder ,Validators} from '@angular/forms';
import {Router,ActivatedRoute}  from '@angular/router';
import { Observable,fromEvent,timer, Subject, throwError,forkJoin,of} from 'rxjs';
import { map, takeUntil, tap,catchError,finalize,debounceTime, timeout } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as FileSaver from "file-saver";
import { FilterPipe } from 'ngx-filter-pipe';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  constructor(private router:Router,private aRoute:ActivatedRoute,
    private myService:MyService,private _fb: FormBuilder,private filterPipe: FilterPipe) { }
  navs:Array<Object>=[
  {"key":1,"name":"首页"},
  {"key":2,"name":"最新公司"},
  {"key":3,"name":"推荐公司"},
  {"key":4,"name":"2018年之后"},
  {"key":5,"name":"2017年"},
  {"key":6,"name":"2016年"},
  {"key":7,"name":"2015年"},
  {"key":8,"name":"2014年之前"},
  
  ];
  nav:Object={"key":1,"name":"首页"};
   //@ViewChild("regDate") regDateRef:ElementRef;
    private subject: Subject<Object> = new Subject();
  user:Object={"account":"","password":""};
  selectIndex:any=1;
  rightSign:String="公司管理";//  1,公司列表，2公司列表，3，添加公司，4，添加公告.
  ads:Array<Object>=[];
  ad:Object={"title":"","content":""};
  companys:Array<Object>=[];
  company:Object={"code":"","regDate":"","name":"","slName":"","price":"","orderDate":"","orderDesc":"","desc":""};
  currentURl:String="";
  search:Object={"allName":""};

  ngOnInit() {
    
    //console.log(this.aRoute.url["_value"][0])
    this.getCompanys();
    this.getAds();
    this.currentURl=this.router.url;

     this.subject.pipe(debounceTime(500)).subscribe(data => {
       
           let value=(data["value"] || "").replace(/[^0-9]/ig,"");
             
             if(value.length>=6){ 
                 value=value.replace(/(\d{4})(\d{2})(\d{0,2})(.*)/,"$1-$2-$3");
              }else if(value.length>=4){
                value=value.replace(/(\d{4})(\d*)/, "$1-$2");
              }
              if(value)
              this.company[data["key"]]=value;
  });
    if(this.myService["user"]["_id"]){
                    this.navs.push({"key":this.navs.length+1,"name":"管理中心"});
                    this.navs.push({"key":this.navs.length+1,"name":"退出"});
  //fromEvent(this.regDateRef.nativeElement, 'keyup')
  /*this.regDate.valueChanges.pipe(
    map(ev => ev["currentTarget"].value),debounceTime(300)
    ).subscribe(data=>{
           
             let value="";
             data= data.replace(/[^0-9]/ig,"");
                    
             if(data.length>=8){ 
                 value=data.replace(/(\d{4})(\d{2})(\d{0,2})(.*)/,"$1-$2-$3");
              }else if(data.length>=6){
                value=data.replace(/(\d{4})(\d*)/, "$1-$2-");
              }else if(data.length>=4){
                value=data.replace(/(\d{4})(\d*)/, "$1-$2");
              } 
              
               this.myForm.patchValue({"phone2":value});
             
           
        })*/
    }
  }
  checkedDate(data){
     
   this.subject.next(data);

  }
  s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
  downLoadExcel(){
   let excel=this.filterPipe.transform(this.companys, this.search);
    const excelArr=[["#","注册编号","成立日期","名称(英文)","名称(中文)"]];
    if(excel.length>0){
      for(let i in excel){
          excelArr.push([parseInt(i+1),excel[i]["code"],excel[i]["regDate"],excel[i]["name"],excel[i]["slName"]]);
        }   

    let excelName=this.search["recommend"]?"recommend":(this.search["year"] || "All");
    console.log(excelArr)
    const ws = XLSX.utils.aoa_to_sheet(excelArr);
    const wb = {SheetNames: ["Company"], Sheets:{Company:ws }};
    const buf = XLSX.write(wb,  { bookType:'xls', bookSST:false, type:'binary' });
   
   FileSaver.saveAs(new Blob([this.s2ab(buf)],{type:"application/octet-stream"}), excelName+".xls");
   }else{
      this.myService.openMessage({"message":"Not data!"})
   }
  }
  link(arg){

    this.nav=arg;
  	this.selectIndex=arg["key"];
    this.rightSign="公司管理";
    switch (this.selectIndex) {
       case 1:
         
          this.search={};
        break;
         case 2:
          this.search={};
        break;
         case 3:
          this.search={"recommend":true};
        break;
        case 4:
          this.search={"year":"2018"};
        break;
        case 5:
          this.search={"year":"2017"};
        break;
        case 6:
          this.search={"year":"2016"};
        break;
         case 7:
          this.search={"year":"2015"};
        break;
         case 8:
          this.search={"year":"2014"};
        break;
         case 9:
          this.search={};
        break;
      case 10:
          this.myService["user"]={};
          this.selectIndex=1;
          this.router.navigate(['']);
        break;
      
      default:
        // code...
        break;
    }
  }
  save(){
     let  sendData={"url":"/api/otherproducts"};
     sendData["data"]=this.company;
     if(this.company["_id"]){
       sendData["method"]="put";
       sendData["url"]="/api/otherproducts/"+this.company["_id"];
   }
     this.myService.service(sendData).subscribe(data=>{
      
                  if(!data["message"]){
                      //let tempData=JSON.parse(JSON.stringify(data));

                      this.rightSign="公司管理";
                      
                      if(sendData["method"] !="put"){
                       this.companys.push(data);
                      }
                       for(var i in this.companys){
                        if(data["_id"]==this.companys[i]["_id"]){
                        let year=this.companys[i]["regDate"].substring(0,4);
                        if(year>=2018){
                          year="2018";
                        }else if(year<=2014){
                          year="2014";
                        }
                         this.companys[i]["year"]=year;

                         if(this.search["year"])this.search["year"]=year;
                       this.companys[i]["allName"]=this.companys[i]["name"]+this.companys[i]["slName"];
                       
                        break;
                      }
                      }
                      /*if(this.search){
                        this.se
                      }*/
                  }   
            })
  }

  saveAd(){
     let  sendData={"url":"/api/otherads"};
     sendData["data"]=this.ad;
     if(this.ad["_id"]){sendData["method"]="put";
      sendData["url"]="/api/otherads/"+this.ad["_id"];
    }
     this.myService.service(sendData).subscribe(data=>{
      
                  if(!data["message"]){
                    this.rightSign="公告管理";
                    if(sendData["method"] !="put"){
                    this.ads.unshift(data);
                   }
                   
                  }   
            })
  }
  deleteCompany(){
     let  sendData={"url":"/api/otherproducts/"+this.company["_id"],"method":"delete"};
      this.myService.service(sendData).subscribe(data=>{
      if(!data["message"]){
                    for(var i in this.companys){
                       if(this.company["_id"]==this.companys[i]["_id"]){
                         this.companys.splice(parseInt(i),1);
                           this.company={};
                         break;
                       
                       }
                    }
                   
                    }   
            })
  }
   deleteAd(){
      let  sendData={"url":"/api/otherads/"+this.ad["_id"],"method":"delete"};
      this.myService.service(sendData).subscribe(data=>{
      if(!data["message"]){
                    for(var i in this.ads){
                       if(this.ad["_id"]==this.ads[i]["_id"]){
                         this.ads.splice(parseInt(i),1);
                         this.ad={};
                         break;
                        
                       }
                    }
                   
                    }   
            })
   }
  login(){
    
     let  sendData={"url":"/api/otheradmins/login"};
     sendData["data"]=this.user;
     this.myService.service(sendData).subscribe(data=>{
      
                  if(!data["message"]){
                    this.myService["user"]=data;
                   
                    this.router.navigate(['/manager']);
                    
                    
                   // 
                  }   
            })
    
  }
  clickCompany(event,item){
     if(item)this.company=item;
    switch (event.target.innerText) {
      case "未推荐":
           this.company["recommend"]=true;
           this.save();
        break;
      case "已推荐":
          this.company["recommend"]=false;
          this.save();
        break;
        case "修改":
            this.rightSign="公司管理添加";
           
        break;
        case "删除":
        this.deleteCompany();
          // code...
        break;
      default:
        // code...
        break;
    }
  }
  clickItem(event){
    
     if(event.target.innerText=="添加"){
         if(event.currentTarget.innerText.indexOf("公司管理")>=0){
           this.rightSign="公司管理添加"
           this.company={};
         }else{
           this.rightSign="公告管理添加";
           this.ad={};
         }
     }else{
        this.rightSign=event.target.innerText;
        this.search={};
        this.selectIndex=9;
     }
    
   // this.rightSign=event.target.innerText;
  }
  clickAd(event,item){
    if(item)this.ad=item;
    switch (event.target.innerText) {
      case "已关闭":
           this.ad["active"]=true;
           this.saveAd();
        break;
      case "已开启":
          this.ad["active"]=false;
          this.saveAd();
        break;
        case "修改":
            this.rightSign="公告管理添加";
           
        break;
        case "删除":
        this.deleteAd();
          // code...
        break;
      default:
        // code...
        break;
    }

  }
  getCompanys(){
     let  sendData={"url":"/api/otherproducts","method":"get"};
       sendData["data"]={}
       this.myService.service(sendData).subscribe(data=>{
        
                    if(!data["message"]){
                     // this.myService["user"]=data;
                      //this.router.navigate(['/manager']);
                      this.companys=data;
                      for(var i in this.companys){
                        let year=this.companys[i]["regDate"].substring(0,4);
                        if(year>=2018){
                          year="2018";
                        }else if(year<=2014){
                          year="2014";
                        }
                        this.companys[i]["year"]=year;
                        this.companys[i]["allName"]=this.companys[i]["name"]+this.companys[i]["slName"];
                      }
                     // console.log(this.navs)
                     // 
                    }   
              })
  }
  getAds(){
       let  sendData={"url":"/api/otherads","method":"get"};
       sendData["data"]={}
       this.myService.service(sendData).subscribe(data=>{
        
                    if(!data["message"]){
                      this.ads=data;
                   
                    }   
              })
  }  
}

