<!-- 在弹窗内使用z-paging演示(vue) -->
<template>
	<view class="content">
		<button size="mini" type="primary" @click="open">打开弹窗</button>
		<pop-up ref="popup">
			<!-- 在弹窗内使用z-paging时，z-paging的父view必须确定宽高（或者z-paging本身确定宽高） -->
			<view style="height: 700rpx;width: 500rpx;">
				<!-- 设置fixed=false代表z-paging非铺满全屏，此时z-paging高度未确定，其父view或z-paging本身必须确定宽高 -->
				<!-- v-if="showPaging"用于控制z-paging的展示，本身在pop-up中已经加了v-if了，但是在微信小程序中无效，会导致页面渲染时pop-up中的内容同时渲染，因此需要额外添加一个v-if -->
				<z-paging v-if="showPaging" ref="paging" :fixed="false" v-model="dataList" @query="queryList">
					<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
					<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
					<template #top>
						<z-tabs :list="tabList" @change="tabsChange" />
					</template>
					<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
					<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item,index)">
						<view class="item-title">{{item.title}}</view>
						<view class="item-detail">{{item.detail}}</view>
						<view class="item-line"></view>
					</view>
				</z-paging>
			</view>
		</pop-up>
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
				// 是否显示z-paging
				showPaging: false,
			}
		},
		methods: {
			open() {
				this.showPaging = true;
				this.$refs.popup.open();
			},
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
			itemClick(item, index) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	
	page {
		height: 100%;
	}
	
	.content {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
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
