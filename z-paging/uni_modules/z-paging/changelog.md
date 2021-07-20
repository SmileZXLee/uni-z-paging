## 1.9.3（2021-07-12）
1.延后首次加载自动请求的时机，使其在onLoad之后触发。  
2.修复使用`safe-area-inset-bottom`时，距离顶部有段空白的BUG。  
3.优化横向切换与下拉刷新手势的兼容，横向切换时禁止下拉刷新的细节调整。  
## 1.9.2（2021-07-09）
## 【注意】由V1.9.0起，fixed属性默认值为true，z-paging默认会铺满屏幕。老项目更新请注意，使用侧滑滚动切换选项卡或需要局部使用z-paging请设置:fixed="false"。如果您希望fixed属性默认为false，请参考文档：z-paging.com，将fixed默认值设置为false。 
1.新增`completeByNoMore(data,nomore)`方法，支持在请求结束时自行控制是否有更多数据。  
2.修复在微信小程序中，:fixed="false"时列表未展示的BUG。  
3.进一步兼容和整合vue和nvue的写法。  
4.其他细节调整与优化。
## 1.9.1（2021-07-07）
# 【注意】由V1.9.0起，fixed属性默认值为true，z-paging默认会铺满屏幕。老项目更新请注意，使用侧滑滚动切换选项卡或需要局部使用z-paging请设置:fixed="false"。如果您希望fixed属性默认为false，请参考文档：z-paging.com，将fixed默认值设置为false。
1.修复在一些情况下空数据图无法展示或展示位置不正确的问题。  
2.其他细节优化。
## 1.9.0（2021-07-04）
## 【注意1】由V1.9.0起，fixed属性默认值为true，z-paging默认会铺满屏幕。老项目更新请注意，使用侧滑滚动切换选项卡或需要局部使用z-paging请设置:fixed="false"。如果您希望fixed属性默认为false，请参考下方的【全局配置】，将fixed默认值设置为false。  
1.修复使用slot="top"时可能出现的置顶view点击无效的问题。  
2.修复设置`show-loading-more-when-reload`后，下拉刷新时底部加载更多view也处于loading状态的问题。  
3.其他细节调整。

## 1.8.9（2021-07-01）
1.默认状态由`translateY(0px)`修改为`none`，修复因使用transform引发的子view fixed被降级为absoult的BUG。  
2.修复在nvue安卓中，通过`loading-more-custom-style`修改加载更多view的高度时，加载更多view被裁剪的BUG。  
3.去掉reload自动滚动到顶部的动画。  
4.当`loading-more-enabled`设置为false，且`show-loading-more-when-reload`为true时，`show-loading-more-when-reload`优先。  
5.修复在nvue 安卓中使用聊天记录模式，只有一页时底部有一段空白的BUG。  
6.`concat`为false时，不再自动清空list。  
## 1.8.8（2021-06-30）
1.修复设置了`show-loading-more-when-reload`后，下拉刷新时展示加载更多loading且无数据时展示加载更多view的BUG。  
2.修复在nvue中，在安卓设备上下拉刷新view底部有一根白色横线的BUG。  
3.修复在nvue中，设置了`show-refresher-when-reload`后，部分平台reload时页面卡住闪退的BUG。  
4.在nvue中支持`slot="top"`和`slot="bottom"`，使其写法与vue相同。  
5.修改部分内部通用变量名，以避免在一些项目中引入mixins与其冲突的问题。  
6.修复在nvue中，滚动到顶部会停顿一下，继续上拉才可以加载更多的BUG。  
7.新增`concat`属性，支持控制是否自动拼接complete传过来的数组。
## 1.8.7（2021-06-22）
1.新增滑动切换选项卡简化写法及演示。  
2.修复reload自动滚动到顶部无效的BUG。
