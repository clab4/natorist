function news(){
var News = ncmb.DataStore("news");
News.fetch()
    .then(function(results){
         for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.get("head"));
         }
    })
    .catch(function(err){
            console.log(err);
    });
}

ons.ready(function() {  
  setInterval(function() {
    // 今のインデックスを取得
    var index = carousel.getActiveCarouselItemIndex();
    // 最後だったら最初に戻る
    if (index >= 4) {
      carousel.first();
    }
    // 次のアイテムにスライド
    else {
      carousel.next();
    }
  }, 2000);
});