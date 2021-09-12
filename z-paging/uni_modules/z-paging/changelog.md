## 2.0.6（2021-09-12）
1.新增属性`height`、`width`、`bg-color`，可更方便地设置z-paging的高度、宽度和背景色。  
2.新增下拉刷新状态：刷新成功。  
3.新增属性`refresher-complete-delay`，支持自定义下拉刷新结束以后延迟回弹的时间。  
4.新增属性`refresher-complete-duration`，支持自定义下拉刷新结束回弹动画时间。  
5.新增属性`empty-view-center`。调整属性`empty-view-fixed`规则，其设置为false时，空数据图父view会填充满z-paging的剩余部分。  
6.新增`scroll-x`，支持自定义内置的scroll-view是否可以横向滚动。  
7.`show-scrollbar`支持vue与nvue。  
8.修复设置`show-refresher-when-reload`之后，首次的自动展示下拉刷新view不完整的BUG。  
