## 2.2.1（2022-04-12）
1.修复在微信小程序中，在一些情况下可能出现的下拉刷新view盖住`slot=top`view的问题。  
2.修复在微信小程序中，使用reload自动显示下拉刷新view时，当首次请求至complete触发的间隔过短时，下拉刷新view无法收回的问题。  
3.在nvue中，去除底部加载更多view延时展示。  
4.修复调用`scrollToTop`时，默认的animate不为true的问题。  
5.修复在vue3中`this.$refs['zp-scroll-view'].$refs.main.style`报错的问题。  
6.修复在App中，长时间进入后台后重新打开后有概率出现的无法下拉刷新的问题。  
