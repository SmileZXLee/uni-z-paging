<!-- 下拉进入二楼演示(vue) -->
<template>
	<view class="content">
		<!-- 下楼进入二楼建议在pages.json中隐藏系统导航栏，使用自定义导航栏，避免二楼被系统导航栏盖住 -->
		<z-paging ref="paging" v-model="dataList" refresher-f2-enabled @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<u-navbar title="下拉进入二楼演示" title-color="black" title-bold></u-navbar>
				<z-tabs :list="tabList" @change="tabsChange" />
			</template>
			<!-- 自定义松手显示二楼view（非必须，可根据具体需求定制） -->
			<template #refresherF2>
				<view class="refresher-f2-view">
					<text class="refresher-f2-view-text">松手可以进入二楼哦 (*╹▽╹*)</text>
				</view>
			</template>
			<!-- 自定义需要插入二楼的view，建议将插入二楼的view设置高度100%以铺满容器高度 -->
			<template #f2>
				<custom-f2 @closeF2="onCloseF2"/>
			</template>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item,index)">
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
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabList: ['测试1','测试2','测试3','测试4'],
				tabIndex: 0,
			}
		},
		methods: {
			tabsChange(index) {
				this.tabIndex = index;
				// 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			// 点击了关闭二楼
			onCloseF2() {
				this.$refs.paging.closeF2();
			},
			itemClick(item, index) {
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
	
	.refresher-f2-view {
		text-align: center;
		background-color: #007AFF;
		font-weight: bold;
		padding: 20rpx;
		margin: 0rpx 30rpx;
		border-radius: 100px;
	}
	.refresher-f2-view-text {
		color: white;
		font-size: 26rpx;
	}
</style>
