'use strict';

$(document).ready(function(){
  console.log('\'斗鱼 \'斗鱼! Content script');
});
const messageType = {
  notice: 'Barrage-notice--normalBarrage',
  message: 'Barrage-message',
  enter: 'Barrage-userEnter'
};

const messages = [];

const user = '群星stellaris';

function sendIntervalMsg() {
  if(messages.length > 0) {
    let msg = messages.shift();
    sendMessage(msg);
  }else {
    console.log('no msg');
  }
}

setInterval(sendIntervalMsg, 3001);

chrome.runtime.onConnect.addListener(function (port) {//建立监听

  if(port.name === 'ma'){//判断通道名称
    port.onMessage.addListener(function (msg) {//监听消息
      if(msg.jia=== 'getArea'){//如果扩展发送的消息为{jia: "getArea"}

        let stashArray = getAllMessage();
        console.log(stashArray);
        let set = new Set();

        stashArray.forEach((item) => {
          if(!set.has(item.id)){
            set.add(item.id);
            messages.push(item.content);
            // sendMessage(item.content);
          }
        });

      }
    });
  }

});
function sendMessage(mes) {
  let chat = $('div.ChatSend textarea');
  console.log(chat);
  chat.val(mes);

  let btnSend= $('div.ChatSend-button');
  btnSend.trigger('click');
}

function getAllMessage() {
  let mesContent = [];
  $('div.Barrage-main ul li').each(
    function() {
      mesContent.push($(this));
    }
  );
  console.log(mesContent);
  console.log(typeof mesContent);
  let array = [];
  mesContent.forEach((item) =>{
    let type = item.children('div').attr('class');
    if(type.indexOf(messageType.notice) != -1){
      let from= item.find('div span.Barrage-nickName').attr('title');
      let content = item.find('div span.Barrage-content').text();
      if(from != user){
        array.push({
          id: item.attr('id'),
          type: 'notice',
          from: from,
          content: content,
        })
      }
    }else if(type.indexOf(messageType.enter) != -1){
      let from= item.find('div span.Barrage-nickName').attr('title');
      let content = item.find('div span.Barrage-text').text();
      if(from != user) {
        array.push({
          id: item.attr('id'),
          type: 'enter',
          from: from,
          content: '欢迎' + from + '的光临',
        })
      }
    }else if(type.indexOf(messageType.message) != -1){
      let from= item.find('div span.Barrage-nickName').attr('title');
      let content = item.find('div span.Barrage-text').text();
      if(from != user) {
        array.push({
          id: item.attr('id'),
          type: 'message',
          from: from,
          content: '谢谢' + from + '对主播的支持',
        })
      }
    }
  });

  return array;
}
