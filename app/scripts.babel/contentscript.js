'use strict';

$(document).ready(function(){
  console.log('\'斗鱼 \'斗鱼! Content script');
});

chrome.runtime.onConnect.addListener(function (port) {//建立监听

  if(port.name === 'ma'){//判断通道名称
    port.onMessage.addListener(function (msg) {//监听消息
      if(msg.jia=== 'getArea'){//如果扩展发送的消息为{jia: "getArea"}
        let chat = $('div.ChatSend textarea');
        console.log(chat);
        chat.val('666');

        let btnSend= $('div.ChatSend-button');
        btnSend.trigger('click');
      }
    });
  }

});
