<!-- 使用页面滚动演示(vue) -->
<template>
	<view class="content">
		<!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
		<!-- 注意注意！！这里的ref必须设置且必须等于"paging"，否则mixin方法无效 -->
		<z-paging ref="paging" v-model="dataList" use-page-scroll @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<z-tabs :list="tabList" @change="tabsChange" />
			</template>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	// 使用页面滚动时引入此mixin，用于监听和处理onPullDownRefresh等页面生命周期方法(如果全局引入了，就不要这一步，全局引入示例见main.js)
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		// 注意这一步不要漏掉，必须注册mixins(如果全局引入了，就不要这一步，全局引入示例见main.js)
		mixins: [ZPMixin],
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabList: ['测试1','测试2','测试3','测试4'],
				tabIndex: 0
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
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	/* 这种情况无需确定z-paging的高度，内部元素会自动将其撑高 */
	.item {
		z-index: 1;
		position: relative;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		z-index: 1;
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
