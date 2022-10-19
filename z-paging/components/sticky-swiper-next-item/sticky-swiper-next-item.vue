<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<z-paging ref="paging" v-model="dataList" @query="queryList" use-page-scroll :hide-empty-view="hideEmptyView"
			:refresher-enabled="false" @contentHeightChanged="contentHeightChanged" :auto="false" :auto-clean-list-when-reload="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				height: 0,
				hideEmptyView: true,
				completeFunc: null
			}
		},
		props: {
			//当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
			//当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function(){
					return 0
				}
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						setTimeout(() => {
							this.$refs.paging.reload();
						}, 100);
					}
				},
				immediate: true
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(params).then(res => {
					this.$refs.paging.complete(res.data.list);
					this.hideEmptyView = false;
					//请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
					if (this.completeFunc) {
						this.completeFunc();
					}
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
					//请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
					if (this.completeFunc) {
						this.completeFunc();
					}
				})
			},
			//页面通知当前子组件刷新列表
			reload(completeFunc) {
				//先把父组件下拉刷新的回调函数存起来
				this.completeFunc = completeFunc;
				//调用z-paging的reload方法
				this.$refs.paging.reload();
			},
			//当列表高度改变时，通知页面的swiper同步更改高度
			contentHeightChanged(height){
				const finalHeight = this.dataList.length ? height : 0;
				//限制内容最小高度为屏幕可见高度减z-tabs高度。注意，页面中有使用slot="top"插入的view，则此处的minHeight还应该减去slot="top"插入的view的高度
				const minHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(80);
				this.$emit('heightChanged',Math.max(finalHeight, minHeight));
			},
			//页面通知当前子组件加载更多数据
			doLoadMore(){
				this.$refs.paging.doLoadMore();
			},
			//页面通知当前子组件清除数据
			clear(){
				this.$refs.paging.clear();
				this.hideEmptyView = true;
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */
	.content {
		height: 100%;
	}

	.item {
		position: relative;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>
