<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->

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
注意：如果需要在在Page的onLoad()方法中使用（默认自动会调用），请加一个setTimeOut再调用
```js
setTimeout(()=>{
	this.$refs.paging.reload();
},1)
```
4.注意事项：
因分页组件是通过@scrolltolower来判断滚动到底部的，因此z-paging需要有固定的高度，才可以触发滚动到底部事件，
若未确定其高度而是根据具体内容将其撑高，则它永远滚动不到底部，因为它不存在[底部]的概念，因为它会无限[长高]

 -->
<template name="z-paging" style="height: 100%;">
	<scroll-view scroll-y="true" :scroll-top="scrollTop" class="scroll-view" :enable-back-to-top="enableBackToTop"
	 :show-scrollbar="showScrollbar" :lower-threshold="lowerThreshold" :refresher-enabled="refresherEnabled"
	 :refresher-threshold="refresherThreshold" :refresher-default-style="finalRefresherDefaultStyle" :refresher-triggered="refresherTriggered"
	 @scroll="_scroll" @scrolltolower="_onLoadingMore('toBottom')" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh">
		<slot v-if="$slots.empty&&!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading" name="empty" />
		<!-- 如果需要修改组件源码来统一设置全局的emptyView，可以把此处的“empty-view”换成自定义的组件名即可
		<empty-view v-else-if="!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading"></empty-view> -->
		<slot />
		<slot @click="_onLoadingMore('click')" v-if="loadingStatus===0&&$slots.loadingMoreDefault&&showLoadingMore" name="loadingMoreDefault" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===1&&$slots.loadingMoreLoading&&showLoadingMore" name="loadingMoreLoading" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===2&&$slots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView" name="loadingMoreNoMore" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus===3&&$slots.loadingMoreFail&&showLoadingMore" name="loadingMoreFail" />
		<view @click="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)" class="load-more-container"
		 :style="[loadingMoreCustomStyle]">
			<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
			 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
			<image v-if="loadingStatus===1&&loadingMoreLoadingIconCustomImage.length" :src="loadingMoreLoadingIconCustomImage" class="loading-more-line-loading-custom-image"></image>
			<image v-if="loadingStatus===1&&loadingMoreLoadingIconType==='flower'&&!loadingMoreLoadingIconCustomImage.length" class="loading-more-line-loading-image" :style="[loadingMoreLoadingIconCustomStyle]" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYyNC42NjMgNzg1LjEzOWMtMTAuNzM1LTE4LjU5NS00LjMxNi00Mi4zOTcgMTQuMzM3LTUzLjE2OCAxOC42NTMtMTAuNzcgNDIuNDc5LTQuNDI3IDUzLjIxMyAxNC4xNjhsOTAuMTIzIDE1Ni4wOTljMTAuNzM2IDE4LjU5NSA0LjMxNyA0Mi4zOTgtMTQuMzM2IDUzLjE2OS0xOC42NTMgMTAuNzctNDIuNDc5IDQuNDI2LTUzLjIxNC0xNC4xNjlsLTkwLjEyMy0xNTYuMDk5eiIgZmlsbD0iI2NkY2RjZCIgLz48cGF0aCBkPSJNMjQxLjY2NCAxMjEuNzY0Yy0xMC43MzUtMTguNTk0LTQuMzE3LTQyLjM5OCAxNC4zMzYtNTMuMTY5IDE4LjY1My0xMC43NyA0Mi40NzktNC40MjYgNTMuMjE0IDE0LjE2OGw5MC4xMjQgMTU2LjA5OWMxMC43MzUgMTguNTk0IDQuMzE2IDQyLjM5OC0xNC4zMzcgNTMuMTY4LTE4LjY1MyAxMC43Ny00Mi40NzggNC40MjYtNTMuMjEzLTE0LjE2OGwtOTAuMTI0LTE1Ni4wOTh6IiBmaWxsPSIjYTlhOWE5IiAvPjxwYXRoIGQ9Ik0yMzguODYxIDYyNC42NjNjMTguNTk0LTEwLjczNSA0Mi4zOTgtNC4zMTYgNTMuMTY4IDE0LjMzNyAxMC43NyAxOC42NTMgNC40MjYgNDIuNDc5LTE0LjE2OCA1My4yMTNsLTE1Ni4wOTggOTAuMTI0Yy0xOC41OTQgMTAuNzM1LTQyLjM5OSA0LjMxNi01My4xNjgtMTQuMzM3LTEwLjc3LTE4LjY1My00LjQyNi00Mi40NzkgMTQuMTY4LTUzLjIxM2wxNTYuMDk4LTkwLjEyNHoiIGZpbGw9IiNiYmJiYmIiIC8+PHBhdGggZD0iTTkwMi4yMzYgMjQxLjY2NGMxOC41OTQtMTAuNzM2IDQyLjM5OC00LjMxNyA1My4xNjkgMTQuMzM2IDEwLjc3IDE4LjY1NCA0LjQyNiA0Mi40NzktMTQuMTY5IDUzLjIxNGwtMTU2LjA5OSA5MC4xMjNjLTE4LjU5NCAxMC43MzUtNDIuMzk3IDQuMzE2LTUzLjE2OC0xNC4zMzctMTAuNzctMTguNjU0LTQuNDI2LTQyLjQ3OSAxNC4xNjgtNTMuMjEzbDE1Ni4wOTktOTAuMTIzeiIgZmlsbD0iIzk5OTk5OSIgLz48cGF0aCBkPSJNMzMxLjc4NyA3NDYuMTM5YzEwLjczNC0xOC41OTUgMzQuNTYtMjQuOTM4IDUzLjIxMy0xNC4xNjggMTguNjUzIDEwLjc3MSAyNS4wNzIgMzQuNTczIDE0LjMzNiA1My4xNjhsLTkwLjEyMyAxNTYuMDk5Yy0xMC43MzQgMTguNTk1LTM0LjU2IDI0LjkzOC01My4yMTMgMTQuMTY5LTE4LjY1My0xMC43NzEtMjUuMDcyLTM0LjU3NC0xNC4zMzYtNTMuMTY5bDkwLjEyMy0xNTYuMDk5eiIgZmlsbD0iI2MyYzJjMiIgLz48cGF0aCBkPSJNNzE0Ljc4NiA4Mi43NjRjMTAuNzM1LTE4LjU5NCAzNC41NjEtMjQuOTM4IDUzLjIxNC0xNC4xNjkgMTguNjUzIDEwLjc3MSAyNS4wNzIgMzQuNTc1IDE0LjMzNyA1My4xNjhsLTkwLjEyMyAxNTYuMDk5Yy0xMC43MzUgMTguNTk0LTM0LjU2MSAyNC45MzgtNTMuMjE0IDE0LjE2OC0xOC42NTMtMTAuNzcxLTI1LjA3Mi0zNC41NzQtMTQuMzM3LTUzLjE2OGw5MC4xMjMtMTU2LjA5OHoiIGZpbGw9IiM5ZDlkOWQiIC8+PHBhdGggZD0iTTI3Ny44NjEgMzMxLjc4N2MxOC41OTQgMTAuNzM1IDI0LjkzOCAzNC41NiAxNC4xNjggNTMuMjEzcy0zNC41NzQgMjUuMDcyLTUzLjE2OCAxNC4zMzZMODIuNzYzIDMwOS4yMTNDNjQuMTY5IDI5OC40NzggNTcuODI1IDI3NC42NTMgNjguNTk1IDI1NmMxMC43NzEtMTguNjUzIDM0LjU3NC0yNS4wNzIgNTMuMTY4LTE0LjMzNmwxNTYuMDk4IDkwLjEyM3oiIGZpbGw9IiNhZmFmYWYiIC8+PHBhdGggZD0iTTk0MS4yMzYgNzE0Ljc4NmMxOC41OTUgMTAuNzM0IDI0LjkzOCAzNC41NjEgMTQuMTY5IDUzLjIxNC0xMC43NzEgMTguNjUzLTM0LjU3NCAyNS4wNzItNTMuMTY5IDE0LjMzN2wtMTU2LjA5OS05MC4xMjNDNzI3LjU0NCA2ODEuNDc5IDcyMS4yIDY1Ny42NTMgNzMxLjk3IDYzOWMxMC43NzEtMTguNjUzIDM0LjU3NC0yNS4wNzIgNTMuMTY4LTE0LjMzN2wxNTYuMDk4IDkwLjEyM3oiIGZpbGw9IiNkMWQxZDEiIC8+PHBhdGggZD0iTTIxOS4xMjMgNDczYzIxLjQ3MSAwIDM4Ljg3NyAxNy40NjEgMzguODc3IDM5cy0xNy40MDYgMzktMzguODc3IDM5SDM4Ljg3N0MxNy40MDYgNTUxIDAgNTMzLjUzOSAwIDUxMnMxNy40MDYtMzkgMzguODc3LTM5aDE4MC4yNDZ6IiBmaWxsPSIjYjZiNmI2IiAvPjxwYXRoIGQ9Ik05ODUuMTIzIDQ3M2MyMS40NzEgMCAzOC44NzcgMTcuNDYxIDM4Ljg3NyAzOXMtMTcuNDA2IDM5LTM4Ljg3NyAzOUg4MDQuODc3Yy0yMS40NzEgMC0zOC44NzctMTcuNDYxLTM4Ljg3Ny0zOXMxNy40MDYtMzkgMzguODc3LTM5aDE4MC4yNDZ6IiBmaWxsPSIjOTQ5NDk0IiAvPjxwYXRoIGQ9Ik01NTEgMjE5LjEyM2MwIDIxLjQ3MS0xNy40NjEgMzguODc3LTM5IDM4Ljg3N3MtMzktMTcuNDA2LTM5LTM4Ljg3N1YzOC44NzdjMC0yMS40NzEgMTcuNDYxLTM4Ljg3NyAzOS0zOC44NzdzMzkgMTcuNDA2IDM5IDM4Ljg3N3YxODAuMjQ2eiIgZmlsbD0iI2EzYTNhMyIgLz48cGF0aCBkPSJNNTUxIDk4NS4xMjNjMCAyMS40NzEtMTcuNDYxIDM4Ljg3Ny0zOSAzOC44NzdzLTM5LTE3LjQwNi0zOS0zOC44NzdWODA0Ljg3N2MwLTIxLjQ3MSAxNy40NjEtMzguODc3IDM5LTM4Ljg3N3MzOSAxNy40MDYgMzkgMzguODc3djE4MC4yNDZ6IiBmaWxsPSIjYzhjOGM4IiAvPjwvc3ZnPg=="></image>
			<text v-if="loadingStatus===1&&loadingMoreLoadingIconType==='circle'&&!loadingMoreLoadingIconCustomImage.length" :class="defaultThemeStyle==='white'?'loading-more-line-loading-view loading-more-line-loading-view-white':'loading-more-line-loading-view loading-more-line-loading-view-black'"
			 :style="[loadingMoreLoadingIconCustomStyle]"></text>
			<text :class="defaultThemeStyle==='white'?'loading-more-text loading-more-text-white':'loading-more-text loading-more-text-black'">{{ownLoadingMoreText}}</text>
			<text :class="defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
			 :style="[loadingMoreNoMoreLineCustomStyle]" v-if="showLoadingMoreNoMoreLine&&loadingStatus===2"></text>
		</view>
	</scroll-view>
</template>

<script>
	/**
	 * z-paging 分页组件
	 * @description 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view等。
	 * @tutorial https://github.com/SmileZXLee/uni-z-paging
	 * @property {Number} default-page-no 自定义pageNo，默认为1
	 * @property {Number} default-page-size 自定义pageSize，默认为15
	 * @property {String} default-theme-style loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
	 * @property {Boolean} mounted-auto-call-reload z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} auto-clean-list-when-reload reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
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
	 * @property {Boolean} show-loading-more-no-more-view 是否显示没有更多数据的view，默认为是
	 * @property {Boolean} show-default-loading-more-text 是否显示默认的加载更多text，默认为是
	 * @property {Boolean} show-loading-more-no-more-line 是否显示没有更多数据的分割线，默认为是
	 * @property {Object} loading-more-no-more-line-custom-style 自定义底部没有更多数据的分割线样式
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {Boolean} show-scrollbar 控制是否出现滚动条，默认为否
	 * @property {Number} lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为50
	 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为否
	 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
	 * @property {Number} refresher-threshold 设置自定义下拉刷新阈值，默认为45
	 * @property {String} refresher-default-style 设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
	 * @event {Function} addData 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是)
	 * @event {Function} reload 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果
	 * @event {Function} endRefresh 手动停止下拉刷新加载
	 * @event {Function} loadingStatusChange 分页加载状态改变(0-默认状态 1.加载中 2.没有更多数据 3.加载失败)
	 * @event {Function} onRefresh 自定义下拉刷新被触发
	 * @event {Function} onRestore 自定义下拉刷新被复位
	 */
	export default {
		name: "z-paging",
		data() {
			return {
				currentData: [],
				totalData: [],
				pageNo: 1,
				showLoadingMore: false,
				refresherTriggered: false,
				loading: false,
				firstPageLoaded: false,
				isUserReload: true,
				scrollTop: 0,
				oldScrollTop: 0,
				//当前加载类型 0-下拉刷新 1-上拉加载更多
				loadingType: 0,
				//底部加载更多文字状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
				loadingStatus: 0,
				//底部加载更多文字Map
				loadingStatusTextMap: {
					0: this.loadingMoreDefaultText,
					1: this.loadingMoreLoadingText,
					2: this.loadingMoreNoMoreText,
					3: this.loadingMoreFailText,
				},
				finalRefresherDefaultStyle: 'black'
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
			//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
			mountedAutoCallReload: {
				type: Boolean,
				default: function() {
					return true;
				},
			},
			//reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
			autoCleanListWhenReload: {
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
			//自定义底部加载更多加载中动画图标类型，可选circle或flower，默认为circle
			loadingMoreLoadingIconType: {
				type: String,
				default () {
					return 'circle';
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
				type: [Number, String],
				default: function() {
					return 45;
				},
			},
			//设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
			refresherDefaultStyle: {
				type: String,
				default: function() {
					return "";
				}
			},
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
				this.showLoadingMore = newVal.length;
				this.$emit("update:list", newVal);
				this.firstPageLoaded = false;
			},
			currentData(newVal, oldVal) {
				this._currentDataChange(newVal, oldVal);
			},
			loadingStatus(newVal, oldVal) {
				this.$emit("loadingStatusChange", newVal);
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
			}
		},
		computed: {
			ownLoadingMoreText() {
				if (this.loadingMoreText.length) {
					return this.loadingMoreText;
				}
				return this.loadingStatusTextMap[this.loadingStatus];
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
					console.error('addData参数类型不正确，第一个参数类型必须为Array!');
				}
				if (this.refresherTriggered) {
					this.refresherTriggered = false;
				}
				this.loading = false;
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
			//重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果
			reload() {
				this.isUserReload = true;
				this._reload();
			},
			doLoadMore(){
				this._onLoadingMore('toBottom');
			},
			//手动停止下拉刷新加载
			endRefresh() {
				this.refresherTriggered = false;
			},
			//私有的重新加载分页数据方法
			_reload() {
				this.pageNo = this.defaultPageNo;
				this._startLoading();
				this.$emit("query", this.pageNo, this.defaultPageSize);
				this.firstPageLoaded = true;
				this.totalData = [];
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			//当前数据改变时调用
			_currentDataChange(newVal, oldVal) {
				newVal = [].concat(newVal);
				if (!this.loadingMoreEnabled) return;
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
				if (from === 'toBottom' && !this.toBottomLoadingMoreEnabled) {
					return;
				}
				if (!this.loadingMoreEnabled || !(this.loadingStatus === 0 || 3)) return;
				this._doLoadingMore();
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
					this.$emit("query", this.pageNo, this.defaultPageSize);
					this.loadingType = 1;
				}
			},
			_scroll(e) {
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
				this.$emit("onRefresh");
				this.loadingType = 0;
			},
			//自定义下拉刷新被复位
			_onRestore() {
				this.refresherTriggered = "restore";
				this.$emit("onRestore");
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
			}
		},
	};
</script>

<style scoped>
	.scroll-view {
		width: 100%;
		height: 100%;
	}

	.load-more-container {
		height: 80rpx;
		font-size: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-more-line-loading-image {
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		animation: loading-flower 1s steps(12) infinite;
	}
	
	.loading-more-line-loading-custom-image{
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		animation: loading-circle 1s linear infinite;
	}

	.loading-more-line-loading-view {
		margin-right: 8rpx;
		width: 22rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		animation: loading-circle 1s linear infinite;
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
		color: #f1f1f1;
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
</style>
