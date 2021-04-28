<!-- 自定义导航栏演示 -->
<!--  此demo使用了uView的Navbar 自定义导航栏 https://uviewui.com/components/navbar.html -->
<template>
	<view class="content">
		<!-- 这里的fixed建议设置为true，设置为true则无需设置z-paging的高度及其父view的高度 -->
		<z-paging ref="paging" @query="queryList" :fixed="true" :list.sync="dataList" style="height: 100%;">
			<!-- 将不需要参与滚动的部分，放在slot="top"的view中，如果只有一个标签，可以直接在此标签上写slot="top"，将自定义的导航栏放到里面即可 -->
			<view slot="top">
				<u-navbar :background="{'background-color': '#007AFF'}">
					<view class="slot-wrap" style="color: white;font-size: 26rpx;" @click="backClick">
						这是一个自定义导航栏，点击返回上级页面
					</view>
				</u-navbar>
				<tabs-view @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
			</view>
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
				tabIndex: 0
			}
		},
		methods: {
			tabChange(index){
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(data);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			},
			backClick(){
				uni.navigateBack({
					delta: 1
				})
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
