## 2.0.2（2021-08-19）
1.修复在nvue中设置use-page-scroll后，滚动到底部加载更多view不显示的BUG。  
2.新增`refresher-img-style`、`refresher-title-style`和`refresher-update-time-style`，支持自定义自定义下拉刷新左侧图标、下拉刷新右侧状态描述文字和下拉刷新右侧最后更新时间的样式。  
3.新增end、endByTotalCount、endByNoMore和endByKey，与complete、completeByTotalCount、completeByNoMore和completeByKey完全等效，用于简化相关写法。
## 2.0.1（2021-08-16）
1.自定义下拉刷新view无需设置`refresher-threshold`，将根据view自动计算高度。  
2.修复在iOS 13中下拉刷新抖动的问题。  
3.新增`inside-more`，支持在分页未满一屏时自动加载下一页。  
4.修复z-paging prop代码自动补全无效的问题，完善代码自动补全文档注释。  
5.修复在微信小程序中提示：uni is not defined的bug。  
6.修复在某些情况下，下拉刷新页面会跟着下拉的bug。  
7.其他细节优化。
## 2.0.0（2021-08-16）
1.自定义下拉刷新view无需设置`refresher-threshold`，将根据view自动计算高度。  
2.修复在iOS 13中下拉刷新抖动的问题。  
3.新增`inside-more`，支持在分页未满一屏时自动加载下一页。  
4.修复z-paging prop代码自动补全无效的问题，完善代码自动补全文档注释。  
5.其他细节优化。
