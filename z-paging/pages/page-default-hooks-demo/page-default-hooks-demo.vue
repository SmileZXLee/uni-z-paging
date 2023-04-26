<template>
    <z-paging ref="paging" v-model="dataList" @query="queryList" use-page-scroll>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
		<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
		<template #top>
			<z-tabs :list="tabList" @change="tabChange" />
		</template>
		<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
		<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
			<view class="item-title">{{item.title}}</view>
			<view class="item-detail">{{item.detail}}</view>
			<view class="item-line"></view>
		</view>
    </z-paging>
</template>

<script setup>
	import { ref } from 'vue';
	
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	
	import request from '../../http/request.js'
	
    
    const paging = ref(null)
	let tabIndex = ref(0)
	const tabList = ref(['测试1','测试2','测试3','测试4'])
	// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
    let dataList = ref([])
	
	useZPaging(paging)
	
	const tabChange = (index) => {
		tabIndex.value = index;
		//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
		paging.value.reload();
	}
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.reload()即可
    const queryList = (pageNo, pageSize) => {
		// 此处请求仅为演示，请替换为自己项目中的请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize,
			type: tabIndex.value + 1
		}
        request.queryList(params).then(res => {
			// 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
            paging.value.complete(res.data.list);
        })
    }
</script>

<style>
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