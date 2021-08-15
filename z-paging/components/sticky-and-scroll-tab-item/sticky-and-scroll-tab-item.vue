<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<z-paging @scroll="scroll" :scrollable="scrollable" :show-console-error="false" :scroll-to-top-bounce-enabled="false" :auto-clean-list-when-reload="false"
			:refresher-enabled="false" :fixed="false" ref="paging" @query="queryList" v-model="dataList"
			:mounted-auto-call-reload="false" style="height: 100%;">
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
	export default {
		data() {
			return {
				dataList: [],
				firstLoaded: false,
				height: 0,
				scrollable: true,
				completeFunc: null,
				scrollCallback: null
			}
		},
		props: {
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			currentIndex: {
				type: Number,
				default: function() {
					return 0
				}
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							// #ifdef MP-TOUTIAO
							setTimeout(() => {
								this.$refs.paging.reload();
							}, 10)
							// #endif
							// #ifndef MP-TOUTIAO
							this.$nextTick(() => {
								this.$refs.paging.reload();
							})
							// #endif
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const param = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(param, (data) => {
					this.$refs.paging.complete(data);
					this.firstLoaded = true;
					if(this.completeFunc){
						this.completeFunc();
					}
				})
			},
			scroll(e){
				if(this.scrollCallback){
					this.scrollCallback(e.detail.scrollTop);
				}
			},
			reload(completeFunc) {
				this.completeFunc = completeFunc;
				this.$refs.paging.reload();
			},
			itemClick(item) {
				console.log('点击了', item.title);
			},
			updateScrollEnable(scrollable) {
				this.scrollable = scrollable;
			},
			setScrollCallback(callback){
				this.scrollCallback = callback;
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */
	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
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
