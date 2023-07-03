<!-- 保证数据一致性演示[当网络较卡顿或接口请求较长时，若用户频繁切换tab，将可能导致当前显示数据与对应tab不一致](vue) -->
<!-- ps:使用横向滚动切换无需关注数据一致性问题，因为他们的数据源各自持有，而非共享 -->
<!-- 如果想有更直观的体验，请增加demo请求时长：修改@/http/consistency-request.js中的loadingTime值 -->
<!-- 快速切换tab体验 -->
<template>
	<view class="content">
		<!-- 非页面滚动时这里的fixed建议设置为true，则无需设置z-paging的高度及其父view的高度 -->
		<!-- data-key需要绑定一个在切换tab时会跟着改变的且能标识当前切换tab标识的变量 -->
		<z-paging ref="paging" v-model="dataList" :data-key="tabIndex" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<z-tabs :list="tabList" @change="tabsChange" />
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
	import consistencyRequest from '/http/consistency-request.js';
	
    const paging = ref(null);
	let tabIndex = ref(0);
	const tabList = ref(['测试1','测试2','测试3','测试4']);
	//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
    let dataList = ref([]);
	
	const tabsChange = (index) => {
		tabIndex.value = index;
		console.log('当前data-key', tabIndex.value);
		//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
		paging.value.reload();
	}
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
    const queryList = (pageNo, pageSize) => {
		//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
		//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
		//模拟请求服务器获取分页数据，请替换成自己的网络请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize,
			type: tabIndex.value + 1
		}
		consistencyRequest.myQueryList(params).then(res => {
			//将请求的结果数组传递给z-paging
			//为保证数据一致性，请使用completeByKey方法代替原有的complete
			//这里的第二个值传的 就是z-paging :data-key绑定的值，因为传给后端时候+1了，所以这里要-1，-1不是必须的，依据具体情况而定
			//关于res.type 是怎么来的，为什么需要，请看.@/http/consistency-request.js中的解释
			//总结一句话就是，请求完成传给z-paging数据的时候，要告诉他，当初传过去给服务器的data-key是谁
			//z-paging会比较它们是否相同，当相同的时候才会接纳这一数据，从而保证数据的一致性
			paging.value.completeByKey(res.data.list, res.type - 1);
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
