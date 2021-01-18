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
}
3.如果要重新加载分页数据(如下拉刷新):
在js中调用
```js
this.$refs.paging.reload();
```
注意：在Page的onLoad()方法中无法同步获取this.$refs，请加一个setTimeOut再获取
```js
setTimeout(()=>{
	this.$refs.paging.reload();
},1)
```
4.注意事项：
因分页组件是通过@scrolltolower来判断滚动到底部的，因此z-paging需要有固定的高度，才可以触发滚动到底部事件，
若未确定其高度而是根据具体内容将其撑高，则它永远滚动不到底部，因为它不存在[底部]的概念，因为它会无限[长高]

 -->
<template name="z-paging">
	<scroll-view scroll-y="true" class="scroll-view" :enable-back-to-top="enableBackToTop" :show-scrollbar="showScrollbar"
	 :refresher-enabled="refresherEnabled" :refresher-threshold="refresherThreshold" :refresher-triggered="refresherTriggered"
	 @scrolltolower="_onLoadingMore('toBottom')" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh">
		<slot v-if="$slots.empty&&!totalData.length&&!hideEmptyView&&!firstPageLoaded&&!loading" name="empty" />
		<slot />
		<slot @click="_onLoadingMore('click')" v-if="loadingStatus==0&&$slots.loadingMoreDefault&&showLoadingMore" name="loadingMoreDefault" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus==1&&$slots.loadingMoreLoading&&showLoadingMore" name="loadingMoreLoading" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus==2&&$slots.loadingMoreNoMore&&showLoadingMore" name="loadingMoreNoMore" />
		<slot @click="_onLoadingMore('click')" v-else-if="loadingStatus==3&&$slots.loadingMoreFail&&showLoadingMore" name="loadingMoreFail" />
		<view @click="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText" class="load-more-text">{{ownLoadingMoreText}}</view>
	</scroll-view>
</template>

<script>
	/**
	 * z-paging 分页组件
	 * @description uni-app使用少量的代码轻松完成完整分页逻辑
	 * @tutorial https://github.com/SmileZXLee/uni-z-paging
	 * @property {Number} default-page-no 自定义pageNo，默认为1
	 * @property {Number} default-page-size 自定义pageSize，默认为15
	 * @property {String} loading-more-text 自定义底部加载更多文字
	 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
	 * @property {Boolean} to-bottom-loading-more-enabled 是否启用滑动到底部加载更多数据
	 * @property {String} loading-more-default-text 滑动到底部"默认"文字，默认为【点击加载更多】
	 * @property {String} loading-more-loading-text 滑动到底部"加载中"文字，默认为【加载中...】
	 * @property {String} loading-more-no-more-text 滑动到底部"没有更多"文字，默认为【没有更多了】
	 * @property {String} loading-more-fail-text 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
	 * @property {String} show-default-loading-moretext 是否显示默认的加载更多text，默认为是
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {Boolean} show-scrollbar 控制是否出现滚动条
	 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
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
				//底部加载更多文字状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
				loadingStatus: 0,
				//底部加载更多文字Map
				loadingStatusTextMap: {
					0: this.loadingMoreDefaultText,
					1: this.loadingMoreLoadingText,
					2: this.loadingMoreNoMoreText,
					3: this.loadingMoreFailText,
				},
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
			//自定义底部加载更多文字
			loadingMoreText: {
				type: String,
				default: function() {
					return "";
				},
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
			//滑动到底部"加载中"文字，默认为【加载中...】
			loadingMoreLoadingText: {
				type: String,
				default: function() {
					return "加载中...";
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
			//是否强制隐藏空数据图，默认为否
			hideEmptyView: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//控制是否出现滚动条
			showScrollbar: {
				type: Boolean,
				default: function() {
					return false;
				},
			},
			//iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向
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
					return "black";
				},
			},
		},
		watch: {
			totalData(newVal, oldVal) {
				if (this.firstPageLoaded && !newVal.length && oldVal.length) {
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
		},
		computed: {
			ownLoadingMoreText() {
				if (this.loadingMoreText.length) {
					return this.loadingMoreText;
				}
				return this.loadingStatusTextMap[this.loadingStatus];
			},
		},
		methods: {
			//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
			addData(data, success = true) {
				if (this.refresherTriggered) {
					this.refresherTriggered = false;
				}
				this.loading = false;
				if (success) {
					this.loadingStatus = 0;
				} else {
					this.loadingStatus = 3;
				}
				this._currentDataChange(data, this.currentData);
			},
			//重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果
			reload() {
				this.pageNo = this.defaultPageNo;
				this._startLoading();
				this.$emit("loadingMore", {
					pageNo: this.pageNo,
					pageSize: this.defaultPageSize,
				});
				this.$emit("query", this.pageNo, this.defaultPageSize);
				this.firstPageLoaded = true;
				this.totalData = [];
			},
			//手动停止下拉刷新加载
			endRefresh() {
				this.refresherTriggered = false;
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
					this.pageNo = -1;
				}
				if (!this.totalData.length) {
					this.totalData = newVal;
				} else {
					this.totalData = this.totalData.concat(newVal);
				}
			},
			//触发加载更多时调用,from:0-滑动到底部触发；1-点击加载更多触发
			_onLoadingMore(from) {
				if (from == "toBottom" && !this.toBottomLoadingMoreEnabled) {
					return;
				}
				if (!this.loadingMoreEnabled || !(this.loadingStatus == 0 || 3)) return;
				this._doLoadingMore();
			},
			//处理开始加载更多状态
			_startLoading() {
				this.loadingStatus = 1;
				this.loading = true;
			},
			//处理开始加载更多
			_doLoadingMore() {
				if (this.pageNo != -1) {
					this.pageNo++;
					this._startLoading();
					this.$emit("loadingMore", {
						pageNo: this.pageNo,
						pageSize: this.defaultPageSize,
					});
					this.$emit("query", this.pageNo, this.defaultPageSize);
				}
			},
			//自定义下拉刷新被触发
			_onRefresh() {
				if (this.loading) {
					return;
				}
				this._startLoading();
				this.refresherTriggered = true;
				this.reload();
				this.$emit("onRefresh");
			},
			//自定义下拉刷新被复位
			_onRestore() {
				this.refresherTriggered = "restore";
				this.$emit("onRestore");
			},
		},
	};
</script>

<style scoped>
	.scroll-view {
		width: 100%;
		height: 100%;
	}

	.load-more-text {
		text-align: center;
		color: darkgray;
		height: 40px;
		line-height: 40px;
		font-size: 25rpx;
	}
</style>
