## 2.1.0（2022-01-05）
1.新增methods `endRefresh`，支持直接终止下拉刷新状态而不进行额外操作。  
2.新增props `reload-when-refresh`，支持设置用户下拉刷新时是否触发reload方法。  
3.修复events `@refresherTouchmove`无法实时监听下拉刷新进度的问题。  
4.修复设置了`show-refresher-when-reload`后，首次进入页面没有展示下拉刷新view的问题。  
5.修复在安卓nvue中，下拉刷新view于list之间有1px分割线的问题。  
6.修复在微信小程序中，部分设备设置了`safe-area-inset-bottom`后，底部安全区域计算不正确的问题。  
7.`empty-view-fixed`默认值修改为false，空数据图将自动避免top和bottom区域。  
8.修复可能出现的最后更新时间未更新的问题。  
9.修复在一些安卓设备中，快速滑动列表偶现的卡住的问题。  
10.对部分代码进行简化。
