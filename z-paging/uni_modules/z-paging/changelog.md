## 2.5.0（2023-01-28）
1.`新增` demo全面兼容vue3写法，同时添加在弹窗中使用`z-paging`(局部使用)的示例。  
2.`新增` 请求失败状态改变事件。  
3.`修复` `completByNoMore`无效的问题。  
4.`修复` `refresherCompleteDuration`大于700时`refresherCompleteDelay`无效的问题。  
5.`修复` 列表运行横向滚动时，滚动到右侧也触发了加载更多的问题。  
6.`优化` i18n部分uniapp编译版本过老导致`uni.getLocale()`报错时当作中文处理。  
7.`优化` `$slots`判断，使其同时兼容vue2和vue3，同时统一slot插入写法。  

