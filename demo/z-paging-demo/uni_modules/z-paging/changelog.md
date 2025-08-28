## 2.8.8（2025-08-29）
1.`新增` props：`in-swiper-slot`，用以解决在vue3+(微信小程序或QQ小程序)中，`scrollIntoViewById`和`scrollIntoViewByIndex`因无法获取节点信息导致滚动到指定view无效的问题。  
2.`修复` 在vue2中缓存模式无效的问题。  
3.`修复` 聊天记录模式在键盘弹出后，底部聊天输入框依然可以滚动的问题。  
4.`修复` 部分老版本`webview`中，`#right`位置不正确的问题。  
5.`修复` 在快手小程序+安卓中滚动到底部可能多次触发的问题。  
6.`修复` 在微信小程序+虚拟列表中滚动到顶部偶现无效的问题。  
7.`修复` 方法`reload(true)`调用时`refresher-complete-delay`无效的问题。  
8.`优化` 底部安全区域展示逻辑和性能。   
## 2.8.7（2025-05-30）
1.`新增` props：`layout-only`，支持仅使用基础布局。  
2.`新增` `goF2`方法，支持手动触发进入二楼。  
3.`新增` `@scrollDirectionChange`事件，支持监听列表滚动方向改变。  
4.`新增` props：`paging-class`，支持直接设置`z-paging`的`class`。  
5.`新增` `addKeyboardHeightChangeListener`方法，支持手动添加键盘高度变化监听。  
6.`修复` `scrollIntoViewById`方法在存在`slot=top`或局部区域滚动时，滚动的位置不准确的问题。  
7.`优化` 重构底部安全区域处理逻辑，修改为占位view的方式，处理方案更灵活并支持自定义底部安全区域颜色。  
8.`优化` 兼容在`nvue`+`vue3`中使用`waterfall`。  
9.`优化` 规范`types`中对`style`类型的约束。  
## 2.8.6（2025-03-17）
1.`新增` 聊天记录模式流式输出（类似chatGPT回答）演示demo。  
2.`新增` z-paging及其公共子组件支持`HBuilderX`代码文档提示。  
3.`新增` props：`virtual-in-swiper-slot`，用以解决vue3+(微信小程序或QQ小程序)中，使用非内置列表写法时，若z-paging在`swiper-item`中存在的无法获取slot插入的cell高度进而导致虚拟列表失败的问题。  
4.`新增` `@scrolltolower`和@`scrolltoupper`支持nvue。  
5.`修复` 由`v2.8.1`引出的方法`scrollIntoViewById`在微信小程序+vue3中无效的问题。  
6.`修复` 由`v2.8.1`引出的在子组件内使用z-paging虚拟列表无效的问题。  
7.`修复` 在微信小程序中基础库版本较高时`wx.getSystemInfoSync is deprecated`警告。  
8.`优化` 提升下拉刷新在鸿蒙Next中的性能。  
9.`优化` `@scrolltolower`和`@scrolltoupper`在倒置的聊天记录模式下的触发逻辑。  
10.`优化` 其他细节调整。  
## 2.8.5（2025-02-09）
1.`新增` 方法`scrollToX`，支持控制x轴滚动到指定位置。  
2.`修复` 快手小程序中报错`await isn't allowed in non-async function`的问题。  
3.`修复` 在iOS+nvue中，设置了`:loading-more-enabled="false"`后，调用`scrollToBottom`无法滚动到底部的问题。  
4.`修复` 在支付宝小程序+页面滚动中，数据为空时空数据图未居中的问题。  
5.`优化` fetch types修改。  
## 2.8.4（2024-12-02）
1.`修复` 在虚拟列表+vue2中，顶部占位采用transformY方案；在虚拟列表+vue3中，顶部占位采用view占位方案。以解决在vue2+微信小程序+安卓+兼容模式中，可能出现的虚拟列表闪动的问题。  
2.`修复` 在列表渲染时（尤其是在虚拟列表中）偶现的【点击加载更多】闪现的问题。   
3.`优化` 统一在RefresherStatus枚举中Loading取值。    
4.`优化` `defaultPageNo`&`defaultPageSize`修改为只允许number类型。  
5.`优化` 提升兼容性&细节优化。  
## 2.8.3（2024-11-27）
1.`修复` `doInsertVirtualListItem`插入数据无效的问题。  
2.`优化` 提升兼容性&细节优化。  
## 2.8.2（2024-11-25）
1.`优化` types中`ZPagingRef`和`ZPagingInstance`支持泛型。  
## 2.8.1（2024-11-24）
1.`新增` 完整的`props`、`slots`、`methods`、`events`的typescript types声明，可在ts中获得绝佳的代码提示体验。  
2.`新增` `virtual-cell-id-prefix`：虚拟列表cell id的前缀，适用于一个页面有多个虚拟列表的情况，用以区分不同虚拟列表cell的id。  
3.`修复` 在vue3+(微信小程序或QQ小程序)中，使用非内置列表写法时，若`z-paging`在`swiper-item`标签内的情况下存在的无法获取slot插入的cell高度的问题。  
4.`修复` 在虚拟列表中分页数据小于1页时插入新数据，虚拟列表未生效的问题。  
5.`修复` 在虚拟列表中调用`refresh`时，cell的index计算不正确的问题。  
6.`修复` 在快手小程序中内容较少或空数据时`z-paging`未能铺满全屏的问题。  
7.`优化` `events`中的参数涉及枚举的部分，统一由之前的number类型修改为string类型，展示更直观！涉及的events：`@query`中的`from`参数；`@refresherStatusChange`中的`status`参数；`@loadingStatusChange`中的`status`参数；`slot=refresher`中的`refresherStatus`参数；`slot=chatLoading`中的`loadingMoreStatus`参数。更新版本请特别留意！  
## 2.8.0（2024-10-21）
1.`新增` 全面支持鸿蒙Next。  
2.`修复` 设置了`refresher-complete-delay`后，在下拉刷新期间调用reload导致的无法再次下拉刷新的问题。  
3.`优化` 废弃虚拟列表transformY顶部占位方案，修改为空view占位。解决因使用旧方案导致的vue3中可能出现的虚拟列表闪动问题。提升虚拟列表的兼容性。  

