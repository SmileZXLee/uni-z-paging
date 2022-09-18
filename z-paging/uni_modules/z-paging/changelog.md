## 2.4.0（2022-09-19）
1.新增虚拟列表`兼容模式`，以解决虚拟列表使用的循环+slot-scope在微信小程序出现的诸多兼容问题。  
2.新增虚拟列表methods：`didUpdateVirtualListCell`和`didDeleteVirtualListCell`，用于在虚拟列表动态高度时，手动更新cell缓存高度。  
3.新增虚拟列表events：`@innerCellClick`，用于监听使用虚拟列表或内置列表时点击了cell事件。  
4.添加使用页面滚动且在子组件内使用z-paging示例。  
5.修复非页面滚动时，`auto-height`无效的问题。  
6.修复在nvue+vue3+安卓中，下拉刷新中indicator旋转动画未生效的bug。  
7.修复在虚拟列表中未设置`cell-height-mode`时，虚拟列表无效的问题。  
