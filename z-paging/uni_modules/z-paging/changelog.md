## 2.0.5（2021-08-29）
1.修复使用页面滚动时，若延时渲染数据，页面无法滚动的问题。  
2.新增滑动切换选项卡+吸顶的nvue演示demo，并进行相关兼容处理。  
3.新增全局配置方案，支持在文件 `z-paging/config/index.js`中进行配置。  
4.新增`refresh`方法，刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。  
5.精简`z-paging-refresj`和`z-paging-load-more`代码。  
## 2.0.4（2021-08-28）
1.修复使用页面滚动时，若延时渲染数据，页面无法滚动的问题。  
2.新增滑动切换选项卡+吸顶的nvue演示demo，并进行相关兼容处理。  
3.新增全局配置方案，支持在文件 `z-paging/config/index.js`中进行配置。  
4.新增`refresh`方法，刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。
## 2.0.3（2021-08-24）
1.优化全屏Loading显示逻辑，默认在点击请求失败重新加载按钮时也会展示loading。  
2.新增`empty-view-fixed`属性，用于控制空数据图是否使用fixed布局并铺满z-paging。  
3.在nvue中fixed生效，由此版本起，在nvue中使用z-paging无需设置根节点铺满屏幕。  
4.修复在nvue中使用页面滚动时，空数据图未居中的问题。在nvue中自定义全屏Loading和空数据图，可以使用`flex:1`来铺满屏幕。
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
