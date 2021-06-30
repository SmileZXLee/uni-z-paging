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
