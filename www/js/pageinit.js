var idx=0;  //情報の数
var ddata = {};
var link={};
var reader;
var couponinfo;

document.addEventListener('init', function(event) {
  var page = event.target;
  console.log("page init");

  switch(page.id) {
  case 'info-page':
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

      if(listId=="newsItems"){          
      var  reader = new FileReader();  //ファイルの読み込み 
      var pic=result.thumbnail;
       loadNews(pic,reader);
      reader.onload= function(e){ //読み込み終了
        items +='<ons-carousel-item  onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+')"  class="cal"><img src ="'+reader.result+'" alt="イメージが取得できませんでした" class="calImage" /><div class="center"><span class="list-item__title"><H7>'+result.name+'</H7></span><span class="list-item__title"></span></div></ons-carousel-item>';                 
       document.getElementById(listId).innerHTML = items; 
      }
     }else{
         var  reader = new FileReader();  //ファイルの読み込み 
         var img = ncmb.DataStore("Item_info");
           img.equalTo("objectId",result.get("link"))
    .fetchAll() 
        .then(function(results){
          var pic=results[0].img;
        
            loadNews(pic,reader) ;
            reader.onload=function(e){
       items += '<ons-list-item tappable modifier="chevron" onclick="onClickItem('+"'"+result.get("link")+"'"+','+"'"+dbName+"'"+')"><div class="left"><img class="list-item__thumbnail" src ="'+reader.result+'" /></div><div class="center"><span class="list-item__title">'+result.name+'</span><span class="list-item__title">'+deadline+'</span></div></ons-list-item>';
       document.getElementById(listId).innerHTML = items;
            }
        })
     }
   })();      
  } 
 })
}

//リストアイテム
function onClickItem(itemLink,dbName){
  var item = ncmb.DataStore("Item_info");
    item.equalTo("objectId",itemLink)
    .fetchAll() 
        .then(function(results){
           console.log(results[0].get("title"));
           if(dbName=="Coupon_List"){
             onClickCoupon(results[0].get("title"), results[0].get("detail"), results[0].get("img"));  
           }else{
          onClickInfo(results[0].get("title"), results[0].get("detail"), results[0].get("img"));
           }
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

//クーポン使用状況をアップロード
function usedCoupon(){
    var userid;
    window.NCMB.monaca.getInstallationId(
        function(userid){}
        );
    var classname=userid+'_Info';
    var coupons = ncmb.DataStore(classname);
            var coupon = new Coupons();
            coupon.set("couponInfo",couponinfo+'使用');
}

//クーポン使用ダイアログ
var showTemplateDialog = function() {
  var dialog = document.getElementById('my-dialog');

  if (dialog) {
    dialog.show();
  } else {
    ons.createElement('coupon_check.html', { append: true })
      .then(function(dialog) {
        dialog.show();
      });
  }
};
  
var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};
  
//外部ページに移動するか判別
function CheckMove(url) {
    if( confirm(url+"を開きます") ) {
        window.open(url, '_system', 'location=yes');
    }
}

//クーポン使用okボタン押下
function okCoupon(){
   hideDialog('my-dialog');
  alert("画面を見せてください");
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