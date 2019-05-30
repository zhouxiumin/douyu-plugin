'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId);
});

console.log('\'斗鱼 \'斗鱼! Event Page for Page Action');


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let message = request.message;
    console.log('addListener');
    console.log(message);
    chrome.storage.sync.get('tuling123', function(result) {
      if (chrome.runtime.lastError) {
        console.log('chrome.runtime.lastError.message');
        console.log(chrome.runtime.lastError.message);
      } else {
        let tuling123 = result.tuling123;
        if (tuling123.apikey && tuling123.userId) {

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
            url: 'https://openapi.tuling123.com/openapi/api/v2',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (resp) {
              let ret = '';
              if(resp && resp.results) {
                for(let result of resp.results) {
                  if(result && result.values && result.values.text) {
                    let res = result.values.text;
                    ret += res;
                  }
                }
              }
              console.log('ret:');
              console.log(ret);
              sendResponse(ret);
            }
          });
        }
      }
    });
  }
);
