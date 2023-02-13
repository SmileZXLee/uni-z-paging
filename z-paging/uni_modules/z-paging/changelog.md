## 2.5.3（2023-02-13）
1.`新增` `reload`、`refresh`、`complete`、`completeByTotal`、`completeByNoMore`、`completeByKey`、`setLocalPaging`等方法的返回值添加请求结果promise，可以通过方法名().then()获取本次操作请求结束后的【总列表】和【是否有更多数据】。  
2.`修复` 由`v2.5.0`引出的在vue2 + 钉钉小程序中，`slot="top"`插入无效的问题。  
