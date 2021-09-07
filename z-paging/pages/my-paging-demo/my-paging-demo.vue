<!-- 基于z-paging封装个性化分页组件演示(vue) -->
<template>
	<view class="content">
		<!-- 这里就很整洁了，只要设置ref，绑定query事件，绑定list就可以了 -->
		<my-paging ref="paging" v-model="dataList" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<view slot="top">
				<view class="notice">
					<view>①此demo演示了基于z-paging封装个性化分页组件的流程</view>
					<view>②可将重复的配置或者重复插入的slot封装在自定义的分页组件中</view>
				</view>
				<tabs-view @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
			</view>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</my-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabIndex: 0
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload(true);
			},
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
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	.notice {
		background-color: red;
		color: white;
		display: flex;
		flex-direction: column;
		padding: 12rpx 20rpx;
		font-size: 24rpx;
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
