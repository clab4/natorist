var idx=0;  //情報の数
var ddata = {};
var link={};
var reader;
var c_objectId1=[]; //リスト表示時のCoupon_listのobjectId保存
var c_objectId2       //詳細画面のobjectId
var userid;             //installationのobjectId
var c_limit=[];       //取得したクーポン使用回数
var showCoupon;  //ダイアログに表示するdetail保存
var e_class;
var e_geo;

document.addEventListener('init', function(event) {
  var page = event.target;

  switch(page.id) {
  case 'info-page':
      //情報ページ表示時の初期設定
    
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = reader.result;
      document.getElementById("info-img").src = dataUrl;
    }
    ncmb.File.download(encodeURIComponent(page.data.img), "blob")
    .then(function(blob) {
      reader.readAsDataURL(blob);
    })
    .catch(function(err) {
      console.error(err);
    })
    
    document.getElementById("info-title").innerHTML = page.data.title;
    //document.getElementById("info-img").src = page.data.img;
    document.getElementById("info-detail").innerHTML = page.data.detail;
    break;
    
    case 'coupon-info-page':
      //情報ページ表示時の初期設定
    console.log(page.data.title);
    
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = reader.result;
      document.getElementById("info-img").src = dataUrl;
    }
    ncmb.File.download(encodeURIComponent(page.data.img), "blob")
    .then(function(blob) {
      reader.readAsDataURL(blob);
    })
    .catch(function(err) {
      console.error(err);
    })
    
    document.getElementById("info-title").innerHTML = page.data.title;
    //document.getElementById("info-img").src = page.data.img;
    document.getElementById("info-detail").innerHTML = page.data.detail;
    break;

     case 'event-info-page':
      //情報ページ表示時の初期設定
    console.log(page.data.title);
    
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = reader.result;
      document.getElementById("info-img").src = dataUrl;
    }
    ncmb.File.download(encodeURIComponent(page.data.img), "blob")
    .then(function(blob) {
      reader.readAsDataURL(blob);
    })
    .catch(function(err) {
      console.error(err);
    })
    
    document.getElementById("info-title").innerHTML = page.data.title;
    //document.getElementById("info-img").src = page.data.img;
    document.getElementById("info-detail").innerHTML = page.data.detail;
    break;
    
    case 'map-page':

    //マップ表示
    console.log("map page init");
    // Geolocation APIに対応している
    if (navigator.geolocation) {
      //alert("この端末では位置情報が取得できます");
        startDrawCurrentPosition();
    // Geolocation APIに対応していない
    } else {
      alert("この端末では位置情報が取得できません");
    }
    break;

    
     case 'main-page':
    //メインページ
    displayList("News_List", "newsItems");
    break; 

    case 'coupon-page':
        //クーポンページ
        displayList("Coupon_List", "couponItems");
    break;
          
     case 'event-page':
         //イベントページ
          displayList("Event_List", "eventItems");
     break;
  }
});

function displayList(dbName, listId){

  //日付取得
 var  today=getDay();

　//開始期間、終了期間と比較
  var events = ncmb.DataStore(dbName);
  events.lessThanOrEqualTo("startDate",today)
  .greaterThanOrEqualTo("endDate",today)
  .fetchAll() 
 .then(function(results){
    var items ='';
  for (var  i= 0; i< results.length; i++) {
      
    (function() {
      var j=i;
     var result=results[j];
           //使用期間表示方法
     if(result.endDate=='2999/12/31' ){
      var deadline='';
     }else{
      deadline=result.startDate+'～'+result.endDate;
     }

//クーポン
    if(dbName=="Coupon_List"){
       c_objectId1[j]=result.get("objectId");
      var value=0; 
                    value = result.get("limit");
   window.NCMB.monaca.getInstallationId(
        function(id){
          userid=id;
        })
  var myCoupon = ncmb.DataStore("Coupon_Record");
  var mycoupon=new myCoupon();
          //データがあるか判別
         myCoupon.equalTo("deviceId",userid)
                        .equalTo("couponId",c_objectId1[j])
                        .count()
                        .fetchAll()
                        .then(function(results1){
                          if(results1.count==0){
                           mycoupon.set("deviceId",userid)
                                         .set("couponId",c_objectId1[j])
                                         .set("limit",value)
                                         .save()        
                          }
                         c_limit[j]=results1[0].get("limit");
                              })
                var  reader = new FileReader();  //ファイルの読み込み 
         var img = ncmb.DataStore("Item_info");
           img.equalTo("objectId",result.get("link"))
    .fetchAll() 
        .then(function(results){
          var pic=results[0].img;
        
            loadNews(pic,reader) ;
             reader.onload=function(e){
                  if(c_limit[j]<=-1){
                  c_limit[j]='無制限';
                }
                  if(c_limit[j]!=0){
       items += '<ons-list-item tappable modifier="chevron" onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+','+"'"+result.get("objectId")+"'"+','+""+')"><div class="left"><img class="list-item__thumbnail" src ="'+reader.result+'" /></div><div class="center"><span class="list-item__title">'+result.name+'</span><span class="list-item__title">残り'+deadline+''+c_limit[j]+'</span></div></ons-list-item>';   
                  }else{
        items += '<ons-list-item style="pointer-events: none;background-color:#BDBDBD;" tappable　modifier="chevron" ><div class="left"><img class="list-item__thumbnail" src ="'+reader.result+'" /></div><div class="center"><span class="list-item__title">'+result.name+'</span><span class="list-item__title">残り'+deadline+''+c_limit[j]+'</span></div><div class="right">使用済み</div></ons-list-item>';
                  }
                   document.getElementById(listId).innerHTML = items;    
                    }
        })

   //ニュース
    }else if(dbName=="News_List"){          
      var  reader = new FileReader();  //ファイルの読み込み 
      var pic=result.thumbnail;
       loadNews(pic,reader);
      reader.onload= function(e){ //読み込み終了
        items +='<ons-carousel-item  onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+','+"'"+result.get("objectId")+"'"+','+""+')"  class="cal"><img src ="'+reader.result+'" alt="イメージが取得できませんでした" class="calImage" /><div class="center"><span class="list-item__title"><H7>'+result.name+'</H7></span><span class="list-item__title"></span></div></ons-carousel-item>';                 
       document.getElementById(listId).innerHTML = items; 
      }

  //以外
     }else{
         var  reader = new FileReader();  //ファイルの読み込み 
         var img = ncmb.DataStore("Item_info");
           img.equalTo("objectId",result.get("link"))
    .fetchAll() 
        .then(function(results){
          var pic=results[0].img;
        
            loadNews(pic,reader) ;
   
            reader.onload=function(e){
       items += '<ons-list-item tappable modifier="chevron" onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+','+"'"+result.get("objectId")+"'"+','+"'"+result.get("class")+"'"+')"><div class="left"><img class="list-item__thumbnail" src ="'+reader.result+'" /></div><div class="center"><span class="list-item__title">'+result.name+'</span><span class="list-item__title">'+deadline+'</span></div></ons-list-item>';
       document.getElementById(listId).innerHTML = items;
            }
        })
     }
   })();      
  } 
 })
}

//リストアイテム
function onClickItem(itemLink,dbName,objectId,eclass){  
  var item = ncmb.DataStore("Item_info");
    item.equalTo("objectId",itemLink)
    .fetchAll() 
        .then(function(results){
           if(dbName=="Coupon_List"){
             c_objectId2=objectId;
             onClickCoupon(results[0].get("title"), results[0].get("detail"), results[0].get("img"));  
             showCoupon=results[0].get("detail");
           }else if(dbName=="Event_List"){
             e_class=eclass;
             e_geo=results[0].get("geo");
               onClickEvent(results[0].get("title"), results[0].get("detail"), results[0].get("img"));
             }else{
          onClickInfo(results[0].get("title"), results[0].get("detail"), results[0].get("img"));
           }
        })
}

//マップのマーカー用
function onClickMarker(itemLink,dbName){
   var item = ncmb.DataStore("Item_info");
    item.equalTo("objectId",itemLink)
    .fetchAll() 
        .then(function(results){
  onClickInfo(results[0].get("title"), results[0].get("detail"), results[0].get("img"));
        })
}

//詳細情報
function onClickInfo(title,detail,img){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img;
    console.log( options.data.img);
    NatNavi.pushPage('info.html', options);
};


//クーポン詳細情報
function onClickCoupon(title,detail,img){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img;
    console.log( options.data.img);
    NatNavi.pushPage('coupon_info.html', options);
};

//イベント詳細情報
function onClickEvent(title,detail,img){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img;
    console.log( options.data.img);
    NatNavi.pushPage('event_info.html', options);
};

//ページ移動ボタン
function onClickTopBtn(page){
    var options = {};
    options.animation = 'slide';
    NatNavi.pushPage(page,options);
}

//画像読み込み
function loadNews(pic,reader){                     
    ncmb.File.download(encodeURIComponent(pic), "blob")  //ファイルのダウンロード
        .then(function(blob) {
            reader.readAsDataURL(blob);  //ファイルの読み込み
        })
        .catch(function(err) {
            console.error(err);
        })
}
  
//外部ページに移動するか判別
function CheckMove(url,title) {
    if( confirm(title+"を開きます") ) {
        window.open(url, '_system', 'location=yes');
    }
}

//クーポン使用okボタン押下
function registerCoupon(){
  // hideDialog('my-dialog');
  alert("画面を見せてください\n\n"+showCoupon);
              
         var myCoupon = ncmb.DataStore("Coupon_Record");
          var mycoupon=new myCoupon();
          //データがあるか判別
          console.log(c_objectId2);
         myCoupon.equalTo("deviceId",userid)
                        .equalTo("couponId",c_objectId2)
                        .fetchAll()
                        .then(function(results){
                         if(results[0].get("limit")==-2){  //無制限のと
                          results[0].delete();
                          mycoupon.set("deviceId",userid)
                                         .set("couponId",c_objectId2)
                                         .set("limit",-2)
                                         .save()
                        }else {  //まだつかえるとき
                          var count=results[0].get("limit");
                          results[0].delete();
                          mycoupon.set("deviceId",userid)
                                         .set("couponId",c_objectId2)
                                         .set("limit",count-1)
                                         .save()
                        }
            
                        })
                NatNavi.popPage();
                fn.load('coupon.html');
}

//日付取得
function getDay(){
var newday = new Date();
  var year = newday.getFullYear();
  var month = newday.getMonth()+1;
　var day = newday.getDate();
　var today=year+'/'+month+'/'+day;

return today;
}

//クーポン使用ダイアログ
function couponDialog(){
	if(window.confirm('このクーポンを使いますか？')){
		registerCoupon();
	} else{
	window.alert('キャンセルされました'); 
	}
}

function showMap(){
  	if(window.confirm('地図を開きますか？')){
     // var event=ncmb.dataStore("Event_List");
        checkDataStore=e_class;
        NatNavi.popPage();
          fn.load('map.html');
  var countup = function(){
       find_geopoint(checkDataStore);
        eventmap(e_geo.longitude,e_geo.latitude);
  } 
  setTimeout(countup, 1000);
    }	else{
	window.alert('キャンセルされました'); 
    }

}




