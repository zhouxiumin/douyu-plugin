'use strict';

layui.use(['form', 'layer'], function () {
  let form = layui.form;
  let layer = layui.layer;

  chrome.tabs.query(
    {active: true, currentWindow: true},
    function (tabs) {
      let port = chrome.tabs.connect(//建立通道
        tabs[0].id,
        {name: 'ma'}//通道名称
      );
      $('#send').click(function () {//给web页面的按钮绑定点击事件，通过点击事件来控制发送消息
        port.postMessage({jia: 'getArea'});//向通道中发送消息
      });
    });

  let chatHtml = '';

  form.on('submit(chat)', function (data) {
    let message = data.field.message;
    chatHtml += '<div class="layui-col-xs12">' + message + '</div>';
    $('#chat-content').html(chatHtml);

    chrome.storage.sync.get('tuling123', function (result) {
      if (chrome.runtime.lastError) {
        console.log('chrome.runtime.lastError.message');
        console.log(chrome.runtime.lastError.message);
      } else {
        let tuling123 = result.tuling123;
        if (tuling123.apikey && tuling123.userId) {
          console.log(tuling123.apikey);
          console.log(tuling123.userId);

          let data = {
            'reqType': 0,
            'perception': {
              'inputText': {
                'text': message
              },
            },
            'userInfo': {
              'apiKey': tuling123.apikey,
              'userId': tuling123.userId
            }
          };
          $.ajax({
            type: 'POST',
            url: 'http://openapi.tuling123.com/openapi/api/v2',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (resp) {
              console.log('success ajax');
              console.log(resp);
              if(resp && resp.results) {
                for(let result of resp.results) {
                  if(result && result.values && result.values.text) {
                    let res = result.values.text;
                    chatHtml += '<div class="layui-col-xs12">' + res + '</div>';
                    $('#chat-content').html(chatHtml);
                  }
                }

              }
            }
          });
        }
      }
    });
    return false;
  });


});