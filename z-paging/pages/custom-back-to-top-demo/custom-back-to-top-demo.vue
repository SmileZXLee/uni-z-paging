<!-- 自定义返回顶部view演示(vue) -->
<template>
	<view class="content">
		<z-paging @scroll="scroll" ref="paging" v-model="dataList" auto-show-back-to-top @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<tabs-view slot="top" @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
			<!-- 自定义返回顶部view -->
			<custom-back-to-top slot="backToTop" ref="backToTop" :current="current" :total="total"></custom-back-to-top>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view class="list">
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
				tabIndex: 0,
				current: 0,
				total: 0
			}
		},
		methods: {
			scroll() {
				if (this.$refs.backToTop) {
					this.$refs.backToTop.isScroll();
				}
			},
			tabChange(index) {
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				//调用reload时参数传true则代表reload时触发下拉刷新效果，不传或false则代表取消此效果
				this.$refs.paging.reload(true);
			},
			queryList(pageNo, pageSize) {
				this.current = pageNo;
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				this.$request.queryListLong({pageNo, pageSize, type:this.tabIndex + 1}, (data) => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(data);
					// demo这里是写死的总页数，一般这时候服务端会返回一共有多页或一共有多少跳
					this.total = 23;
					//如果请求失败写 this.$refs.paging.complete(false);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
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
