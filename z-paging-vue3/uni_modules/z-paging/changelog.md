## 2.5.8（2023-05-03）
1.`新增` props：`refresher-no-transform`，支持控制下拉刷新时是否禁止下拉刷新view跟随用户触摸竖直移动。  
2.`新增` props：`refresher-refreshing-animated`，支持控制下拉刷新刷新中状态下是否展示旋转动画。  
3.`新增` vue3中页面滚动hooks。  
4.`新增` 全局拦截器-`@query`拦截器中回调函数添加当前列表最后一个item数据。  
5.`修复` 在vue3+内置浏览器中，报错`SyntaxError: Unexpected token . at xxx`的问题。  
6.`修复` 滑动切换选项卡简化写法queryList触发多次的问题。  
7.`优化`  底部加载更多展示逻辑，在各个平台中过渡更加自然。  
8.`优化` `@touchDirectionChange`触发逻辑，仅在值改变时触发，优化性能。  
## 2.5.7（2023-03-14）
1.`修复` 在nvue+安卓中，设置`empty-view-center`为false后空数据图被切割未能完整显示的问题。  
2.`修复` 由`2.5.4`引出的在nvue中，使用`slot="top"`后下拉刷新失效的问题。  
