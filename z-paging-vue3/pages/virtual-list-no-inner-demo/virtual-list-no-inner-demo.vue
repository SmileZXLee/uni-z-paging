<!-- 虚拟列表演示(不使用内置列表)(vue) -->
<!-- 推荐使用virtual-list-demo或virtual-list-compatibility-demo中的写法 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<!-- 此写法在微信小程序上及一些平台上渲染可能会有跳动、数据渲染延迟等严重问题，非必要不建议使用 -->
<template>
	<view class="content">
		<!-- 如果页面中的cell高度是固定不变的，则不需要设置cell-height-mode，如果页面中高度是动态改变的，则设置cell-height-mode="dynamic" -->
		<!-- 原先的v-model修改为:virtualList.sync以绑定处理后的虚拟列表 -->
		<z-paging ref="paging" use-virtual-list :force-close-inner-list="true" :virtualList.sync="virtualList" :cell-height-mode="tabIndex===0?'fixed':'dynamic'" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<template #top>
				<view class="header">列表总数据量：10万条</view>
				<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
				<z-tabs :list="tabList" @change="tabChange" />
			</template>
			
			<!-- :id="`zp-id-${item.zp_index}`" 必须写，必须写！！！！ -->
			<!-- 这里for循环的index不是数组中真实的index了，请使用item.zp_index获取真实的index -->
			<view class="item" :id="`zp-id-${item.zp_index}`" :key="item.zp_index" v-for="(item,index) in virtualList" @click="itemClick(item,item.zp_index)">
				<image class="item-image" mode="aspectFit" src="@/static/boji1.png"></image>
				<view class="item-content">
					<text class="item-title">第{{item.title}}行</text>
					<text style="color: red;margin-left: 10rpx;">虚拟列表展示</text>
					<view class="item-detail">{{item.detail}}</view>
				</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//虚拟列表数组，请使用:virtualList.sync绑定而非v-model绑定
				virtualList: [],
				tabList: ['cell高度相同','cell高度不同'],
				tabIndex: 0
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					random: this.tabIndex === 1
				}
				this.$request.queryListLong(params).then(res => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			itemClick(item, index) {
				console.log('点击了', item.title);
			},
		}
	}
</script>

<style>
	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
	}
	
	.item-content{
		flex: 1;
		margin-left: 20rpx;
	}
	
	.header{
		background-color: red;
		font-size: 24rpx;
		text-align: center;
		padding: 20rpx 0rpx;
		color: white;
	}
	
	.item-image{
		height: 150rpx;
		width: 150rpx;
		background-color: #eeeeee;
		border-radius: 10rpx;
	}
	
	.item-title{
		background-color: red;
		color: white;
		font-size: 26rpx;
		border-radius: 5rpx;
		padding: 5rpx 10rpx;
	}
	
	.item-detail {
		margin-top: 10rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #aaaaaa;
		word-break: break-all;
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
