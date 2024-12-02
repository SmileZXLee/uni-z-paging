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

