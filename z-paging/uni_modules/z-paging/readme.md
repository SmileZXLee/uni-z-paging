# z-paging

> 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view，支持吸顶效果等。

### 反馈qq群(点击加群)：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)

### 在线demo体验地址：

* [http://www.zxlee.cn/github/uni-z-paging/demo/index.html](http://www.zxlee.cn/github/uni-z-paging/demo/index.html)

| 扫码体验                                                     |
| ------------------------------------------------------------ |
| ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo.png) |

### 此组件已支持`uni_modules`，下载完整示例时组件在`uni_modules`目录下。

## 基本使用

* ①在`<template>` 中使用@query绑定js中分页请求的方法(`z-paging`会将计算好的pageNo和pageSize两个参数传递到此方法中)，然后通过` :list.sync`绑定列表for循环的list。
* ②在请求结果回调中，通过调用`z-paging`的`addData()`方法，将请求返回的数组传递给`z-paging`处理，如：`this.$refs.paging.addData(服务器返回的数组);`；若请求失败，调用：`this.$refs.paging.addData(false);`即可。
* 仅h5、App、微信小程序支持uni scroll-view自带的下拉刷新，若运行在其他平台上，请设置`use-custom-refresher`为true以使用`z-paging`自带的下拉刷新。

## 注意事项

* z-paging必须有确定的高度！否则上拉加载更多将无法触发，请确保z-paging的父节点有确定的高度！！
* 请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突。
* z-paging默认会禁止所有touchmove事件冒泡以避免下拉刷新冲突，这将导致使用滑动切换tab时无法横向切换，若您需要横向切换功能，请设置`touchmove-propagation-enabled`为true以允许冒泡；若此时下拉刷新是页面也跟着下拉，需要在pages.json中设置页面的"disableScroll":true或在page的根节点中添加`@touchmove.stop.prevent`，详情可查看demo。
* 默认的pageSize(每页显示数量)为15，如果您服务端不需要传pageSize(例如有默认的pageSize：10)，则您需要将默认的pageSize改成您与后端约定好的（10），若没有修改，则z-paging会认为传给服务端的pageSize是15，而服务端只返回了10条，因此会直接判定为没有更多数据。

```html
<template>
    <view class="content">
        <z-paging ref="paging" @query="queryList" :list.sync="dataList">
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
                this.$request.queryList(pageNo, pageSize, (data) => {
                    this.$refs.paging.addData(data);
                });
            },
        },
    };
</script>

<style scoped>
    /* 注意，父元素需要固定高度，z-paging的height:100%才会生效 */
    page {
        height: 100%;
    }
    .content {
        height: 100%;
    }
</style>
```

| 效果演示                                                     |
| ------------------------------------------------------------ |
| ![](http://www.zxlee.cn/github/uni-z-paging/uni-z-paging.gif) |

## 设置自定义emptyView组件

* 设置自定义emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理

```html
<z-paging ref="paging" @query="queryList" :list.sync="dataList">
    <!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
    <empty-view slot="empty"></empty-view>

    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
</z-paging>
```

## 自定义加载更多各个状态的描述文字

* 以修改【没有更多了】状态描述文字为例(将默认的"没有更多了"修改为"我也是有底线的！")

```html
<z-paging ref="paging" loading-more-no-more-text="我也是有底线的！" @query="queryList" :list.sync="dataList">
    <!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
    <empty-view slot="empty"></empty-view>

    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
</z-paging>
```

## 自定义下拉刷新view

* `use-custom-refresher`需要设置为true，此时将不会使用uni自带的下拉刷新，转为使用z-paging自定义的下拉刷新，通过slot可以插入开发者自定义的下拉刷新view。

```html
<z-paging ref="paging" :refresher-threshold="80" :use-custom-refresher="true" @query="queryList" :list.sync="dataList" :refresher-status.sync="refresherStatus">
  <!-- 自定义下拉刷新view，若不设置，则使用z-paging自带的下拉刷新view -->
  <custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher>
  <!-- 设置自定义emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
  <empty-view slot="empty"></empty-view>
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

## 自定义加载更多各个状态的描述view

* 以修改【没有更多了】状态描述view为例

```html
<z-paging ref="paging" @query="queryList" :list.sync="dataList">
    <view>
        <view class="item" v-for="(item,index) in dataList">
            <view class="item-title">{{item.title}}</view>
        </view>
    </view>
    <view style="background-color: red" slot="loadingMoreNoMore">这是完全自定义的没有更多数据view</view>
</z-paging
```



# API

## Props 

|                        参数                         |                             说明                             |       类型       |         默认值         |   可选值    |
| :-------------------------------------------------: | :----------------------------------------------------------: | :--------------: | :--------------------: | :---------: |
|                   default-page-no                   |                         自定义pageNo                         | String \| Number |           1            |      -      |
|                  default-page-size                  |                        自定义pageSize                        | String \| Number |           15           |      -      |
|                 default-theme-style                 | loading(下拉刷新、上拉加载更多)的主题样式，支持black，white  |      String      |         black          |    white    |
|                   use-page-scroll                   | 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐 |     Boolean      |         false          |    true     |
|              mounted-auto-call-reload               | `z-paging` `mounted`后自动调用`reload`方法(`mounted`后自动调用接口) |     Boolean      |          true          |    false    |
|           auto-scroll-to-top-when-reload            |                    reload时自动滚动到顶部                    |     Boolean      |          true          |    false    |
|             auto-clean-list-when-reload             | reload时立即自动清空原list，若立即自动清空，则在reload之后、请求回调之前页面是空白的 |     Boolean      |          true          |    false    |
|                use-custom-refresher                 | 是否使用自定义的下拉刷新，默认为否，使用uni自带的下拉刷新。设置为是后则使用z-paging的下拉刷新 |     Boolean      |         false          |    true     |
|                    refresher-fps                    | 自定义下拉刷新下拉帧率，默认为30，过高可能会出现抖动问题(use-custom-refresher为true时生效) |      Number      |           30           |      -      |
|               refresher-default-text                | 自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效) |      String      |      继续下拉刷新      |      -      |
|               refresher-pulling-text                | 自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效) |      String      |      松开立即刷新      |      -      |
|              refresher-refreshing-text              | 自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效) |      String      |      正在刷新...       |      -      |
|            refresher-end-bounce-enabled             | 是否开启自定义下拉刷新刷新结束回弹效果(use-custom-refresher为true时生效) |     Boolean      |          true          |    false    |
|                loading-more-enabled                 | 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据) |     Boolean      |          true          |    false    |
|           to-bottom-loading-more-enabled            |                是否启用滑动到底部加载更多数据                |     Boolean      |          true          |    false    |
|                  loading-more-text                  |  自定义底部加载更多文字(当需要不同加载状态固定文字时才使用)  |      String      |           -            |      -      |
|              loading-more-custom-style              |         自定义底部加载更多样式；如：{'color':'red'}          |      Object      |           -            |      -      |
|       loading-more-loading-icon-custom-style        |               自定义底部加载更多加载中动画样式               |      Object      |           -            |      -      |
|           loading-more-loading-icon-type            | 自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower |      String      |         flower         |   circle    |
|       loading-more-loading-icon-custom-image        | 自定义底部加载更多加载中动画图标图片，若设置则使用自定义的动画图标，`loading-more-loading-icon-type`将无效 |      String      |           -            |      -      |
|              loading-more-default-text              |                     滑动到底部"默认"文字                     |      String      |      点击加载更多      |      -      |
|              loading-more-loading-text              |                    滑动到底部"加载中"文字                    |      String      |      正在加载...       |      -      |
|              loading-more-no-more-text              |                   滑动到底部"没有更多"文字                   |      String      |       没有更多了       |      -      |
|               loading-more-fail-text                |                   滑动到底部"加载失败"文字                   |      String      | 加载失败，点击重新加载 |      -      |
| hide-loading-more-when-no-more-and-inside-of-paging | 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view |     Boolean      |          true          |    false    |
|           show-loading-more-no-more-view            |                  是否显示没有更多数据的view                  |     Boolean      |          true          |    false    |
|           show-default-loading-more-text            |                  是否显示默认的加载更多text                  |     Boolean      |          true          |    false    |
|           show-loading-more-no-more-line            |            是否显示没有更多数据的分割线，默认为是            |     Boolean      |          true          |    false    |
|       loading-more-no-more-line-custom-style        |              自定义底部没有更多数据的分割线样式              |      Object      |           -            |      -      |
|                   hide-empty-view                   |                     是否强制隐藏空数据图                     |     Boolean      |         false          |    true     |
|                   show-scrollbar                    |                      控制是否出现滚动条                      |     Boolean      |         false          |    true     |
|                scroll-with-animation                |                在设置滚动条位置时使用动画过渡                |     Boolean      |         false          |    true     |
|                  scroll-into-view                   | 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |      String      |           -            |      -      |
|                   lower-threshold                   |     距底部/右边多远时（单位px），触发 scrolltolower 事件     |      Number      |           50           |      -      |
|                 enable-back-to-top                  | iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向 |     Boolean      |         false          |    true     |
|                  refresher-enabled                  |                    是否开启自定义下拉刷新                    |     Boolean      |          true          |    false    |
|                 refresher-threshold                 |               设置自定义下拉刷新阈值（单位px）               |      Number      |           45           |      -      |
|               refresher-default-style               | 设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式 |      String      |         black          | white、none |
|                refresher-background                 |                设置自定义下拉刷新区域背景颜色                |      String      |    #FFFFFF00(透明)     |      -      |
|            touchmove-propagation-enabled            | 是否允许touchmove事件冒泡，默认为否，禁止冒泡可避免一些情况下下拉刷新时页面其他元素跟着下移，若您使用横向滑动切换选项卡，则需要将此属性设置为true，否则无法横向滑动 |     Boolean      |         false          |    true     |

## Slot

| 名称               | 说明                                                         |
| :----------------- | ------------------------------------------------------------ |
| empty              | 自定义空数据占位view                                         |
| loading            | 自定义页面reload时的加载view                                 |
| refresher          | 自定义下拉刷新view，设置后则不使用uni自带的下拉刷新view和z-paging自定义的下拉刷新view。此view的style必须设置为`height:100%` (use-custom-refresher为true时生效) |
| loadingMoreDefault | 自定义滑动到底部"默认"状态的view                             |
| loadingMoreLoading | 自定义滑动到底部"加载中"状态的view                           |
| loadingMoreNoMore  | 自定义滑动到底部"没有更多数据"状态的view                     |
| loadingMoreFail    | 自定义滑动到底部"加载失败"状态的view                         |

## Events

* 监听组件方法(自定义扩展，一般无需使用)

| 事件名                | 说明                                                         | 回调参数                                                    |
| --------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| loadingStatusChange   | 分页加载状态改变                                             | value:0-默认状态 1.加载中 2.没有更多数据 3.加载失败         |
| refresherStatusChange | 自定义下拉刷新状态改变(use-custom-refresher为true时生效)【注：通过`:refresher-status.sync`绑定当前data中的指定变量亦可】 | value:0-默认状态 1.松手立即刷新 2.刷新中                    |
| refresherTouchstart   | 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前触摸开始的屏幕点的y值(单位px)                     |
| refresherTouchmove    | 自定义下拉刷新下拉中开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前需要下拉的距离(单位px)                            |
| refresherTouchend     | 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前触摸结束分页内容下移的y值(单位px)                 |
| onRefresh             | 自定义下拉刷新被触发                                         | -                                                           |
| onRestore             | 自定义下拉刷新被复位                                         | -                                                           |
| scroll                | `z-paging`内置的scroll-view滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} | -                                                           |
| scrolltolower         | `z-paging`内置的scroll-view滚动底部时触发                    | value:来源(`toBottom`滚动到底部；`click`点击了加载更多view) |

* 主动调用组件方法 (假设给z-paging设置ref="paging"，则通过this.$refs.paging.xxx()方式调用)

  注意：在Page的onLoad()方法中无法同步获取this.$refs，请加一个setTimeOut延时1毫秒或nextTick再调用(默认会在页面加载时自动调用reload()无须手动调用)

| 方法名              | 说明                                                         | 参数                                                     |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| reload              | 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果   | value：reload时是否展示下拉刷新动画，默认为否            |
| addData             | 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理 | value1:请求结果数组；value2:是否请求成功，不填默认为true |
| doLoadMore          | 手动触发上拉加载更多(非必须，可依据具体需求使用，例如当z-paging未确定高度时，内部的scroll-view会无限增高，此时z-paging无法得知是否滚动到底部，您可以在页面的`onReachBottom`中手动调用此方法触发上拉加载更多) | -                                                        |
| scrollToTop         | 滚动到顶部                                                   | -                                                        |
| updatePageScrollTop | 当使用页面滚动(z-paging不固定高度)并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新 |                                                          |