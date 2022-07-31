# z-tabs

[![version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/SmileZXLee/uni-z-tabs)
[![license](https://img.shields.io/github/license/SmileZXLee/uni-z-tabs)](https://en.wikipedia.org/wiki/MIT_License)

***

### 反馈qq群(点击加群)：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)

***

## z-tabs文档

### 基本使用

```html
<template>
	<z-tabs :list="list"></z-tabs>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			const list = [];
			for(let i = 0;i < 10;i++) {
        // list内item支持字符串或对象，下方这个是字符串
				list.push('tab标题');
        
        // 如果要展示徽标数，则list中item的数据结构应为：
        /*
        {
          name: 'tab标题',
          badge: {
            // 设置徽标数为6
            count: 6
          }
        }
        */
			}
      this.list = list;
	}
</script>
```



### props

| 参数                | 说明                                                         | 类型           | 默认值  | 可选值 |
| :------------------ | :----------------------------------------------------------- | :------------- | :------ | :----- |
| list                | 数据源数组，支持形如`['tab1','tab2']`的格式或`[{name:'tab1',value:1}]`的格式 | Array          | []      | -      |
| current             | 当前选中的index                                              | Number\|String | 0       | -      |
| scroll-count        | list数组长度超过scrollCount时滚动显示(不自动铺满全屏)        | Number\|String | 5       | -      |
| tab-width           | 自定义每个tab的宽度，默认为0，即代表根据内容自动撑开，单位为rpx | Number\|String | 0       | 0      |
| bar-width           | 滑块宽度，单位rpx                                            | Number\|String | 45      | -      |
| bar-height          | 滑块高度，单位rpx                                            | Number\|String | 8       | -      |
| bar-style           | 滑块样式，其中的`width`和`height`将被`bar-width`和`bar-height`覆盖 | Object         | {}      | -      |
| name-key            | list中item的name(标题)的key                                  | String         | name    | -      |
| value-key           | list中item的value的key                                       | String         | value   | -      |
| active-color        | 激活状态tab的颜色                                            | String         | #007AFF | -      |
| inactive-color      | 未激活状态tab的颜色                                          | String         | #888888 | -      |
| active-style        | 激活状态tab的样式                                            | Object         | {}      | -      |
| inactive-style      | 未激活状态tab的样式                                          | Object         | {}      | -      |
| badge-max-count     | 徽标数最大数字限制，超过这个数字将变成`badge-max-count`+     | Number\|String | 99      | -      |
| badge-style         | 徽标样式，例如可自定义背景色，字体等等                       | Object         | {}      | -      |
| bg-color            | z-tabs背景色                                                 | String         | white   | -      |
| tabs-style          | z-tabs样式                                                   | Object         | {}      | -      |
| init-trigger-change | 初始化时是否自动触发change事件                               | Boolean        | true    | false  |


### events

| 事件名  | 说明                 | 回调参数                                                     |
| ------- | -------------------- | ------------------------------------------------------------ |
| @change | tabs改变(点击)时触发 | `参数1`:index(当前切换到的index)；<br/>`参数2`:value(当前切换到的value) |

### slots

| 名称  | 说明         |
| :---- | ------------ |
| left  | tabs左侧插槽 |
| right | tabs右侧插槽 |

### 支持全局配置

* 在`/z-tabs/components/z-tabs/config/index.js`文件中进行配置

```js
export default {
	'active-color': 'red'
}
```