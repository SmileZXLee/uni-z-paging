# z-paging

> 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view，支持吸顶效果等。

## 在DCloud插件市场中访问：[https://ext.dcloud.net.cn/plugin?name=z-paging](https://ext.dcloud.net.cn/plugin?name=z-paging)

### 反馈qq群(点击加群)：[790460711](https://jq.qq.com/?_wv=1027&k=vU2fKZZH)

### 平台兼容性

| App  |  h5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 字节小程序 | QQ小程序 |
| :--: | :--: | :--------: | :----------: | :--------: | :--------: | :------: |
|  √   |  √   |     √      |      √       |     √      |     √      |    √     |

### 预览

***

|                 自定义下拉刷新效果+分页演示                  |                      吸顶效果+分页演示                       |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](http://www.zxlee.cn/github/uni-z-paging/uni-z-paging.gif) | ![](http://www.zxlee.cn/github/uni-z-paging/uni-z-paging2.gif) |

|                   滑动切换选项卡+分页演示                    |                    聊天记录模式+分页演示                     |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo3.gif) | ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo4.gif) |

***

### 功能&特点

* 【配置简单】仅需两步（绑定网络请求方法、绑定分页结果数组）轻松完成完整下拉刷新，上拉加载更多功能。
* 【低耦合，低侵入】在page中无需处理任何分页相关逻辑，无需在data中定义任何分页相关变量，全由z-paging内部处理。
* 【超灵活，支持各种类型自定义】支持自定义下拉刷新，自定义上拉加载更多，自带自定义下拉刷新效果，及其他数十种自定义属性。
* 【功能丰富】支持自定义且自动管理空数据图，支持主题模式切换，支持本地分页，支持聊天分页模式，支持吸顶效果，支持内部scroll-view滚动与页面滚动，支持一键滚动到顶部等诸多功能。
* 【多平台兼容，细致，流畅】支持nvue，支持h5、app及各家小程序，多处细节优化，给您精致流畅的体验。

### 在线demo体验地址：

* [http://www.zxlee.cn/github/uni-z-paging/demo/index.html](http://www.zxlee.cn/github/uni-z-paging/demo/index.html)

| 扫码体验                                                     |
| ------------------------------------------------------------ |
| ![](http://www.zxlee.cn/github/uni-z-paging/z-paging-demo.png) |

### 此组件已支持`uni_modules`，下载完整示例时组件在`uni_modules`目录下。

## 基本使用

* ①在`<template>` 中使用@query绑定js中分页请求的方法(`z-paging`会将计算好的pageNo和pageSize两个参数传递到此方法中)，然后通过` :list.sync`绑定列表for循环的list。
* ②在请求结果回调中，通过调用`z-paging`的`complete()`方法，将请求返回的数组传递给`z-paging`处理，如：`this.$refs.paging.complete(服务器返回的数组);`；若请求失败，调用：`this.$refs.paging.complete(false);`即可。
* 当tab切换或搜索时，可以通过`this.$refs.paging.reload()`刷新整个列表。

## 性能与建议

|            |                   使用内置scroll-view滚动                    |                         使用页面滚动                         |                           使用nvue                           |
| :--------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  **说明**  | 默认模式，`z-paging`需要有确定的高度，下拉刷新与上拉加载更多由`z-paging`内部处理，配置简单。 | `use-page-scroll`设置为true时生效，使用页面滚动而非内置scroll-view滚动，无需固定`z-paging`的高度，但需要在页面滚动到底部时调用`z-paging`的`doLoadMore()`方法。<br>当使用页面的下拉刷新时，需要在页面下拉刷新触发时调用`z-paging`的`reload()`方法；使用自定义下拉刷新时，下拉刷新会自动触发`reload()`方法，但需要在页面滚动时调用`z-paging`的`updatePageScrollTop()`方法，并将当前的scrollTop当作参数传递进去。 | 创建nvue页面并引入`z-paging`且运行在APP上生效，`z-paging`将使用nvue独有的`<list>`和`<refresh>`代替原有的scroll-view和自定义的下拉刷新，可大幅提升性能。 |
|  **性能**  |                             不佳                             |                             一般                             |                              优                              |
| **优缺点** | 【优点】配置简单、耦合度低。普通的简单列表不会有明显卡顿。<br/>【缺点】需要固定`z-paging`高度，超出页面部分渲染的资源无法自动回收，当列表item比较复杂或数据量过多时，可能会造成明显卡顿。 | 【优点】性能优于使用内置的scroll-view滚动，超出页面部分渲染的资源会自动回收，能适应绝大多数列表滚动的情况，即使列表item比较复杂，一般也不会感知到卡顿。<br>【缺点】配置比较麻烦，耦合度较高。 | 【优点】原生渲染，极致性能，`<list>`组件在不可见部分的渲染资源回收有特殊的优化处理，`<refresh>`组件是app端独有的下拉刷新组件，性能远超普通vue页面中的自定义下拉刷新。<br>【缺点】仅App端支持，nvue页面写法不如vue页面方便，在`z-paging`中一些配置和方法在nvue中不支持，且nvue页面中支持的第三方组件也比vue页面少。 |

#### 【总结】

* 如果项目列表item比较简单，分页数据量不是特别多，建议使用默认的「内置scroll-view滚动」。
* 如果项目列表item比较复杂，数据量多，且使用「内置scroll-view滚动」时卡顿明显，建议使用页面滚动。
* 如果是App项目，且对性能和细节有较高要求，建议在nvue中使用`z-paging`。

## 注意事项及常见问题

* 【使用内置scroll-view滚动时】z-paging必须有确定的高度！否则上拉加载更多将无法触发，请确保z-paging的所有父view有确定的高度！！
* 【使用内置scroll-view滚动时】请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突，计算z-paging高度比较麻烦时，建议通过`flex:1`给z-paging设置样式，其父view需要开启`flex`。
* 【使用内置scroll-view滚动时】如果设置了z-paging的height为100%（让z-paging的高度等于当前页面有效高度），则它的父view高度也必须为100%(或者其他确定的高度)，若z-paging的所有父节点高度都为100%，则同时也必须设置`page{height:100%}`才有效果，`page{height:100%}`建议写在App.vue中。(因为page默认没有确定的高度，如果page未设置确定的高度，则其内部的所有view设置`height:100%`都是无效的，因为未设置确定高度则代表着这个view会无限`长高`，因此子view即使设置了`height:100%`，也同样是无限`长高`，无法限制其高度小于或等于当前页面有效的高度)。
* 【使用页面滚动时】使用z-paging内置的scroll-view滚动性能不及使用页面的滚动。若您要使用页面的滚动，请勿固定z-paging的高度，并且必须设置`use-page-scroll`为true，否则将导致页面无法滚动。
* 【使用横向滑动切换tab时】z-paging默认会禁止所有touchmove事件冒泡以避免下拉刷新冲突，这将导致使用滑动切换tab时无法横向切换，若您需要横向切换功能，请设置`touchmove-propagation-enabled`为true以允许冒泡；若此时下拉刷新是页面也跟着下拉，需要在pages.json中设置页面的"disableScroll":true或在page的根节点中添加`@touchmove.stop.prevent`，详情可查看demo。
* 【出现实际上有更多数据，而显示没有更多数据时】默认的pageSize(每页显示数量)为10，如果您服务端不需要传pageSize(例如有默认的pageSize：8)，则您需要将默认的pageSize改成您与后端约定好的（8），若没有修改，则z-paging会认为传给服务端的pageSize是10，而服务端只返回了8条，因此会直接判定为没有更多数据。
* 【若页面无法滚动】请检查z-paging是否有固定的高度；若您想使用页面滚动而非z-paging内置的scroll-view的滚动，请设置`use-page-scroll`为true。

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
    /* 注意，父元素需要固定高度，z-paging的height:100%才会生效 */
    page {
        height: 100%;
    }
    .content {
        height: 100%;
    }
</style>
```

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

|                        参数                         |                             说明                             |      类型      |         默认值         |                            可选值                            |
| :-------------------------------------------------: | :----------------------------------------------------------: | :------------: | :--------------------: | :----------------------------------------------------------: |
|                   default-page-no                   |                         自定义pageNo                         | Number\|String |           1            |                              -                               |
|                  default-page-size                  |                        自定义pageSize                        | Number\|String |           15           |                              -                               |
|                    paging-style                     | 设置z-paging的style，部分平台可能无法直接修改组件的style，可使用此属性代替 |     Object     |           -            |                              -                               |
|                     auto-height                     | z-paging是否自动高度，若自动高度则会自动铺满屏幕，不需要设置父view为100%等操作。（注意：自动高度可能并不准确，因为其计算方式是获取窗口【注意这里是“窗口”，不是“页面”，也就是只要您的项目包含了tabbar，所有页面的可用高度都减去了tabbar的高度】的可用高度【不包含导航栏和tabbar的高度】- z-paging与可用视图顶部的距离），可以通过`auto-height-addition`进行调整。 |    Boolean     |         false          |                             true                             |
|                auto-height-addition                 | z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，默认为px，若需要减少高度，请传负数。如"-10rpx"，"10.5px" |     String     |          0px           |                              -                               |
|                 default-theme-style                 | loading(下拉刷新、上拉加载更多)的主题样式，支持black，white  |     String     |         black          |                            white                             |
|                   use-page-scroll                   | 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略繁琐 |    Boolean     |         false          |                             true                             |
|              mounted-auto-call-reload               | `z-paging` `mounted`后自动调用`reload`方法(`mounted`后自动调用接口) |    Boolean     |          true          |                            false                             |
|           auto-scroll-to-top-when-reload            |                    reload时自动滚动到顶部                    |    Boolean     |          true          |                            false                             |
|             auto-clean-list-when-reload             | reload时立即自动清空原list，若立即自动清空，则在reload之后、请求回调之前页面是空白的 |    Boolean     |          true          |                            false                             |
|                use-custom-refresher                 | 是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新 |    Boolean     |          true          | h5、App、微信小程序以外的平台设置为false时，无法使用下拉刷新 |
|                    refresher-fps                    | 自定义下拉刷新下拉帧率，默认为30，过高可能会出现抖动问题(use-custom-refresher为true时生效) | Number\|String |           30           |                              -                               |
|                 refresher-max-angle                 | 自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发。(值小于0或大于90时，代表不受角度限制) | Number\|String |           40           |                             0-90                             |
|       refresher-angle-enable-change-continued       | 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为是，在tab横向切换时建议设置为否 |    Boolean     |          true          |                            false                             |
|               refresher-default-text                | 自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效) |     String     |      继续下拉刷新      |                              -                               |
|               refresher-pulling-text                | 自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效) |     String     |      松开立即刷新      |                              -                               |
|              refresher-refreshing-text              | 自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效) |     String     |      正在刷新...       |                              -                               |
|            refresher-end-bounce-enabled             | 是否开启自定义下拉刷新刷新结束回弹效果(use-custom-refresher为true时生效) |    Boolean     |          true          |                            false                             |
|                loading-more-enabled                 | 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据) |    Boolean     |          true          |                            false                             |
|           to-bottom-loading-more-enabled            |                是否启用滑动到底部加载更多数据                |    Boolean     |          true          |                            false                             |
|                  loading-more-text                  |  自定义底部加载更多文字(当需要不同加载状态固定文字时才使用)  |     String     |           -            |                              -                               |
|              loading-more-custom-style              |         自定义底部加载更多样式；如：{'color':'red'}          |     Object     |           -            |                              -                               |
|       loading-more-loading-icon-custom-style        |               自定义底部加载更多加载中动画样式               |     Object     |           -            |                              -                               |
|           loading-more-loading-icon-type            | 自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower |     String     |         flower         |                            circle                            |
|       loading-more-loading-icon-custom-image        | 自定义底部加载更多加载中动画图标图片，若设置则使用自定义的动画图标，`loading-more-loading-icon-type`将无效 |     String     |           -            |                              -                               |
|              loading-more-default-text              |                     滑动到底部"默认"文字                     |     String     |      点击加载更多      |                              -                               |
|              loading-more-loading-text              |                    滑动到底部"加载中"文字                    |     String     |      正在加载...       |                              -                               |
|              loading-more-no-more-text              |                   滑动到底部"没有更多"文字                   |     String     |       没有更多了       |                              -                               |
|               loading-more-fail-text                |                   滑动到底部"加载失败"文字                   |     String     | 加载失败，点击重新加载 |                              -                               |
| hide-loading-more-when-no-more-and-inside-of-paging | 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view |    Boolean     |          true          |                            false                             |
|           show-loading-more-no-more-view            |                  是否显示没有更多数据的view                  |    Boolean     |          true          |                            false                             |
|           show-default-loading-more-text            |                  是否显示默认的加载更多text                  |    Boolean     |          true          |                            false                             |
|           show-loading-more-no-more-line            |            是否显示没有更多数据的分割线，默认为是            |    Boolean     |          true          |                            false                             |
|       loading-more-no-more-line-custom-style        |              自定义底部没有更多数据的分割线样式              |     Object     |           -            |                              -                               |
|                   hide-empty-view                   |                     是否强制隐藏空数据图                     |    Boolean     |         false          |                             true                             |
|          auto-hide-empty-view-when-loading          |            加载中时是否自动隐藏空数据图，默认为是            |    Boolean     |          true          |                            false                             |
|                   show-scrollbar                    |                      控制是否出现滚动条                      |    Boolean     |         false          |                             true                             |
|            scroll-to-top-bounce-enabled             | iOS设备上滚动到顶部时是否允许回弹效果。关闭回弹效果后可使滚动到顶部后立即下拉可立即触发下拉刷新，但是有吸顶view时滚动到顶部时可能出现抖动。 |    Boolean     |          true          |                            false                             |
|                scroll-with-animation                |                在设置滚动条位置时使用动画过渡                |    Boolean     |         false          |                             true                             |
|                  scroll-into-view                   | 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |     String     |           -            |                              -                               |
|                   lower-threshold                   |     距底部/右边多远时（单位px），触发 scrolltolower 事件     |     Number     |           50           |                              -                               |
|                 enable-back-to-top                  | iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向 |    Boolean     |         false          |                             true                             |
|                  refresher-enabled                  |                       是否开启下拉刷新                       |    Boolean     |          true          |                            false                             |
|                 refresher-threshold                 |               设置自定义下拉刷新阈值（单位px）               |     Number     |           45           |                              -                               |
|               refresher-default-style               | 设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式 |     String     |         black          |                         white、none                          |
|                refresher-background                 |                设置自定义下拉刷新区域背景颜色                |     String     |    #FFFFFF00(透明)     |                              -                               |
|              local-paging-loading-time              |          本地分页时上拉加载更多延迟时间，单位为毫秒          | Number\|String |          200           |                              -                               |
|                use-chat-record-mode                 | 使用聊天记录模式，为保证良好的体验，建议同时开启页面滚动(设置`use-page-scroll`为true) |    Boolean     |         false          |                             true                             |
|            touchmove-propagation-enabled            | 是否允许touchmove事件冒泡，默认为否，禁止冒泡可避免一些情况下下拉刷新时页面其他元素跟着下移，若您使用横向滑动切换选项卡，则需要将此属性设置为true，否则无法横向滑动。 |    Boolean     |         false          |                             true                             |

## Slot

| 名称               | 说明                                                         |
| :----------------- | ------------------------------------------------------------ |
| empty              | 自定义空数据占位view                                         |
| loading            | 自定义页面reload时的加载view                                 |
| refresher          | 自定义下拉刷新view，设置后则不使用uni自带的下拉刷新view和z-paging自定义的下拉刷新view。此view的style必须设置为`height:100%` (use-custom-refresher为true时生效) |
| chatLoading        | 使用聊天记录模式时自定义顶部加载更多view，`use-chat-record-mode`为true时有效 |
| loadingMoreDefault | 自定义滑动到底部"默认"状态的view                             |
| loadingMoreLoading | 自定义滑动到底部"加载中"状态的view                           |
| loadingMoreNoMore  | 自定义滑动到底部"没有更多数据"状态的view                     |
| loadingMoreFail    | 自定义滑动到底部"加载失败"状态的view                         |

## Events

* 监听组件方法(自定义扩展，一般无需使用)

| 事件名                | 说明                                                         | 回调参数                                                    |
| --------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| loadingStatusChange   | 上拉加载更多状态改变                                         | value:0-默认状态 1.加载中 2.没有更多数据 3.加载失败         |
| refresherStatusChange | 自定义下拉刷新状态改变(use-custom-refresher为true时生效)【注：通过`:refresher-status.sync`绑定当前data中的指定变量亦可】 | value:0-默认状态 1.松手立即刷新 2.刷新中                    |
| refresherTouchstart   | 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前触摸开始的屏幕点的y值(单位px)                     |
| refresherTouchmove    | 自定义下拉刷新下拉中开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前需要下拉的距离(单位px)                            |
| refresherTouchend     | 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】 | value:当前触摸结束分页内容下移的y值(单位px)                 |
| onRefresh             | 自定义下拉刷新被触发                                         | -                                                           |
| onRestore             | 自定义下拉刷新被复位                                         | -                                                           |
| scroll                | `z-paging`内置的scroll-view滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} | -                                                           |
| scrollTopChange       | scrollTop改变时触发，使用点击返回顶部时需要获取scrollTop时可使用此事件【注：通过`:scroll-top.sync`绑定当前data中的指定变量亦可】 |                                                             |
| scrolltolower         | `z-paging`内置的scroll-view滚动底部时触发                    | value:来源(`toBottom`滚动到底部；`click`点击了加载更多view) |

* 主动调用组件方法 (假设给z-paging设置ref="paging"，则通过this.$refs.paging.xxx()方式调用)

  注意：在Page的onLoad()方法中无法同步获取this.$refs，请加一个setTimeOut延时1毫秒或nextTick再调用(默认会在页面加载时自动调用reload()无须手动调用)

| 方法名               | 说明                                                         | 参数                                                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| reload               | 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果   | value：(传true或false，默认为false)reload时是否展示下拉刷新动画，默认为否 |
| complete             | 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理 | value1:请求结果数组；value2:是否请求成功，不填默认为true     |
| setLocalPaging       | 设置本地分页，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件） | value1:请求结果数组；value2:是否请求成功，不填默认为true     |
| doLoadMore           | 手动触发上拉加载更多(非必须，可依据具体需求使用，例如当z-paging未确定高度时，内部的scroll-view会无限增高，此时z-paging无法得知是否滚动到底部，您可以在页面的`onReachBottom`中手动调用此方法触发上拉加载更多) ps:`use-page-scroll`需要设置为true | -                                                            |
| doChatRecordLoadMore | 手动触发滚动到顶部加载更多，聊天记录模式时有效               | -                                                            |
| scrollToTop          | 滚动到顶部                                                   | value1:是否有动画效果，默认为是                              |
| scrollToBottom       | 滚动到底部                                                   | value1:是否有动画效果，默认为是                              |
| updatePageScrollTop  | 当使用页面滚动(z-paging不固定高度)并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新 |                                                              |
| addChatRecordData    | 添加聊天记录，`use-chat-record-mode`为true时有效             | value1:需要添加的聊天数据，可以是一条数据或一组数据；value2:是否滚动到底部，不填默认为true；value3:是否使用动画滚动到底部，不填默认为true |
| addDataFromTop       | 从顶部添加数据，不会影响分页的pageNo和pageSize               | value1:需要添加的数据，可以是一条数据或一组数据；value2:是否滚动到顶部，不填默认为true；value3:是否使用动画滚动到顶部，不填默认为true |
| resetTotalData       | 重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组) | Value1:修改后的列表数组                                      |

|      |      |      |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
|      |      |      |
