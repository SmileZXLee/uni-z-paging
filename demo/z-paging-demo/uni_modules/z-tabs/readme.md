# z-tabs

[![version](https://img.shields.io/badge/version-0.2.5-blue)](https://github.com/SmileZXLee/uni-z-tabs)
[![license](https://img.shields.io/github/license/SmileZXLee/uni-z-tabs)](https://en.wikipedia.org/wiki/MIT_License)

***

### 反馈qq群(点击加群)：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)

***

## z-tabs文档

### 安装

#### 方式1(推荐)：通过uni_modules安装，在插件市场中点击右上角【使用HbuilderX导入插件】即可。 

***

#### 方式2：通过npm安装  

```bash
//若项目之前未使用npm管理依赖（项目根目录下无package.json文件），先在项目根目录执行命令初始化npm工程
npm init -y

//安装
npm install @zxlee/z-tabs --save
//更新
npm update @zxlee/z-tabs
```

然后在`pages.json`中配置`easycom`(注意：下方配置只有在使用npm安装时才需要配置！！！！！)  

```json
"easycom": {
    "^z-tabs": "@zxlee/z-tabs/components/z-tabs/z-tabs.vue"
}
```

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
				list.push({
					name: 'tab标题',
					badge: {
						// 设置徽标数为6
						count: 6
					},
					// 可以禁用某个item
					disabled: true
				});
            }
			this.list = list;
		}
    }
</script>
```



### props

| 参数                | 说明                                                         | 类型           | 默认值  | 可选值 |
| :------------------ | :----------------------------------------------------------- | :------------- | :------ | :----- |
| list                | 数据源数组，支持形如`['tab1','tab2']`的格式或`[{name:'tab1',value:1}]`的格式 | Array          | []      | -      |
| current             | 当前选中的index                                              | Number\|String | 0       | -      |
| scroll-count        | list数组长度超过scrollCount时滚动显示(不自动铺满全屏)        | Number\|String | 5       | -      |
| tab-width           | 自定义每个tab的宽度，默认为0，即代表根据内容自动撑开，单位rpx，支持传100、"100px"或"100rpx" | Number\|String | 0       | 0      |
| bar-width           | 滑块宽度，单位rpx，支持传100、"100px"或"100rpx"              | Number\|String | 45rpx   | -      |
| bar-height          | 滑块高度，单位rpx，支持传100、"100px"或"100rpx"              | Number\|String | 8rpx    | -      |
| bar-style           | 滑块样式，其中的`width`和`height`将被`bar-width`和`bar-height`覆盖 | Object         | {}      | -      |
| bottom-space        | tabs与底部的间距，单位rpx，支持传100、"100px"或"100rpx"      | Number\|String | 8rpx    | -      |
| bar-animate-mode    | 【v0.1.5起支持】切换tab时滑块动画模式，与`swiper`联动时有效，点击切换tab时无效，必须调用`setDx`。默认为`line`，即切换tab时滑块宽度保持不变，线性运动。可选值为`worm`，即为类似毛毛虫蠕动效果 | String         | line    | worm   |
| name-key            | list中item的name(标题)的key                                  | String         | name    | -      |
| value-key           | list中item的value的key                                       | String         | value   | -      |
| active-color        | 激活状态tab的颜色                                            | String         | #007AFF | -      |
| inactive-color      | 未激活状态tab的颜色                                          | String         | #666666 | -      |
| disabled-color      | 禁用状态tab的颜色                                            | String         | #bbbbbb | -      |
| active-style        | 激活状态tab的样式                                            | Object         | {}      | -      |
| inactive-style      | 未激活状态tab的样式                                          | Object         | {}      | -      |
| disabled-style      | 禁用状态tab的样式                                            | Object         | {}      | -      |
| badge-max-count     | 徽标数最大数字限制，超过这个数字将变成`badge-max-count`+     | Number\|String | 99      | -      |
| badge-style         | 徽标样式，例如可自定义背景色，字体等等                       | Object         | {}      | -      |
| bg-color            | z-tabs背景色                                                 | String         | white   | -      |
| tabs-style          | z-tabs样式                                                   | Object         | {}      | -      |
| init-trigger-change | 初始化时是否自动触发change事件                               | Boolean        | true    | false  |


### events

| 事件名       | 说明                 | 回调参数                                                     |
| ------------ | -------------------- | ------------------------------------------------------------ |
| @change      | tabs改变(点击)时触发 | `参数1`:index(当前切换到的index)；<br/>`参数2`:value(当前切换到的value) |
| @secondClick | tabs二次点击时触发   | `参数1`:index(当前切换到的index)；<br/>`参数2`:value(当前切换到的value) |

### methods

| 方法名              | 说明                                                         | 参数                                   |
| ------------------- | ------------------------------------------------------------ | -------------------------------------- |
| setDx               | 根据swiper的`@transition`实时更新底部dot位置                 | swiper的`@transition`中的`e.detail.dx` |
| unlockDx            | 在swiper的`@animationfinish`中通知`z-tabs`结束多`setDx`的锁定，若在父组件中调用了`setDx`，则必须调用`unlockDx` | -                                      |
| updateSubviewLayout | 在nvue+安卓中，若在cell中使用`z-tabs`，且页面加载时cell在屏幕之外，因cell的复用机制，可能导致`z-tabs`内部的布局失效：例如底部bar无法显示，此时可在list滚动到一定区域内(例如快显示`z-tabs`)的时候调用此方法以更新其内部布局。其他情况无需调用！ | -                                      |

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

### 【v0.1.4起支持】底部dot与swiper联动演示

```html
<template>
  <z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" />
  <swiper :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
    <swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
      xxx
    </swiper-item>
  </swiper>
<template>
<script>
	export default {
		data() {
			return {
				tabList: ['测试1','测试2','测试3','测试4'],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			};
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				this.$refs.tabs.unlockDx();
			}
		}
	}
</script>
```