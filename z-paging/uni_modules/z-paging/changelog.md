## 2.0.9（2021-11-04）
1.新增`loadingFullFixed`，支持设置loading铺满屏幕。  
2.新增`minDelay`，支持设置触发@query后最小延迟处理的时间。  
3.新增`autoHideEmptyViewWhenPull`，支持控制用户下拉刷新时是否自动隐藏空数据图。  
4.修复在main.js中进行z-paging的全局配置无效的问题。  
5.修复在微信小程序中使用自动显示下拉刷新view时，请求时间很短时刷新状态无法结束的问题。  
6.修复在nvue中使用滑动切换选项卡可能出现的无法下拉刷新的问题。  
7.修复自动显示下拉刷新view时，上次刷新时间不会更新的问题。  
8.在z-paging中使用popup等组件时，未能盖住全屏的问题及z-paging内view position:fixed失效的问题可以通过更新最新版HbuilderX解决。
## 2.0.8（2021-10-14）
1.修复`ReferenceError: getPrivateLanguage is not defined`报错的问题  
2.修复在nvue中使用聊天记录模式时，手动调用`scrollToTop`或`scrollToBottom`时递归调用的问题。  
3.修复使用`u-grid`时，内部item元素过多时。`z-paging`自定义的下拉刷新view与默认下拉刷新view同时展示的问题。
## 2.0.7（2021-10-08）
1.修复在一些平台中，底部加载更多会被遮挡的问题。  
2.修复在nvue中`safe-area-inset-bottom`为true时，可能出现的顶部异常偏移的问题。  
3.修复在HbuilderX 3.2.8+中，下拉刷新时@onRefresh被触发多次的问题。  
4.修复在iOS中滚动到顶部view，在某些情况下因bounce的影响闪一下又消失的问题。  
5.修复在使用页面滚动时，滚动到顶部view未能正常显示的问题。  
6.修复在nvue中，使用聊天记录模式，数据未满一页时，数组被颠倒的问题。  
7.修复在nvue中，使用页面滚动时，`scrollToTop`无效的问题。  
8.修复在nvue中，使用聊天记录模式时，`scrollToBottom`和`scrollToTop`效果颠倒的问题。  
9.修复在安卓 nvue中，导航栏与z-paging间出现的白色分割线的问题。  
10.修复在HbuilderX 3.2.9+中，vue下拉刷新加载中时有一段空白间隙的问题。
