<!-- 滑动切换选项卡演示 -->
<!--  此demo使用了uView的tabsSwiper全屏选项卡 https://uviewui.com/components/tabsSwiper.html -->
<template>
	<view class="content">
		<!-- 此处代码复制了uView中tabsSwiper全屏选项卡的代码 -->
		<view style="height: 80rpx;">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper class="swiper" :current="current" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-tab-swiper-item :tabIndex="index" :currentIndex="current"></scroll-tab-swiper-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '测试1'
				}, {
					name: '测试2'
				}, {
					name: '测试3'
				}, {
					name: '测试4'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			}
		}
	}
</script>

<style>
	/* 页面需要设置固定的高度 */
	page {
		height: 100%;
	}

	.content {
		height: 100%;
	}

	/* swiper+顶部固定部分的高度需要等于页面高度 */
	.swiper {
		height: calc(100% - 80rpx);
	}
</style>
