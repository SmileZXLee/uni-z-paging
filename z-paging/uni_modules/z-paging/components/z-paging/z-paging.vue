<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->

<!-- 使用方法 -->
<!-- 
1.在html中：
其中@query绑定js中分页请求的方法，:list.sync绑定列表for循环的list.
<paging @query="getList" :list.sync="list" ref="paging" style="height: 100%;">
	这里面写需要分页的list，由于slot有数量限制，建议在这里面的外层套一层非循环创建的view，如:
	<view class="data-list">
		<view class="data-item" v-for="(item,index) in list" :key="index"></view>
	</view>
</paging>
2.在js的method中：
书写请求分页的方法
getList(pageNo,pagSize){
	//拿到分页组件传递过来的pageNo和pageSize和其他需要的参数，传给服务器
	//在请求成功的回调里面拿到服务器返回的数据，调用以下方法即可(假设res.data.list为服务器返回列表)：
	this.$refs.paging.addData(res.data.list);
	//如果请求失败，可以书写以下代码：
	this.$refs.paging.addData(false);
}
3.如果要重新加载分页数据(如下拉刷新):
在js中调用
```js
this.$refs.paging.reload();
```
注意：如果需要在在Page的onLoad()方法中使用（默认自动会调用），请加一个setTimeOut或nextTick再调用
```js
setTimeout(()=>{
	this.$refs.paging.reload();
},1)
```
4.注意事项：
a、因分页组件是通过@scrolltolower来判断滚动到底部的，因此z-paging需要有固定的高度，才可以触发滚动到底部事件，
若未确定其高度而是根据具体内容将其撑高，则它永远滚动不到底部，因为它不存在[底部]的概念，因为它会无限[长高]。
b、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突
c、z-paging默认会禁止所有touchmove事件冒泡以避免下拉刷新冲突，这将导致使用滑动切换tab时无法横向切换，若您需要横向切换功能，请设置`touchmove-propagation-enabled`为true以允许冒泡；
若此时下拉刷新是页面也跟着下拉，需要在pages.json中设置页面的"disableScroll":true。或者在当前page的根view中添加@touchmove.stop.prevent (因uni无法动态控制是否允许冒泡，因此只能使用此方法，若您有更好的解决方案可以通过顶部github或dcloud插件市场联系我，不胜感激！)
 -->
<template name="z-paging">
	<view v-if="!touchmovePropagationEnabled&&refresherEnabled&&useCustomRefresher" class="z-paging-content" @touchmove.stop.prevent>
		<scroll-view class="scroll-view" :scroll-top="scrollTop" :scroll-y="!usePageScroll&&scrollEnable" :enable-back-to-top="enableBackToTop"
		 :show-scrollbar="showScrollbar" :scroll-with-animation="scrollWithAnimation" :scroll-into-view="scrollIntoView" :lower-threshold="lowerThreshold" :refresher-enabled="refresherEnabled&&!useCustomRefresher"
		 :refresher-threshold="refresherThreshold" :refresher-default-style="finalRefresherDefaultStyle"
		 :refresher-background="refresherBackground" :refresher-triggered="refresherTriggered" @scroll="_scroll"
		 @scrolltolower="_onLoadingMore('toBottom')" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh"
		 @touchstart="_refresherTouchstart" @touchmove="_refresherTouchmove" @touchend="_refresherTouchend">
			<view class="paging-main" :style="[{'transform': refresherTransform,'transition': refresherTransition}]">
				<view v-if="refresherEnabled&&useCustomRefresher&&isTouchmoving" class="custom-refresher-view" :style="[{'margin-top': `-${refresherThreshold}px`,'background-color': refresherBackground}]">
					<view :style="[{'height': `${refresherThreshold}px`,'background-color': refresherBackground}]">
						<slot v-if="$slots.refresher" name="refresher" />
						<view v-else class="custom-refresher-container" style="height: 100%;">
							<view class="custom-refresher-left">
								<image v-if="refresherStatus!==2" :class="refresherLeftImageClass" :style="[{'transform': 'rotate(180deg)','filter' :defaultThemeStyle==='white'?'brightness(10)':''}]"
								 :src="base64Arrow"></image>
								<image v-else class="loading-more-line-loading-image custom-refresher-left-image" :src="base64Flower"></image>
							</view>
							<view :class="defaultThemeStyle==='white'?'custom-refresher-right custom-refresher-right-white':'custom-refresher-right custom-refresher-right-black'">
								<view class="custom-refresher-right-text">{{refresherStatusTextMap[refresherStatus]}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="paging-container">
					<slot v-if="$slots.loading&&!firstPageLoaded&&loading" name="loading" />
					<slot v-if="$slots.empty&&!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading" name="empty" />
					<!-- 如果需要修改组件源码来统一设置全局的emptyView，可以把此处的“empty-view”换成自定义的组件名即可 -->
					<!-- <empty-view v-else-if="!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading"></empty-view> -->
					<view class="paging-container-content">
						<slot />
					</view>
					<slot @click="_onLoadingMore('click')" v-if="loadingStatus===0&&$slots.loadingMoreDefault&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreDefault" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===1&&$slots.loadingMoreLoading&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreLoading" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===2&&$slots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView&&loadingMoreEnabled"
					 name="loadingMoreNoMore" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===3&&$slots.loadingMoreFail&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreFail" />
					<view @click="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled"
					 class="load-more-container" :style="[loadingMoreCustomStyle]">
						<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
						 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
						<image v-if="loadingStatus===1&&loadingMoreLoadingIconCustomImage.length" :src="loadingMoreLoadingIconCustomImage"
						 class="loading-more-line-loading-custom-image"></image>
						<image v-if="loadingStatus===1&&loadingMoreLoadingIconType==='flower'&&!loadingMoreLoadingIconCustomImage.length"
						 class="loading-more-line-loading-image" :style="[loadingMoreLoadingIconCustomStyle]" :src="base64Flower"></image>
						<text v-if="loadingStatus===1&&loadingMoreLoadingIconType==='circle'&&!loadingMoreLoadingIconCustomImage.length"
						 :class="defaultThemeStyle==='white'?'loading-more-line-loading-view loading-more-line-loading-view-white':'loading-more-line-loading-view loading-more-line-loading-view-black'"
						 :style="[loadingMoreLoadingIconCustomStyle]"></text>
						<text :class="defaultThemeStyle==='white'?'loading-more-text loading-more-text-white':'loading-more-text loading-more-text-black'">{{ownLoadingMoreText}}</text>
						<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
						 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	<!-- 此处的代码和上方完全一样，复制了一份，因为在uni上暂时没找到动态控制是否阻止冒泡的方案；
	尝试过以下方案：
	 1.通过event.stopPropagation()来阻止冒泡，因为事件返回的event对象并非浏览器的evnet对象，因此uni只支持使用修饰符阻止冒泡；
	 2.参照了uni的scrollView的源码，使用addEventListener来添加touch事件，并在touch事件中获取到浏览器event对象调用event.stopPropagation()来阻止冒泡，
	 但因在uni中使用ref无法获取view等对象而放弃，进而使用uni.createSelectorQuery()查找指定view，但在小程序中无法获取浏览器dom对象，因此也不可行。
	 3.在最上面盖一个透明view并添加touch相关手势，但会影响底下view的点击等事件，因此它们不属于父子关系，而是兄弟关系，手势点击无法向上传递。
	 4.使用小程序中的template is将重复代码复用，然后使用v-if来隐藏或显示两个不同的“paging-main”，但uni中不支持此写法。
	 【如果有更优解决方案可以发送邮件到admin.zxlee.cn或加入qq群790460711提出您的想法，感谢！！！】 -->
	<view v-else class="z-paging-content">
		<scroll-view class="scroll-view" :scroll-top="scrollTop" :scroll-y="!usePageScroll&&scrollEnable" :enable-back-to-top="enableBackToTop"
		 :show-scrollbar="showScrollbar" :scroll-with-animation="scrollWithAnimation" :scroll-into-view="scrollIntoView" :lower-threshold="lowerThreshold" :refresher-enabled="refresherEnabled&&!useCustomRefresher"
		 :refresher-threshold="refresherThreshold" :refresher-default-style="finalRefresherDefaultStyle"
		 :refresher-background="refresherBackground" :refresher-triggered="refresherTriggered" @scroll="_scroll"
		 @scrolltolower="_onLoadingMore('toBottom')" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh"
		 @touchstart="_refresherTouchstart" @touchmove="_refresherTouchmove" @touchend="_refresherTouchend">
			<view class="paging-main" :style="[{'transform': refresherTransform,'transition': refresherTransition}]">
				<view v-if="refresherEnabled&&useCustomRefresher&&isTouchmoving" class="custom-refresher-view" :style="[{'height': `${refresherThreshold}px`,'margin-top': `-${refresherThreshold}px`,'background-color': refresherBackground}]">
					<view :style="[{'height': `${refresherThreshold}px`,'background-color': refresherBackground}]">
						<slot v-if="$slots.refresher" name="refresher" />
						<view v-else class="custom-refresher-container" style="height: 100%;">
							<view class="custom-refresher-left">
								<image v-if="refresherStatus!==2" :class="refresherLeftImageClass" :style="[{'transform': 'rotate(180deg)','filter' :defaultThemeStyle==='white'?'brightness(10)':''}]"
								 :src="base64Arrow"></image>
								<image v-else class="loading-more-line-loading-image custom-refresher-left-image" :src="base64Flower"></image>
							</view>
							<view :class="defaultThemeStyle==='white'?'custom-refresher-right custom-refresher-right-white':'custom-refresher-right custom-refresher-right-black'">
								<view class="custom-refresher-right-text">{{refresherStatusTextMap[refresherStatus]}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="paging-container">
					<slot v-if="$slots.loading&&!firstPageLoaded&&loading" name="loading" />
					<slot v-if="$slots.empty&&!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading" name="empty" />
					<!-- 如果需要修改组件源码来统一设置全局的emptyView，可以把此处的“empty-view”换成自定义的组件名即可 -->
					<!-- <empty-view v-else-if="!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading"></empty-view> -->
					<view class="paging-container-content">
						<slot />
					</view>
					<slot @click="_onLoadingMore('click')" v-if="loadingStatus===0&&$slots.loadingMoreDefault&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreDefault" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===1&&$slots.loadingMoreLoading&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreLoading" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===2&&$slots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView&&loadingMoreEnabled"
					 name="loadingMoreNoMore" />
					<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===3&&$slots.loadingMoreFail&&showLoadingMore&&loadingMoreEnabled"
					 name="loadingMoreFail" />
					<view @click="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled"
					 class="load-more-container" :style="[loadingMoreCustomStyle]">
						<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
						 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
						<image v-if="loadingStatus===1&&loadingMoreLoadingIconCustomImage.length" :src="loadingMoreLoadingIconCustomImage"
						 class="loading-more-line-loading-custom-image"></image>
						<image v-if="loadingStatus===1&&loadingMoreLoadingIconType==='flower'&&!loadingMoreLoadingIconCustomImage.length"
						 class="loading-more-line-loading-image" :style="[loadingMoreLoadingIconCustomStyle]" :src="base64Flower"></image>
						<text v-if="loadingStatus===1&&loadingMoreLoadingIconType==='circle'&&!loadingMoreLoadingIconCustomImage.length"
						 :class="defaultThemeStyle==='white'?'loading-more-line-loading-view loading-more-line-loading-view-white':'loading-more-line-loading-view loading-more-line-loading-view-black'"
						 :style="[loadingMoreLoadingIconCustomStyle]"></text>
						<text :class="defaultThemeStyle==='white'?'loading-more-text loading-more-text-white':'loading-more-text loading-more-text-black'">{{ownLoadingMoreText}}</text>
						<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
						 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	const { windowHeight } = uni.getSystemInfoSync();
	const base64Arrow =
		'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUyNS4zMzkzMjYgMTg2LjE3MjQ1Mkw4MDEuNzg5MDg2IDQ2Mi42MjIyMTJjMTIuNDk2Njk4IDEyLjQ5NjY5OCAzMi43NTgxMzYgMTIuNDk2Njk4IDQ1LjI1NDgzNCAwIDEyLjQ5NzQwNS0xMi40OTc0MDUgMTIuNDk2Njk4LTMyLjc1ODEzNiAwLTQ1LjI1NDgzNGwtMzMxLjAxNDM2Mi0zMzEuMDE0MzYyYy0xMi40OTY2OTgtMTIuNDk2Njk4LTMyLjc1NzQyOS0xMi40OTc0MDUtNDUuMjU0ODM0IDBsLTM0MS43OTU2MTkgMzM5LjE0Mzk2OWMtMTIuNDk2Njk4IDEyLjQ5NjY5OC0xMi40OTY2OTggMzIuNzU4MTM2IDAgNDUuMjU0ODM0IDEyLjQ5NjY5OCAxMi40OTY2OTggMzIuNzU4MTM2IDEyLjQ5NjY5OCA0NS4yNTQ4MzQgMGwyODcuMTA1ODYtMjg0LjQ1NDIwOUw0NjEuMzcyMzI1IDkyNS43MjYyNDJjMCAxNy42NzM0MjcgMTQuMzI2NjkgMzIuMDAwMTE3IDMyLjAwMDExOCAzMi4wMDAxMTcgMTcuNjcyNzItMC4wMDA3MDcgMzEuOTk5NDEtMTQuMzI3Mzk4IDMyLjAwMDExNy0zMi4wMDAxMTdsLTAuMDMyNTI3LTczOS41NTMwODN6IiBmaWxsPSIjNTE1MTUxIiAvPjwvc3ZnPg==';
	const base64Flower =
		'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYyNC42NjMgNzg1LjEzOWMtMTAuNzM1LTE4LjU5NS00LjMxNi00Mi4zOTcgMTQuMzM3LTUzLjE2OCAxOC42NTMtMTAuNzcgNDIuNDc5LTQuNDI3IDUzLjIxMyAxNC4xNjhsOTAuMTIzIDE1Ni4wOTljMTAuNzM2IDE4LjU5NSA0LjMxNyA0Mi4zOTgtMTQuMzM2IDUzLjE2OS0xOC42NTMgMTAuNzctNDIuNDc5IDQuNDI2LTUzLjIxNC0xNC4xNjlsLTkwLjEyMy0xNTYuMDk5eiIgZmlsbD0iI2NkY2RjZCIgLz48cGF0aCBkPSJNMjQxLjY2NCAxMjEuNzY0Yy0xMC43MzUtMTguNTk0LTQuMzE3LTQyLjM5OCAxNC4zMzYtNTMuMTY5IDE4LjY1My0xMC43NyA0Mi40NzktNC40MjYgNTMuMjE0IDE0LjE2OGw5MC4xMjQgMTU2LjA5OWMxMC43MzUgMTguNTk0IDQuMzE2IDQyLjM5OC0xNC4zMzcgNTMuMTY4LTE4LjY1MyAxMC43Ny00Mi40NzggNC40MjYtNTMuMjEzLTE0LjE2OGwtOTAuMTI0LTE1Ni4wOTh6IiBmaWxsPSIjYTlhOWE5IiAvPjxwYXRoIGQ9Ik0yMzguODYxIDYyNC42NjNjMTguNTk0LTEwLjczNSA0Mi4zOTgtNC4zMTYgNTMuMTY4IDE0LjMzNyAxMC43NyAxOC42NTMgNC40MjYgNDIuNDc5LTE0LjE2OCA1My4yMTNsLTE1Ni4wOTggOTAuMTI0Yy0xOC41OTQgMTAuNzM1LTQyLjM5OSA0LjMxNi01My4xNjgtMTQuMzM3LTEwLjc3LTE4LjY1My00LjQyNi00Mi40NzkgMTQuMTY4LTUzLjIxM2wxNTYuMDk4LTkwLjEyNHoiIGZpbGw9IiNiYmJiYmIiIC8+PHBhdGggZD0iTTkwMi4yMzYgMjQxLjY2NGMxOC41OTQtMTAuNzM2IDQyLjM5OC00LjMxNyA1My4xNjkgMTQuMzM2IDEwLjc3IDE4LjY1NCA0LjQyNiA0Mi40NzktMTQuMTY5IDUzLjIxNGwtMTU2LjA5OSA5MC4xMjNjLTE4LjU5NCAxMC43MzUtNDIuMzk3IDQuMzE2LTUzLjE2OC0xNC4zMzctMTAuNzctMTguNjU0LTQuNDI2LTQyLjQ3OSAxNC4xNjgtNTMuMjEzbDE1Ni4wOTktOTAuMTIzeiIgZmlsbD0iIzk5OTk5OSIgLz48cGF0aCBkPSJNMzMxLjc4NyA3NDYuMTM5YzEwLjczNC0xOC41OTUgMzQuNTYtMjQuOTM4IDUzLjIxMy0xNC4xNjggMTguNjUzIDEwLjc3MSAyNS4wNzIgMzQuNTczIDE0LjMzNiA1My4xNjhsLTkwLjEyMyAxNTYuMDk5Yy0xMC43MzQgMTguNTk1LTM0LjU2IDI0LjkzOC01My4yMTMgMTQuMTY5LTE4LjY1My0xMC43NzEtMjUuMDcyLTM0LjU3NC0xNC4zMzYtNTMuMTY5bDkwLjEyMy0xNTYuMDk5eiIgZmlsbD0iI2MyYzJjMiIgLz48cGF0aCBkPSJNNzE0Ljc4NiA4Mi43NjRjMTAuNzM1LTE4LjU5NCAzNC41NjEtMjQuOTM4IDUzLjIxNC0xNC4xNjkgMTguNjUzIDEwLjc3MSAyNS4wNzIgMzQuNTc1IDE0LjMzNyA1My4xNjhsLTkwLjEyMyAxNTYuMDk5Yy0xMC43MzUgMTguNTk0LTM0LjU2MSAyNC45MzgtNTMuMjE0IDE0LjE2OC0xOC42NTMtMTAuNzcxLTI1LjA3Mi0zNC41NzQtMTQuMzM3LTUzLjE2OGw5MC4xMjMtMTU2LjA5OHoiIGZpbGw9IiM5ZDlkOWQiIC8+PHBhdGggZD0iTTI3Ny44NjEgMzMxLjc4N2MxOC41OTQgMTAuNzM1IDI0LjkzOCAzNC41NiAxNC4xNjggNTMuMjEzcy0zNC41NzQgMjUuMDcyLTUzLjE2OCAxNC4zMzZMODIuNzYzIDMwOS4yMTNDNjQuMTY5IDI5OC40NzggNTcuODI1IDI3NC42NTMgNjguNTk1IDI1NmMxMC43NzEtMTguNjUzIDM0LjU3NC0yNS4wNzIgNTMuMTY4LTE0LjMzNmwxNTYuMDk4IDkwLjEyM3oiIGZpbGw9IiNhZmFmYWYiIC8+PHBhdGggZD0iTTk0MS4yMzYgNzE0Ljc4NmMxOC41OTUgMTAuNzM0IDI0LjkzOCAzNC41NjEgMTQuMTY5IDUzLjIxNC0xMC43NzEgMTguNjUzLTM0LjU3NCAyNS4wNzItNTMuMTY5IDE0LjMzN2wtMTU2LjA5OS05MC4xMjNDNzI3LjU0NCA2ODEuNDc5IDcyMS4yIDY1Ny42NTMgNzMxLjk3IDYzOWMxMC43NzEtMTguNjUzIDM0LjU3NC0yNS4wNzIgNTMuMTY4LTE0LjMzN2wxNTYuMDk4IDkwLjEyM3oiIGZpbGw9IiNkMWQxZDEiIC8+PHBhdGggZD0iTTIxOS4xMjMgNDczYzIxLjQ3MSAwIDM4Ljg3NyAxNy40NjEgMzguODc3IDM5cy0xNy40MDYgMzktMzguODc3IDM5SDM4Ljg3N0MxNy40MDYgNTUxIDAgNTMzLjUzOSAwIDUxMnMxNy40MDYtMzkgMzguODc3LTM5aDE4MC4yNDZ6IiBmaWxsPSIjYjZiNmI2IiAvPjxwYXRoIGQ9Ik05ODUuMTIzIDQ3M2MyMS40NzEgMCAzOC44NzcgMTcuNDYxIDM4Ljg3NyAzOXMtMTcuNDA2IDM5LTM4Ljg3NyAzOUg4MDQuODc3Yy0yMS40NzEgMC0zOC44NzctMTcuNDYxLTM4Ljg3Ny0zOXMxNy40MDYtMzkgMzguODc3LTM5aDE4MC4yNDZ6IiBmaWxsPSIjOTQ5NDk0IiAvPjxwYXRoIGQ9Ik01NTEgMjE5LjEyM2MwIDIxLjQ3MS0xNy40NjEgMzguODc3LTM5IDM4Ljg3N3MtMzktMTcuNDA2LTM5LTM4Ljg3N1YzOC44NzdjMC0yMS40NzEgMTcuNDYxLTM4Ljg3NyAzOS0zOC44NzdzMzkgMTcuNDA2IDM5IDM4Ljg3N3YxODAuMjQ2eiIgZmlsbD0iI2EzYTNhMyIgLz48cGF0aCBkPSJNNTUxIDk4NS4xMjNjMCAyMS40NzEtMTcuNDYxIDM4Ljg3Ny0zOSAzOC44NzdzLTM5LTE3LjQwNi0zOS0zOC44NzdWODA0Ljg3N2MwLTIxLjQ3MSAxNy40NjEtMzguODc3IDM5LTM4Ljg3N3MzOSAxNy40MDYgMzkgMzguODc3djE4MC4yNDZ6IiBmaWxsPSIjYzhjOGM4IiAvPjwvc3ZnPg=='
	/**
	 * z-paging 分页组件
	 * @description 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view等。
	 * @tutorial https://github.com/SmileZXLee/uni-z-paging
	 * @property {Number} default-page-no 自定义pageNo，默认为1
	 * @property {Number} default-page-size 自定义pageSize，默认为15
	 * @property {String} default-theme-style loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
	 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
	 * @property {Boolean} mounted-auto-call-reload z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} auto-scroll-to-top-when-reload reload时自动滚动到顶部，默认为是
	 * @property {Boolean} auto-clean-list-when-reload reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
	 * @property {Boolean} use-custom-refresher 是否使用自定义的下拉刷新，默认为否，使用uni自带的下拉刷新。设置为是后则使用z-paging的下拉刷新
	 * @property {Number} refresher-fps 自定义下拉刷新下拉帧率，默认为30，过高可能会出现抖动问题(use-custom-refresher为true时生效)
	 * @property {String} refresher-default-text 自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
	 * @property {String} refresher-pulling-text 自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
	 * @property {String} refresher-refreshing-text 自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
	 * @property {Boolean} refresher-end-bounce-enabled 是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
	 * @property {String} loading-more-text 自定义底部加载更多文字
	 * @property {Object} loading-more-custom-style 自定义底部加载更多样式
	 * @property {Object} loading-more-loading-icon-custom-style 自定义底部加载更多加载中动画样式
	 * @property {String} loading-more-loading-icon-type 自定义底部加载更多加载中动画图标类型，可选circle或flower，默认为circle
	 * @property {String} loading-more-loading-icon-custom-image 自定义底部加载更多加载中动画图标图片
	 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
	 * @property {Boolean} to-bottom-loading-more-enabled 是否启用滑动到底部加载更多数据
	 * @property {String} loading-more-default-text 滑动到底部"默认"文字，默认为【点击加载更多】
	 * @property {String} loading-more-loading-text 滑动到底部"加载中"文字，默认为【正在加载...】
	 * @property {String} loading-more-no-more-text 滑动到底部"没有更多"文字，默认为【没有更多了】
	 * @property {String} loading-more-fail-text 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
	 * @property {Boolean} hide-loading-more-when-no-more-and-inside-of-paging 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
	 * @property {Boolean} show-loading-more-no-more-view 是否显示没有更多数据的view，默认为是
	 * @property {Boolean} show-default-loading-more-text 是否显示默认的加载更多text，默认为是
	 * @property {Boolean} show-loading-more-no-more-line 是否显示没有更多数据的分割线，默认为是
	 * @property {Object} loading-more-no-more-line-custom-style 自定义底部没有更多数据的分割线样式
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {Boolean} show-scrollbar 在设置滚动条位置时使用动画过渡，默认为否
	 * @property {Boolean} scroll-with-animation 控制是否出现滚动条，默认为否
	 * @property {String} scroll-into-view 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
	 * @property {Number} lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为50
	 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为否
	 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
	 * @property {Number} refresher-threshold 设置自定义下拉刷新阈值，默认为45
	 * @property {String} refresher-default-style 设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
	 * @property {String} refresher-background 设置自定义下拉刷新区域背景颜色
	 * @property {Boolean} touchmove-propagation-enabled 是否允许touchmove事件冒泡，默认为否，禁止冒泡可避免一些情况下下拉刷新时页面其他元素跟着下移，若您使用横向滑动切换选项卡，则需要将此属性设置为true，否则无法横向滑动
	 * @event {Function} addData 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是)
	 * @event {Function} reload 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
	 * @event {Function} endRefresh 手动停止下拉刷新加载
	 * @event {Function} loadingStatusChange 分页加载状态改变(0-默认状态 1.加载中 2.没有更多数据 3.加载失败)
	 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变(use-custom-refresher为true时生效)(0-默认状态 1.松手立即刷新 2.刷新中)
	 * @event {Function} refresherTouchstart 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchmove 自定义下拉刷新下拉中(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchend 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} onRefresh 自定义下拉刷新被触发
	 * @event {Function} onRestore 自定义下拉刷新被复位
	 * @event {Function} scroll 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
	 */
	export default {
		name: "z-paging",
		data() {
			return {
				windowHeight: 0,
				currentData: [],
				totalData: [],
				pageNo: 1,
				showLoadingMore: false,
				refresherTriggered: false,
				loading: false,
				firstPageLoaded: false,
				isUserReload: true,
				scrollEnable: true,
				scrollTop: 0,
				oldScrollTop: 0,
				base64Arrow: base64Arrow,
				base64Flower: base64Flower,
				refresherLeftImageClass: 'custom-refresher-left-image',
				refresherTouchstartY: 0,
				refresherTransform: 'translateY(0px)',
				refresherTransition: '0s',
				finalRefresherDefaultStyle: 'black',
				//当前加载类型 0-下拉刷新 1-上拉加载更多
				loadingType: 0,
				//底部加载更多状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
				loadingStatus: 0,
				//底部加载更多文字Map
				loadingStatusTextMap: {
					0: this.loadingMoreDefaultText,
					1: this.loadingMoreLoadingText,
					2: this.loadingMoreNoMoreText,
					3: this.loadingMoreFailText,
				},
				//下拉刷新状态 0-默认状态 1.松手立即刷新 2.刷新中
				refresherStatus: 0,
				//下拉刷新文字Map
				refresherStatusTextMap: {
					0: this.refresherDefaultText,
					1: this.refresherPullingText,
					2: this.refresherRefreshingText
				},
				pullDownTimeStamp: 0,
				pageScrollTop: -1,
				isTouchmoving: false
			};
		},
		props: {
			//自定义pageNo，默认为1
			defaultPageNo: {
				type: [Number, String],
				default: function() {
					return 1;
				},
				observer: function(newVal, oldVal) {
					this.pageNo = newVal;
				},
			},
			//自定义pageSize，默认为15
			defaultPageSize: {
				type: [Number, String],
				default: function() {
					return 15;
				},
			},
			//loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
			defaultThemeStyle: {
				type: String,
				default: function() {
					return 'black';
				}
			},
			//使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
			usePageScroll: {
				type: Boolean,
				default: function() {
					return false;
				}
			},
			//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
			mountedAutoCallReload: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//reload时自动滚动到顶部，默认为是
			autoScrollToTopWhenReload: {
				type: Boolean,
				default: function() {
					return true;
				}
			},
			//reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
			autoCleanListWhenReload: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//是否使用自定义的下拉刷新，默认为否，使用uni自带的下拉刷新。设置为是后则使用z-paging的下拉刷新
			useCustomRefresher: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//自定义下拉刷新下拉帧率，默认为30，过高可能会出现抖动问题(use-custom-refresher为true时生效)
			refresherFps: {
				type: Number,
				default: function() {
					return 30;
				},
			},
			//自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
			refresherDefaultText: {
				type: String,
				default: function() {
					return "继续下拉刷新";
				},
			},
			//自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
			refresherPullingText: {
				type: String,
				default: function() {
					return "松开立即刷新";
				},
			},
			//自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
			refresherRefreshingText: {
				type: String,
				default: function() {
					return "正在刷新...";
				},
			},
			//是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
			refresherEndBounceEnabled: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//自定义底部加载更多文字
			loadingMoreText: {
				type: String,
				default: function() {
					return "";
				},
			},
			//自定义底部加载更多样式
			loadingMoreCustomStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			//自定义底部加载更多加载中动画样式
			loadingMoreLoadingIconCustomStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			//自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
			loadingMoreLoadingIconType: {
				type: String,
				default () {
					return 'flower';
				}
			},
			//自定义底部加载更多加载中动画图标图片
			loadingMoreLoadingIconCustomImage: {
				type: String,
				default () {
					return '';
				}
			},
			//是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
			loadingMoreEnabled: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//是否启用滑动到底部加载更多数据，默认为是
			toBottomLoadingMoreEnabled: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//滑动到底部"默认"文字，默认为【点击加载更多】
			loadingMoreDefaultText: {
				type: String,
				default: function() {
					return "点击加载更多";
				},
			},
			//滑动到底部"加载中"文字，默认为【正在加载...】
			loadingMoreLoadingText: {
				type: String,
				default: function() {
					return "正在加载...";
				},
			},
			//滑动到底部"没有更多"文字，默认为【没有更多了】
			loadingMoreNoMoreText: {
				type: String,
				default: function() {
					return "没有更多了";
				},
			},
			//滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
			loadingMoreFailText: {
				type: String,
				default: function() {
					return "加载失败，点击重新加载";
				},
			},
			//当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
			hideLoadingMoreWhenNoMoreAndInsideOfPaging: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//是否显示默认的加载更多text，默认为是
			showDefaultLoadingMoreText: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//是否显示没有更多数据的view
			showLoadingMoreNoMoreView: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//是否显示没有更多数据的分割线，默认为是
			showLoadingMoreNoMoreLine: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//自定义底部没有更多数据的分割线样式
			loadingMoreNoMoreLineCustomStyle: {
				type: Object,
				default: function() {
					return {};
				},
			},
			//是否强制隐藏空数据图，默认为否
			hideEmptyView: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//控制是否出现滚动条，默认为否
			showScrollbar: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//在设置滚动条位置时使用动画过渡，默认为否
			scrollWithAnimation: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
			scrollIntoView: {
				type: String,
				default: function() {
					return '';
				},
			},
			//距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为50
			lowerThreshold: {
				type: Number,
				default: function() {
					return 50;
				},
			},
			//iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为否
			enableBackToTop: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//是否开启自定义下拉刷新，默认为是
			refresherEnabled: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//设置自定义下拉刷新阈值，默认为45
			refresherThreshold: {
				type: Number,
				default: function() {
					return 45;
				},
			},
			//设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
			refresherDefaultStyle: {
				type: String,
				default: function() {
					return "";
				}
			},
			//设置自定义下拉刷新区域背景颜色
			refresherBackground: {
				type: String,
				default: function() {
					return "#ffffff00";
				}
			},
			//是否允许touchmove事件冒泡，默认为否，禁止冒泡可避免一些情况下下拉刷新时页面其他元素跟着下移，若您使用横向滑动切换选项卡，则需要将此属性设置为true，否则无法横向滑动
			touchmovePropagationEnabled: {
				type: Boolean,
				default: function() {
					return false;
				}
			}
		},
		mounted() {
			if (this.mountedAutoCallReload) {
				this.reload();
			}
		},
		watch: {
			totalData(newVal, oldVal) {
				if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length && oldVal.length) {
					return;
				}
				newVal = [].concat(newVal);
				if (!this.usePageScroll && this.loadingStatus === 2 && this.hideLoadingMoreWhenNoMoreAndInsideOfPaging && newVal.length) {
					this.$nextTick(() => {
						this._checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal);
					})
				} else {
					this.showLoadingMore = newVal.length;
				}
				if(!this.usePageScroll && this.pageNo === this.defaultPageNo){
					this.$nextTick(() => {
						this._checkScrollViewOutOfPage();
					})
				}
				this.$emit('update:list', newVal);
				this.firstPageLoaded = false;
			},
			currentData(newVal, oldVal) {
				this._currentDataChange(newVal, oldVal);
			},
			loadingStatus(newVal, oldVal) {
				this.$emit('loadingStatusChange', newVal);
			},
			defaultThemeStyle: {
				handler(newVal) {
					if (newVal.length) {
						this.finalRefresherDefaultStyle = newVal;
					}
				},
				immediate: true
			},
			refresherDefaultStyle: {
				handler(newVal) {
					if (newVal.length) {
						this.finalRefresherDefaultStyle = newVal;
					}
				},
				immediate: true
			},
			refresherStatus(newVal, oldVal) {
				if (newVal === 0 && oldVal !== 0) {
					this.refresherLeftImageClass = 'custom-refresher-left-image custom-refresher-arrow-down';
				}
				if (newVal !== 0 && oldVal === 0) {
					this.refresherLeftImageClass = 'custom-refresher-left-image custom-refresher-arrow-top';
				}

				if (newVal !== oldVal) {
					this.$emit('refresherStatusChange', newVal);
					this.$emit('update:refresherStatus', newVal);
				}
			}
		},
		computed: {
			ownLoadingMoreText() {
				if (this.loadingMoreText.length) {
					return this.loadingMoreText;
				}
				return this.loadingStatusTextMap[this.loadingStatus];
			},
			pullDownDisTimeStamp() {
				return 1000 / this.refresherFps;
			}
		},
		methods: {
			//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
			addData(data, success = true) {
				var dataType = Object.prototype.toString.call(data);
				if (dataType === '[object Boolean]') {
					success = data;
					data = [];
				} else if (dataType !== '[object Array]') {
					data = [];
					console.error('[z-paging]:addData参数类型不正确，第一个参数类型必须为Array!');
				}
				if (this.refresherTriggered) {
					this.refresherTriggered = false;
				}
				this.loading = false;
				setTimeout(() => {
					this._refresherEnd();
				}, 200)
				if (success) {
					this.loadingStatus = 0;
					this._currentDataChange(data, this.currentData);
				} else {
					this.loadingStatus = 3;
					if (this.loadingType === 1) {
						this.pageNo--;
					}
				}
			},
			//重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
			reload(animate = false) {
				this.isUserReload = true;
				if (animate) {
					if (this.useCustomRefresher) {
						this._doRefresherRefreshAnimate();
					} else {
						this.refresherTriggered = true;
					}
				} else {
					this._refresherEnd();
				}
				this._reload();
			},
			//手动触发上拉加载更多(非必须，可依据具体需求使用)
			doLoadMore() {
				this._onLoadingMore('toBottom');
			},
			//手动停止下拉刷新加载
			endRefresh() {
				this.refresherTriggered = false;
			},
			//滚动到顶部
			scrollToTop() {
				this._scrollToTop();
			},
			//当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
			updatePageScrollTop(value){
				if(!value){
					//console.error('[z-paging]updatePageScrollTop方法缺少参数，请将页面onPageScroll事件中的scrollTop传递给此方法');
					return;
				}
				this.pageScrollTop = value;
			},
			//私有的重新加载分页数据方法
			_reload() {
				this.pageNo = this.defaultPageNo;
				this._startLoading();
				this.$emit('query', this.pageNo, this.defaultPageSize);
				this.firstPageLoaded = true;
				this.totalData = [];
				if(this.autoScrollToTopWhenReload){
					this._scrollToTop();
				}
			},
			//当前数据改变时调用
			_currentDataChange(newVal, oldVal) {
				newVal = [].concat(newVal);
				if (this.pageNo === this.defaultPageNo) {
					this.totalData = [];
				}
				if (
					!newVal.length ||
					(newVal.length && newVal.length < this.defaultPageSize)
				) {
					this.loadingStatus = 2;
				}
				if (!this.totalData.length) {
					this.totalData = newVal;
				} else {
					this.totalData = this.totalData.concat(newVal);
				}
			},
			//触发加载更多时调用,from:0-滑动到底部触发；1-点击加载更多触发
			_onLoadingMore(from) {
				this.$emit('scrolltolower',from);
				if (from === 'toBottom' && !this.toBottomLoadingMoreEnabled) {
					return;
				}
				if (!this.loadingMoreEnabled || !(this.loadingStatus === 0 || 3)) return;
				this._doLoadingMore();
			},
			_scrollToTop() {
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			//处理开始加载更多状态
			_startLoading() {
				this.loadingStatus = 1;
				this.loading = true;
			},
			//处理开始加载更多
			_doLoadingMore() {
				if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== 2) {
					this.pageNo++;
					this._startLoading();
					this.$emit('query', this.pageNo, this.defaultPageSize);
					this.loadingType = 1;
				}
			},
			_scroll(e) {
				this.$emit('scroll', e);
				this.oldScrollTop = e.detail.scrollTop;
			},
			//自定义下拉刷新被触发
			_onRefresh() {
				if (this.loading) {
					return;
				}
				this.isUserReload = false;
				this._startLoading();
				this.refresherTriggered = true;
				this._reload();
				this.$emit('onRefresh');
				this.loadingType = 0;
			},
			//自定义下拉刷新被复位
			_onRestore() {
				this.refresherTriggered = 'restore';
				this.$emit('onRestore');
			},
			//获取主题样式的class
			_getThemeStyleClass(cls) {
				if (this.defaultThemeStyle === 'black') {
					return `${cls} ${cls}-black`;
				}
				if (this.defaultThemeStyle === 'white') {
					return `${cls} ${cls}-white`;
				}
				return cls;
			},
			// 拖拽开始
			_refresherTouchstart(e) {
				if (this._getRefresherTouchDisabled()) {
					return;
				}
				this.isTouchmoving = false;
				this.refresherTransition = 'transform .1s linear';
				this.refresherTouchstartY = e.touches[0].clientY;
				this.$emit('refresherTouchstart', this.refresherTouchstartY);
			},
			//拖拽中
			_refresherTouchmove(e) {
				const currentTimeStamp = (new Date()).getTime();
				if (this.pullDownTimeStamp && currentTimeStamp - this.pullDownTimeStamp <= this.pullDownDisTimeStamp) {
					return;
				}
				if (this._getRefresherTouchDisabled()) {
					return;
				}
				this.pullDownTimeStamp = currentTimeStamp;
				let refresherTouchmoveY = e.touches[0].clientY;
				let moveDistance = refresherTouchmoveY - this.refresherTouchstartY;
				if (moveDistance < 0) {
					return;
				}
				if(!this.isTouchmoving){
					this.isTouchmoving = true;
				}
				moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
				if (moveDistance >= this.refresherThreshold) {
					this.refresherStatus = 1;
				} else {
					this.refresherStatus = 0;
				}
				this.scrollEnable = false;
				this.refresherTransform = `translateY(${moveDistance}px)`;
				this.$emit('refresherTouchmove', moveDistance);
			},
			//拖拽结束
			_refresherTouchend(e) {
				if (this._getRefresherTouchDisabled()) {
					return;
				}
				let refresherTouchendY = e.changedTouches[0].clientY;
				let moveDistance = refresherTouchendY - this.refresherTouchstartY;
				moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
				if(moveDistance > 0 && this.usePageScroll && this.useCustomRefresher && this.pageScrollTop === -1){
					console.error('[z-paging]usePageScroll为true并且自定义下拉刷新时必须在page滚动时通过调用z-paging组件的updatePageScrollTop方法设置当前的scrollTop')
				}
				if (moveDistance >= this.refresherThreshold && this.refresherStatus === 1) {
					this.refresherTransform = `translateY(${this.refresherThreshold}px)`
					this.refresherStatus = 2;
					this._doRefresherLoad();
				} else {
					this._refresherEnd();
					setTimeout(() => {
						this.isTouchmoving = false;
					}, 100);
				}
				this.$emit('refresherTouchend', moveDistance);
			},
			//下拉刷新结束
			_refresherEnd() {
				this.refresherTransform = 'translateY(0px)';
				if (this.refresherEndBounceEnabled) {
					this.refresherTransition = 'transform 0.3s cubic-bezier(0.19,1.64,0.42,0.72)';
				}
				setTimeout(() => {
					this.refresherStatus = 0;
				}, 100);
				this.loading = false;
				this.scrollEnable = true;
				this.$emit('onRestore');
			},
			//模拟用户手动触发下拉刷新
			_doRefresherRefreshAnimate() {
				this.refresherTransform = `translateY(${this.refresherThreshold}px)`;
				this.refresherStatus = 2;
			},
			//触发下拉刷新
			_doRefresherLoad() {
				this._onRefresh();
				this.loading = true;
			},
			//获取处理后的moveDistance
			_getFinalRefresherMoveDistance(moveDistance) {
				moveDistance = moveDistance * 0.7;
				if (moveDistance >= this.refresherThreshold) {
					moveDistance = this.refresherThreshold + (moveDistance - this.refresherThreshold) * 0.3;
				}
				return moveDistance;
			},
			//判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
			async _checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData) {
				try {
					let pagingContainerH = 0;
					let scrollViewH = 0;
					const pagingContainerNode = await this._getNodeClientRect('.paging-container-content');
					const scrollViewNode = await this._getNodeClientRect('.scroll-view');
					if (pagingContainerNode != '' && pagingContainerNode != undefined && pagingContainerNode.length) {
						pagingContainerH = pagingContainerNode[0].height;
					}
					if (scrollViewNode != '' && scrollViewNode != undefined && scrollViewNode.length) {
						scrollViewH = scrollViewNode[0].height;
					}
					this.showLoadingMore = pagingContainerH >= scrollViewH;
				} catch (e) {
					this.showLoadingMore = totalData.length;
				}
			},
			//检测z-paging是否超出了页面高度
			async _checkScrollViewOutOfPage(){
				try{
					const scrollViewNode = await this._getNodeClientRect('.scroll-view');
					const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
					if(scrollViewTotalH > windowHeight + 200){
						console.error('[z-paging]检测到z-paging的高度超出页面高度，这将导致滚动出现异常，请确保z-paging有确定的高度！！');
					}
				}catch(e){
					
				}
			},
			//获取节点尺寸
			_getNodeClientRect(select) {
				let res = null;
				res = uni.createSelectorQuery().in(this);
				//#ifdef MP-ALIPAY
				res = uni.createSelectorQuery();
				//#endif
				res.select(select).boundingClientRect();
				return new Promise((resolve, reject) => {
					res.exec(data => {
						resolve(data);
					});
				});

			},
			//判断touch手势是否要触发
			_getRefresherTouchDisabled(){
				return !this.refresherEnabled || !this.useCustomRefresher || (this.usePageScroll && this.useCustomRefresher && this.pageScrollTop > 10) || (!(this.usePageScroll && this.useCustomRefresher) && this.scrollTop > 10);
			}
		},
	};
</script>

<style scoped>
	.z-paging-content,
	.scroll-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
	}

	.paging-main {
		height: 100%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.paging-container {
		flex: 1;
	}

	.custom-refresher-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.custom-refresher-left-image {
		width: 30rpx;
		height: 30rpx;
		margin-top: 10rpx;
		margin-right: 8rpx;
	}

	.custom-refresher-arrow-top {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-top 0.25s linear;
		-webkitanimation: refresher-arrow-top 0.25s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */

	}

	.custom-refresher-arrow-down {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-down 0.25s linear;
		-webkit-animation: refresher-arrow-down 0.25s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */

	}

	.custom-refresher-right {
		font-size: 24rpx;
	}

	.custom-refresher-right-black {
		color: #666666;
	}

	.custom-refresher-right-white {
		color: #efefef;
	}

	.load-more-container {
		height: 80rpx;
		font-size: 25rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.loading-more-line-loading-image {
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		/* #ifndef APP-NVUE */
		animation: loading-flower 1s steps(12) infinite;
		/* #endif */

	}

	.loading-more-line-loading-custom-image {
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */

	}

	.loading-more-line-loading-view {
		margin-right: 8rpx;
		width: 22rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */

	}

	.loading-more-line-loading-view-black {
		border-color: #c8c8c8;
		border-top-color: #444444;
	}

	.loading-more-line-loading-view-white {
		border-color: #aaaaaa;
		border-top-color: #ffffff;
	}

	.loading-more-text-black {
		color: #a4a4a4;
	}

	.loading-more-text-white {
		color: #efefef;
	}

	.loading-more-line {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}

	.loading-more-line-black {
		background-color: #eeeeee;
	}

	.loading-more-line-white {
		background-color: #cccccc;
	}

	@keyframes loading-flower {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn);
		}
	}

	@keyframes loading-circle {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@keyframes refresher-arrow-top {
		0% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		}

		100% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
	}

	@keyframes refresher-arrow-down {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		}
	}
</style>
