## 2.5.1（2023-02-01）
1.`修复`在微信小程序的组件内使用`z-paging`时，`scrollIntoViewById`无效的问题。  
2.`优化``@refresherTouchmove`在用户手松开和刷新结束时也触发并传出对应边界值。  
3.`优化`更新demo首页导航栏样式。  
4.`废弃`方法`end`、`endByTotalCount`、`endByTotal`、`completeByTotalCount`、`endByNoMore`、`endByKey`。  
5.`调整`方法`completeByNoMore`中参数2(必填):`是否有更多数据`，修改为`是否没有更多数据`，若为true则代表没有更多数据了。与`v2.5.1`之前相反。  
