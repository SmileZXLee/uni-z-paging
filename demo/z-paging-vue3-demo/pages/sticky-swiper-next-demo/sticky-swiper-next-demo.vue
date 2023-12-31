<!-- 滑动切换选项卡+吸顶演示(上一个tab数据不保留，滚动流畅) -->
<template>
	<view class="content">
		<z-paging ref="pagePaging" refresher-only @onRefresh="onRefresh" @scrolltolower="scrolltolower">
			<!-- 自定义下拉刷新view -->
			<template #refresher="{refresherStatus}">
				<custom-refresher :status="refresherStatus" />
			</template>
			<view class="banner-view" style="height: 250rpx;">
				<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
				<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
			</view>
			<view>
				<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
				<view style="z-index: 100;position: sticky;top :0;">
					<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
					<z-tabs ref="tabs" :current="current" :list="tabList" @change="tabsChange" />
				</view>
				<swiper class="swiper" :style="[{height:swiperHeight+'px'}]" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
					<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
						<!-- 这里的sticky-swiper-next-item为demo中为演示用定义的组件，列表及分页代码在sticky-swiper-next-item组件内 -->
						<!-- 请注意，sticky-swiper-next-item非z-paging内置组件，在自己的项目中必须自己创建，若未创建则会报组件不存在的错误 -->
						<sticky-swiper-next-item :ref="el => swiperItems[index] = el" :tabIndex="index" :currentIndex="current" @heightChanged="heightChanged">
						</sticky-swiper-next-item>
					</swiper-item>
				</swiper>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '/http/request.js';
	
	const swiperItems = ref([]);
	const tabs = ref(null);
	const pagePaging = ref(null);
		
    const swiperHeight = ref(0);
	let tabIndex = ref(0);
	const tabList = ref(['测试1','测试2','测试3','测试4']);
	let current = ref(0);
	
	// tabs通知swiper切换
	const tabsChange = (index) => {
		_setCurrent(index);
	}
	
	// 下拉刷新时，通知当前显示的列表进行reload操作
	const onRefresh = () => {
		swiperItems.value[current.value].reload(() => {
			// 当当前显示的列表刷新结束，结束当前页面的刷新状态
			pagePaging.value.complete([]);
		});
	}
	
	// 当滚动到底部时，通知当前显示的列表加载更多
	const scrolltolower = () => {
		swiperItems.value[current.value].doLoadMore();
	}
	
	// swiper滑动中
	const swiperTransition = (e) => {
		tabs.value.setDx(e.detail.dx);
	}
	
	// swiper滑动结束
	const swiperAnimationfinish = (e) => {
		_setCurrent(e.detail.current);
		tabs.value.unlockDx();
	}
	
	// 设置swiper的高度
	const heightChanged = (height) => {
		if(height === 0){
			// 默认swiper高度为屏幕可用高度-tabsView高度-slot="top"内view的高度
			// 注意：uni.upx2px(80)不是固定的，它等于slot="top"内view的高度，如果slot="top"内view的高度不为80rpx，则需要修改这个值
			height = uni.getSystemInfoSync().windowHeight - uni.upx2px(80);
		}
		swiperHeight.value = height;
	}
	
	const _setCurrent = (tempCurrent) => {
		if (tempCurrent !== current.value){
			// 切换tab时，将上一个tab的数据清空
			swiperItems.value[current.value].clear();
		}
		current.value = tempCurrent;
	}
</script>

<style>
	.banner-view {
		background-color: #007AFF;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.paging-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.swiper {
		height: 1000px;
	}
</style>
