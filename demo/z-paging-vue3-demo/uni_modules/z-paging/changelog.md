## 2.6.3（2023-11-30）
1.`新增` `completeByError`方法，支持通过方法传入请求失败原因，`z-paging-error-emit`亦支持相关参数。  
2.`修复` 短时间内疯狂下拉&收回列表可能出现的列表无法滚动的问题。  
3.`修复` `concat`为false时，无数据显示问题（by wty）。    
4.`修复` 使用页面滚动时`scrollIntoViewById`和`scrollIntoViewByNodeTop`滚动的位置不正确的问题。  
5.`修复` `refreshToPage`在`reload`之前调用时page参数无效的问题。  
6.`修复` 滑动切换选项卡+吸顶演示2在安卓中下拉时整个页面被下拉的问题。  
7.`修复` 在安卓+APP中使用`swiper-demo`可能出现的`Error: Not Found：Page`报错。  
8.`优化` `refreshToPage`+`本地分页`时不进行网络请求，依然进行本地分页。  
9.`优化` `completeByNoMore`完全由nomore控制，当传入空数组时，不强制设置为没有更多数据。    

