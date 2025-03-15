<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper容器，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view :class="fixed?'zp-swiper-container zp-swiper-container-fixed':'zp-swiper-container'" :style="[finalSwiperStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<slot v-if="zSlots.top" name="top" />
		<view class="zp-swiper-super">
			<view v-if="zSlots.left" :class="{'zp-swiper-left':true,'zp-absoulte':isOldWebView}">
				<slot name="left" />
			</view>
			<view :class="{'zp-swiper':true,'zp-absoulte':isOldWebView}" :style="[swiperContentStyle]">
				<slot />
			</view>
			<view v-if="zSlots.right" :class="{'zp-swiper-right':true,'zp-absoulte zp-right':isOldWebView}">
				<slot name="right" />
			</view>
		</view>
		<slot v-if="zSlots.bottom" name="bottom" />
	</view>
</template>

<script>
	import commonLayoutModule from '../z-paging/js/modules/common-layout'
	
	/**
	 * z-paging-swiper 组件
	 * @description 在 swiper 中使用 z-paging 时（左右滑动切换列表），在根节点使用 z-paging-swiper，其相当于一个 view 容器，默认铺满全屏，可免计算高度直接插入 swiper 的视图容器。
	 * @tutorial https://z-paging.zxlee.cn/api/sub-components/main.html#z-paging-swiper配置
	 * @property {Boolean} fixed 是否使用 fixed 布局，默认为 true
	 * @property {Boolean} safeAreaInsetBottom 是否开启底部安全区域适配，默认为 false
	 * @property {Object} swiperStyle z-paging-swiper 样式，默认为 {}
	 * @example <z-paging-swiper :safeAreaInsetBottom="true"></z-paging-swiper>
	 */
	export default {
		name: "z-paging-swiper",
		mixins: [commonLayoutModule],
		data() {
			return {
				swiperContentStyle: {}
			};
		},
		props: {
			// 是否使用fixed布局，默认为是
			fixed: {
				type: Boolean,
				default: true
			},
			// 是否开启底部安全区域适配
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			// z-paging-swiper样式
			swiperStyle: {
				type: Object,
				default: function() {
					return {};
				},
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.systemInfo = this._getSystemInfoSync();
				setTimeout(this.updateFixedLayout, 100)
			})
			// #ifndef APP-PLUS
			this._getCssSafeAreaInsetBottom();
			// #endif
			this.updateLeftAndRightWidth();

			this.swiperContentStyle = { 'flex': '1' };
			// #ifndef APP-NVUE
			this.swiperContentStyle = { width: '100%',height: '100%' };
			// #endif
		},
		computed: {
			finalSwiperStyle() {
				const swiperStyle = { ...this.swiperStyle };
				if (!this.systemInfo) return swiperStyle;
				const windowTop = this.windowTop;
				const windowBottom = this.systemInfo.windowBottom;
				if (this.fixed) {
					if (windowTop && !swiperStyle.top) {
						swiperStyle.top = windowTop + 'px';
					}
					if (!swiperStyle.bottom) {
						let bottom = windowBottom || 0;
						bottom += this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
						if (bottom > 0) {
							swiperStyle.bottom = bottom + 'px';
						}
					}
				}
				return swiperStyle;
			}
		},
		methods: {
			// 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变时调用
			updateLeftAndRightWidth() {
				if (!this.isOldWebView) return;
				this.$nextTick(() => this._updateLeftAndRightWidth(this.swiperContentStyle, 'zp-swiper'));
			}
		}
	}
</script>

<style scoped>
	.zp-swiper-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
	}

	.zp-swiper-container-fixed {
		position: fixed;
		/* #ifndef APP-NVUE */
		height: auto;
		width: auto;
		/* #endif */
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
	
	.zp-safe-area-inset-bottom {
		position: absolute;
		/* #ifndef APP-PLUS */
		height: env(safe-area-inset-bottom);
		/* #endif */
	}

	.zp-swiper-super {
		flex: 1;
		overflow: hidden;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	
	.zp-swiper-left,.zp-swiper-right{
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}

	.zp-swiper {
		flex: 1;
		/* #ifndef APP-NVUE */
		height: 100%;
		width: 100%;
		/* #endif */
	}
	
	.zp-absoulte {
		/* #ifndef APP-NVUE */
		position: absolute;
		top: 0;
		width: auto;
		/* #endif */
	}
	
	.zp-swiper-item {
		height: 100%;
	}
</style>
