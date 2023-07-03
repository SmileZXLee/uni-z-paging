<!-- 滑动切换选项卡演示(标准写法) -->
<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
		<template #top>
			<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" />
		</template>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<!-- 这里的swiper-list-item为demo中为演示用定义的组件，列表及分页代码在swiper-list-item组件内 -->
				<!-- 请注意，swiper-list-item非z-paging内置组件，在自己的项目中必须自己创建，若未创建则会报组件不存在的错误 -->
				<swiper-list-item :tabIndex="index" :currentIndex="current"></swiper-list-item>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '/http/request.js';
	
	
    const paging = ref(null);
	const tabs = ref(null);
	
	const current = ref(0);
	const tabList = ref(['测试1','测试2','测试3','测试4']);
	
	
	//tabs通知swiper切换
	const tabsChange = (index) => {
		current.value = index;
	}
	
	//swiper滑动中
	const swiperTransition = (e) => {
		tabs.value.setDx(e.detail.dx);
	}
	
	//swiper滑动结束
	const swiperAnimationfinish = (e) => {
		current.value = e.detail.current;
		tabs.value.unlockDx();
	}
</script>

<style>
	.swiper {
		height: 100%;
	}
</style>

