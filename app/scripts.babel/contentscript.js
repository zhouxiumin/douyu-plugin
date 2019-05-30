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

const welcomeMessage = [];

const set = new Set();

const user = '小A';

const owner = '小B';

const welcome = ['凉风有信，秋月无边，亏我思娇的情绪好比度日如年，我是世界上最帅的小溯溪，欢迎大家。',
'神神气气神神气气小溯溪，辩驳最流利，神神气气神神气气小溯溪，辩驳最流利',
  '在山的那边，海的那边有一只小溯溪，他活泼又聪明，他调皮又机灵，他自由自在等你光临，有一天好心情，全心全意逗你开心',
'嘿兄弟，我们好久不见你在哪里？嘿朋友，如果真的是你请打招呼。',
  '你存在我深深地脑海里，我的梦里我的心里，我常看的直播间里',
  '难忘今宵~难忘今宵~我为你歌唱，你为我点赞如何？',
'海内存知己天涯若比邻，我们遇到了，就多逗留，喝些桃花酒如何？',
'注意身体好好照顾自己，小溯溪为您祈福中祝你一天开心。',
'我曾遇到一人，与我饮酒对诗，看杨花飘落，着素衣翩跹。而后我找遍山河角落，寻得一缕相思，你可是我曾经的少年？',
'我们的相遇如果是意外，那么也是小溯溪深夜仰望的那瞬最亮的流星，我想许愿你可以留下。'];

const enter = ['祝你一天拥有好心情',
  '大佬来了，大佬来了，快快端茶倒水',
  '今天你过得如何，来和我们一起high',
  '天大地大，感谢让我遇到你',
  '握手问好',
  '和我一起念，大头大头下雨不愁，人家有伞我有大头',
  '人海茫茫遇见你',
  '回来吧，回来了，回到一个温暖的地方',
  '你听说过愿得一人心，白首不分离么',
  '小溯溪很高兴遇见你'];

let tuling123 = null;

function sendIntervalMsg() {
  if(messages.length > 0) {
    let msg = messages.shift();
    sendMessage(msg);
  }else {
    console.log('no msg');
  }
}

function sendWelcome(){
  let msg = welcome[Math.floor(Math.random() * 10)];
  sendMessage(msg);
}


setInterval(sendIntervalMsg, 3001);
setInterval(sendWelcome,70000);

chrome.storage.sync.get('tuling123', function(result) {
  if (chrome.runtime.lastError) {
    console.log('chrome.runtime.lastError.message');
    console.log(chrome.runtime.lastError.message);
  } else {
    tuling123 = result.tuling123;
    if (tuling123.apikey && tuling123.userId) {
      $('#apikey').val(tuling123.apikey);
      $('#userId').val(tuling123.userId);
    }
  }
});

chrome.runtime.onConnect.addListener(function (port) {//建立监听

  if(port.name === 'ma'){//判断通道名称
    port.onMessage.addListener(function (msg) {//监听消息
      if(msg.jia=== 'getArea'){//如果扩展发送的消息为{jia: "getArea"}

        setInterval(function () {
          let stashArray = getAllMessage();
          stashArray.forEach((item) => {
            if(!set.has(item.id)){
              set.add(item.id);
              messages.push(item.content);
              // sendMessage(item.content);
            }
          });
        }, 3001);

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
      if(from != user && content.indexOf('小二，') != -1){
        let data = {
          'reqType': 0,
          'perception': {
            'inputText': {
              'text': '你好'
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
                  array.push({
                    id: item.attr('id'),
                    type: 'notice',
                    from: from,
                    content: res,
                  })
                }
              }

            }
          }
        });
      }
    }else if(type.indexOf(messageType.enter) != -1){
      let from= item.find('div span.Barrage-nickName').attr('title');
      let content = item.find('div span.Barrage-text').text();
      if(from != user && from != owner) {
        array.push({
          id: item.attr('id'),
          type: 'enter',
          from: from,
          content: '欢迎' + from + '的光临，'+ enter[Math.floor(Math.random() * 10)],
        })
      }
      if(from == owner){
        array.push({
          id: item.attr('id'),
          type: 'enter',
          from: from,
          content: '欢迎' + from + '的光临，'+ '哦，我的主人您来了，快坐下给您捶捶腿',
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
