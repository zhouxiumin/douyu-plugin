'use strict';

layui.use(['form','layer'], function(){
  let form = layui.form;
  let layer = layui.layer;

  chrome.storage.sync.get('tuling123', function(result) {
    if (chrome.runtime.lastError) {
      console.log('chrome.runtime.lastError.message');
      console.log(chrome.runtime.lastError.message);
    } else {
      console.log('result');
      console.log(result);
      let tuling123 = result.tuling123;
      if (tuling123.apikey && tuling123.secret) {
          console.log(tuling123.apikey);
          console.log(tuling123.secret);
          $('#apikey').val(tuling123.apikey);
          $('#secret').val(tuling123.secret);
      }
    }
  });

  //监听提交
  form.on('submit(save)', function(data){
    layer.msg(JSON.stringify(data.field));
    console.log(JSON.stringify(data.field));
    console.log(data);
    let obj = data.field;
    chrome.storage.sync.set({'tuling123':obj}, function() {
      if (chrome.runtime.lastError) {
        console.log('chrome.runtime.lastError.message');
        console.log(chrome.runtime.lastError.message);
      } else {
        console.log('success');
      }
    });
    return false;
  });
});
