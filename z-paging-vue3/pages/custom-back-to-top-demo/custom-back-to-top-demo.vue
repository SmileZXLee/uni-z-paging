<!-- 自定义返回顶部view演示(vue) -->
<template>
	<view class="content">
		<z-paging @scroll="scroll" ref="paging" v-model="dataList" auto-show-back-to-top @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<z-tabs :list="tabList" @change="tabChange" />
			</template>
			<!-- 自定义返回顶部view -->
			<template #backToTop>
				<custom-back-to-top ref="backToTop" :current="current" :total="total" />
			</template>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '/http/request.js';
	
    const paging = ref(null);
	const backToTop = ref(null);
	let tabIndex = ref(0);
	const tabList = ref(['测试1','测试2','测试3','测试4']);
	//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
    let dataList = ref([]);
	let current = ref(0);
	let total = ref(0);
	
	const tabChange = (index) => {
		tabIndex.value = index;
		//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
		paging.value.reload();
	}
	
	const scroll = () => {
		if (backToTop.value) {
			backToTop.value.isScroll();
		}
	}
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.reload()即可
    const queryList = (pageNo, pageSize) => {
		current.value = pageNo;
		//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
		//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
		//模拟请求服务器获取分页数据，请替换成自己的网络请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize,
			type: tabIndex.value + 1
		}
		request.queryList(params).then(res => {
			//这里的total一般是服务端返回的，一共有多少页，或者总条数/每页多少条，这里是写死的
			total.value = 3;
			//将请求的结果数组传递给z-paging
			paging.value.complete(res.data.list);
		}).catch(res => {
			//如果请求失败写paging.value.complete(false);
			//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			paging.value.complete(false);
		})
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
