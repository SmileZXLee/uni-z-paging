<!-- 滑动切换选项卡演示(简化写法，不推荐。建议使用标准写法swiper-demo.vue)(vue) -->
<!-- 简化写法灵活性不如标准写法高，暂时无法设置内部z-paging自定义下拉刷新view，自定义上拉加载view等slot插入的vie -->
<!-- z-paging-swiper-item只支持props传部分常见属性，其他z-paging属性请通过全局配置修改 -->
<!-- 适用于简单的低自定义场景 -->
<!-- 支付宝小程序不支持此写法 -->

<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<template>
	<z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<template #top>
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" />
		</template>
		<!-- 因swiper与swiper-item无法封装在不同组件中，因此这边依然需要设置swiper包裹swiper-item -->
		<swiper style="height: 100%;" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item v-for="(item,index) in tabList" :key="index">
				<z-paging-swiper-item ref="swiperItem" :tabIndex="index" :currentIndex="current" @query="queryList"
					@updateList="updateList">
					<view class="item" v-for="(subItem,subIndex) in dataList[index]" :key="subIndex">
						<view class="item-title">{{subItem.title}}</view>
						<view class="item-detail">{{subItem.detail}}</view>
						<view class="item-line"></view>
					</view>
				</z-paging-swiper-item>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '/http/request.js'
	
	
    const swiperItem = ref(null);
	const tabs = ref(null);
	
	// 注意，这个数组是一个二维数组，数组里面包含的是所有tabs的list数组
	const dataList = ref([])
	const current = ref(0);
	const tabList = ref(['测试1','测试2','测试3','测试4']);
	
	
	// tabs通知swiper切换
	const tabsChange = (index) => {
		current.value = index;
	}
	
	// swiper滑动中
	const swiperTransition = (e) => {
		tabs.value.setDx(e.detail.dx);
	}
	
	// swiper滑动结束
	const swiperAnimationfinish = (e) => {
		current.value = e.detail.current;
		tabs.value.unlockDx();
	}
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
	const queryList = (pageNo, pageSize) => {
		// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
		// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
		// 模拟请求服务器获取分页数据，请替换成自己的网络请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize,
			type: current.value + 1
		}
		request.queryList(params).then(res => {
			// 将请求的结果数组传递给z-paging
			swiperItem.value[current.value].complete(res.data.list);
		}).catch(res => {
			// 如果请求失败写swiperItem.value[current.value].complete(false);
			// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			swiperItem.value[current.value].complete(false);
		})
	}
	
	// 更新当前对应tab的数据
	const updateList = (data) => {
		dataList.value[current.value] = data;
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
