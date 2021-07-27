# z-paging


***  

## 【注意】由V1.9.0起，fixed属性默认值为true，z-paging默认会铺满屏幕。老项目更新请注意，使用侧滑滚动切换选项卡或需要局部使用z-paging请设置:fixed="false"。如果您希望fixed属性默认为false，请参考文档：z-paging.com，将fixed默认值设置为false。
*** 

> 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view，支持吸顶效果，支持国际化等。

### API文档地址：[http://z-paging.com](http://z-paging.com)
### 备用API文档地址：[https://www.kancloud.cn/zxlee/z-paging/content](https://www.kancloud.cn/zxlee/z-paging/content) 

### 功能&特点

* 【配置简单】仅需两步（绑定网络请求方法、绑定分页结果数组）轻松完成完整下拉刷新，上拉加载更多功能。
* 【低耦合，低侵入】分页自动管理。在page中无需处理任何分页相关逻辑，无需在data中定义任何分页相关变量，全由z-paging内部处理。
* 【超灵活，支持各种类型自定义】支持自定义下拉刷新，自定义上拉加载更多，自带自定义下拉刷新效果，及其他数十种自定义属性。
* 【功能丰富】支持国际化，支持自定义且自动管理空数据图，支持主题模式切换，支持本地分页，支持聊天分页模式，支持展示最后更新时间，支持吸顶效果，支持内部scroll-view滚动与页面滚动，支持一键滚动到顶部等诸多功能。
* 【多平台兼容，细致，流畅】支持nvue，支持h5、app及各家小程序；在app-vue、h5、微信小程序、QQ小程序上使用wxs实现下拉刷新，大幅提升性能。多处细节优化，给您精致流畅的体验。

### 反馈qq群(点击加群)：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)
 

#### 关于自动引入组件

> `z-paging` 支持[easycom组件规范](https://uniapp.dcloud.io/component/README?id=easycom组件规范)，无需引用和注册组件即可直接使用，在正在运行的项目中导入`z-paging`可能会提示：`Unknown custom element：<z-paging> - did you register the component corrently?... `，此时需要重新运行项目即可。

### 预览

***

|                 自定义下拉刷新效果+分页演示                  |                      吸顶效果+分页演示                       |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](http://www.zxlee.cn/github/uni-z-paging/uni-z-paging.gif) | ![](http://www.zxlee.cn/github/uni-z-paging/uni-z-paging2.gif) |

|                   滑动切换选项卡+分页演示                    |                    聊天记录模式+分页演示                     |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo3.gif) | ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo4.gif) |

### 在线demo体验地址：

* [http://www.zxlee.cn/github/uni-z-paging/demo/index.html](http://www.zxlee.cn/github/uni-z-paging/demo/index.html)

| 扫码体验                                                     |
| ------------------------------------------------------------ |
| ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo.png) |

### 此组件已支持`uni_modules`，下载完整示例时组件在`uni_modules`目录下。

## 基本使用

* ①在`<template>` 中使用@query绑定js中分页请求的方法(`z-paging`会将计算好的pageNo和pageSize两个参数传递到此方法中)，然后通过` v-model`绑定列表for循环的list。
* ②在请求结果回调中，通过调用`z-paging`的`complete()`方法，将请求返回的数组传递给`z-paging`处理，如：`this.$refs.paging.complete(服务器返回的数组);`；若请求失败，调用：`this.$refs.paging.complete(false);`即可。
* 当tab切换或搜索时，可以通过`this.$refs.paging.reload()`刷新整个列表。
* 在nvue中，z-paging中插入的列表item(z-paging的直接子view)必须是cell，必须使用cell包住，因为在nvue中，z-paging使用的是nvue的list组件，具体请查阅demo中的`common-demo-n.vue`示例。

```html
<template>
    <view class="content">
        <z-paging ref="paging" v-model="dataList" @query="queryList">
            <!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
            <view>
                <view class="item" v-for="(item,index) in dataList">
                    <view class="item-title">{{item.title}}</view>
                </view>
            </view>
        </z-paging>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                dataList: [],
            };
        },
        methods: {
            queryList(pageNo, pageSize) {
              	//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
              	//这里的请求只是演示，请替换成自己的项目的网络请求，请在网络请求回调中
              	//通过this.$refs.paging.complete(请求回来的数组);将请求结果传给z-paging
                this.$request.queryList(pageNo, pageSize, (data) => {
                    this.$refs.paging.complete(data);
                });
            },
        },
    };
</script>

<style scoped>
    
</style>
```

## 设置自定义emptyView组件示例

* 设置自定义emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理

```html
<z-paging ref="paging" v-model="dataList" @query="queryList">
    <!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
    <empty-view slot="empty"></empty-view>
    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
</z-paging>
```

## 自定义加载更多各个状态的描述文字示例

* 以修改【没有更多了】状态描述文字为例(将默认的"没有更多了"修改为"我也是有底线的！")

```html
<z-paging ref="paging" v-model="dataList" loading-more-no-more-text="我也是有底线的！" @query="queryList">
    <!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
</z-paging>
```

## 自定义下拉刷新view示例

* `use-custom-refresher`需要设置为true(默认为true)，此时将不会使用uni自带的下拉刷新，转为使用z-paging自定义的下拉刷新，通过slot可以插入开发者自定义的下拉刷新view。

```html
<z-paging ref="paging" v-model="dataList" :refresher-threshold="80" @query="queryList">
  <!-- 自定义下拉刷新view -->
  <!-- 注意注意注意！！QQ小程序或字节跳动小程序中自定义下拉刷新不支持slot-scope，将导致custom-refresher无法显示 -->
	<!-- 如果是QQ小程序或字节跳动小程序，请参照demo中的sticky-demo.vue中的写法，此处使用slot-scope是为了减少data中无关变量声明，降低依赖 -->
	<custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus"></custom-refresher>
  <!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
  <view>
    <view class="item" v-for="(item,index) in dataList" @click="itemClick(item)">
      <view class="item-title">{{item.title}}</view>
      <view class="item-detail">{{item.detail}}</view>
      <view class="item-line"></view>
    </view>
  </view>
</z-paging>
```

## 自定义加载更多各个状态的描述view示例

* 以修改【没有更多了】状态描述view为例

```html
<z-paging ref="paging" v-model="dataList" @query="queryList">
    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
    <view style="background-color: red" slot="loadingMoreNoMore">这是完全自定义的没有更多数据view</view>
</z-paging>
```

## 使用页面滚动示例

```html
<!-- 使用页面滚动示例(无需设置z-paging的高度) -->
<template>
	<view class="content">
		<!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
		<!-- 注意注意！！这里的ref必须设置且必须等于"paging"，否则mixin方法无效 -->
		<z-paging ref="paging" v-model="dataList" use-page-scroll @query="queryList">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view>
				<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-detail">{{item.detail}}</view>
					<view class="item-line"></view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	//使用页面滚动时引入此mixin，用于监听和处理onPullDownRefresh等页面生命周期方法(如果全局引入了，就不要这一步，全局引入示例见main.js)
	import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		//注意这一步不要漏掉，必须注册mixins(如果全局引入了，就不要这一步，全局引入示例见main.js)
		mixins: [ZPagingMixin],
		data() {
			//参见demo
		},
		methods: {
			//参见demo
		}
	}
</script>
```

## i18n示例

* 请参照demo：`i18n-demo.vue`

## 性能与建议

|            |                   使用内置scroll-view滚动                    |                         使用页面滚动                         |                           使用nvue                           |
| :--------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  **说明**  | 默认模式，`z-paging`需要有确定的高度，下拉刷新与上拉加载更多由`z-paging`内部处理，配置简单。 | `use-page-scroll`设置为true时生效，使用页面滚动而非内置scroll-view滚动，无需固定`z-paging`的高度，但需要在页面滚动到底部时调用`z-paging`的`doLoadMore()`方法。<br>当使用页面的下拉刷新时，需要引入mixin(可全局引入)，具体可参见demo。 | 创建nvue页面并引入`z-paging`且运行在APP上生效，`z-paging`将使用nvue独有的`<list>`和`<refresh>`代替原有的scroll-view和自定义的下拉刷新，可大幅提升性能。 |
|  **性能**  |                             不佳                             |                             一般                             |                              优                              |
| **优缺点** | 【优点】配置简单、耦合度低。普通的简单列表不会有明显卡顿。<br/>【缺点】需要固定`z-paging`高度，超出页面部分渲染的资源无法自动回收，当列表item比较复杂或数据量过多时，可能会造成明显卡顿。 | 【优点】性能优于使用内置的scroll-view滚动，超出页面部分渲染的资源会自动回收，能适应绝大多数列表滚动的情况，即使列表item比较复杂，一般也不会感知到卡顿。<br>【缺点】配置略麻烦，耦合度较高。 | 【优点】原生渲染，极致性能，`<list>`组件在不可见部分的渲染资源回收有特殊的优化处理，`<refresh>`组件是app端独有的下拉刷新组件，性能远超普通vue页面中的自定义下拉刷新。<br>【缺点】仅App端支持，nvue页面写法不如vue页面方便，在`z-paging`中一些配置和方法在nvue中不支持，且nvue页面中支持的第三方组件也比vue页面少。 |

#### 【总结】

* 如果项目列表item比较简单，分页数据量不是特别多，建议使用默认的「内置scroll-view滚动」。
* 如果项目列表item比较复杂，数据量多，且使用「内置scroll-view滚动」时卡顿明显，建议使用页面滚动。
* 如果是App项目，且对性能和细节有较高要求，建议在nvue中使用`z-paging`。

## 注意事项及常见问题

* 【若无法下拉刷新】请确认要在@query所绑定的方法中调用`this.$refs.paging.complete()`，无论是否需要网络请求都要调用，只有告知z-paging刷新状态结束了，才可以开始下次的下拉刷新。

* 【使用内置scroll-view滚动时】z-paging必须有确定的高度！否则上拉加载更多将无法触发，建议设置`:fixed=true`即可不设置高度！！(不希望跟着滚动的view可以设置`slot="top"`)。

* 【使用页面滚动时】使用z-paging内置的scroll-view滚动性能不及使用页面的滚动。若您要使用页面的滚动，请勿固定z-paging的高度，并且必须设置`use-page-scroll`为true，否则将导致页面无法滚动(不希望跟着滚动的view可以设置`slot="top"`)。

* 【使用页面滚动时】必须引入mixin(可全局引入)(具体可参照demo中的`page-default-demo.vue`文件)或在页面的`onReachBottom`事件中调用`this.$refs.paging.doLoadMore()`且在`onPageScroll(e)`事件中调用`this.$refs.paging.updatePageScrollTop(e.scrollTop)`。(具体可参照demo中的`page-default-demo.vue`文件)

* 【出现实际上有更多数据，而显示没有更多数据时】默认的pageSize(每页显示数量)为10，如果您服务端不需要传pageSize(例如有默认的pageSize：8)，则您需要将默认的pageSize改成您与后端约定好的（8），若没有修改，则z-paging会认为传给服务端的pageSize是10，而服务端只返回了8条，因此会直接判定为没有更多数据。

* 【若页面无法滚动】请检查z-paging是否有固定的高度；若您想使用页面滚动而非z-paging内置的scroll-view的滚动，请设置`use-page-scroll`为true。

* 【关于自定义导航栏】若设置了`:fixed=true`，则必须将自定义导航栏放在z-paging标签中且添加slot="top"，如：`<custom-nav slot="top"></custom-nav>`，如果有多个需要固定顶部的元素，则书写`<view slot="top">需要固定顶部的元素</view>`。

### API文档地址：[http://z-paging.com](http://z-paging.com)
### 备用API文档地址：[https://www.kancloud.cn/zxlee/z-paging/content](https://www.kancloud.cn/zxlee/z-paging/content) 