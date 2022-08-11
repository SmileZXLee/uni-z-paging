## 2.3.5（2022-08-11）
1.修复滚动到底部加载更多后，返回顶部进行下拉刷新且未下拉到阈值时松手出现的下拉刷新view空白并且未回弹的问题。  
2.新增`updateLeftAndRightWidth`方法，当slot="left"或slot="right"宽度动态改变时调用，以解决动态其宽度动态变化时，布局未更新的问题。  
3.新增props：`offset-accuracy`，对应nvue的list组件中的`offset-accuracy`。
