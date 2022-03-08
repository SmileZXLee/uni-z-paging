## 2.1.9（2022-03-08）
1.支持了全局complete，可全局设置complete，无需在每个页面写`this.$refs.paging.complete(xxx)`。  
2.修复了使用`completeByKey`的同时设置`:show-refresher-when-reload="true"`后，快速切换tab下拉刷新view有概率不收回的问题。  
3.修复`sticky-swiper-next-demo`在安卓中，首次加载滚动到底部view被遮挡的问题。  
4.修复使用`v-slot`的情况下，若列表为空，`v-slot`不生效的问题。  
## 2.1.8（2022-03-05）
细节优化
## 2.1.7（2022-03-05）
1.项目模块化优化，精简`z-paging-main.js`代码。  
2.优化下拉刷新的跟手性和展示细节。  
3.新增props `loading-more-title-custom-style`用于自定义底部加载更多文字样式。  
4.修复在字节跳动小程序中快速切换tab可能导致的reload无限递归触发的问题。  
5.修复在聊天记录模式下，设置了`slot="top"`但其高度未被计算进滚动回当前位置的偏移量中的问题。  
6.修复通过`slot="loading"`插入加载中view时，loading展示时机不正确的问题。  
7.修复单独使用`z-paging-empty-view`组件报错的问题。  
8.其他细节优化。
