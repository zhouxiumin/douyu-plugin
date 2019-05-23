'use strict';

console.log('\'斗鱼 \'斗鱼! Content script');

layui.use('layer', function(){
  let layer = layui.layer;

  console.log('layer! Content script');
  layer.open({
    title: '在线调试'
    ,content: '可以填写任意的layer代码'
  });

});