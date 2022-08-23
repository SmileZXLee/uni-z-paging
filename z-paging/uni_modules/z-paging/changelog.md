## 2.3.7（2022-08-23）
1.添加props：`refresher-pull-rate`，支持设置自定义下拉刷新下拉时实际下拉位移与用户下拉距离的比值，控制下拉刷新的"跟手度"。  
2.添加props：`auto-show-system-loading`和`system-loading-text`，支持在reload、refresh时显示系统loading。  
3.去除nvue上list中的`@touchstart`以避免由此引发的列表无法滚动和cell中的video播放控制异常的问题。  
4.修复可能出现的聊天记录模式加载更多时滚动位置不正确的问题。  
5.修复在快手小程序+安卓中列表空白的的问题。  
6.修复调用`endRefresh`之后再调用`endRefresh`出现的列表数据被清空的问题。
