<!-- 滑动切换选项卡演示(标准写法) -->
<!--  此demo使用了uView的tabsSwiper全屏选项卡 https://uviewui.com/components/tabsSwiper.html -->
<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<!-- 此处代码复制了uView中tabsSwiper全屏选项卡的代码 -->
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<view slot="top">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-tab-swiper-item :tabIndex="index" :currentIndex="swiperCurrent"></scroll-tab-swiper-item>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
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
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
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
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	}
</script>

<style>
	.swiper {
		height: 100%;
	}
</style>

