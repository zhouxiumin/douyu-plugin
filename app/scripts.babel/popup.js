'use strict';

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

console.log('\'斗鱼 \'斗鱼! Popup');
