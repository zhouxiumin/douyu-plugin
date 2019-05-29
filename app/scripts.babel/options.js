'use strict';

layui.use(['form','layer'], function(){
  let form = layui.form;
  let layer = layui.layer;

  chrome.storage.sync.get('tuling123', function(result) {
    if (chrome.runtime.lastError) {
      console.log('chrome.runtime.lastError.message');
      console.log(chrome.runtime.lastError.message);
    } else {
      let tuling123 = result.tuling123;
      if (tuling123.apikey && tuling123.userId) {
          $('#apikey').val(tuling123.apikey);
          $('#userId').val(tuling123.userId);
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
