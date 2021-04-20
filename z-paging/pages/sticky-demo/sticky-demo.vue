<!-- 滚动吸附效果演示 -->
<template>
	<view class="content">
		<!-- 此处为了让reload时不自动滚动到顶部，需要设置auto-clean-list-when-reload和auto-scroll-to-top-when-reload为false，即在reload时关闭自动清空数组和自动滚动到顶部 -->
		<z-paging ref="paging" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false"
		 :refresher-threshold="80" :refresher-status.sync="refresherStatus" @query="queryList"
		 :list.sync="dataList" style="height: 100%;">
			<view class="banner-view" style="height: 250rpx;">
				<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
				<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
			</view>
			<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
			<view style="z-index: 100;position: sticky;top :0;">
				<tabs-view @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
			</view>
			<!-- 自定义下拉刷新view -->
			<!-- 注意注意注意！！如果您的项目不是QQ小程序或字节跳动小程序，:status="refresherStatus有更简化的写法，请参阅custom-demo.vue -->
			
			<custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher>
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
				tabIndex: 0,
				refresherStatus: 0
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				//当切换tab时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
					this.$refs.paging.addData(data);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */

	/*如果有scoped，page的css设置建议放在App.vue中 */
	page {
		height: 100%;
	}

	.content {
		height: 100%;
		/* 父节点建议开启flex布局 */
		display: flex;
		flex-direction: column;
	}

	.banner-view {
		background-color: #007AFF;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
