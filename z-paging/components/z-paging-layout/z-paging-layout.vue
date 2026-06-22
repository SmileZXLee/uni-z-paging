<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 承载页面基础容器布局容器，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view :class="fixed?'zp-layout-container zp-layout-container-fixed':'zp-layout-container'" :style="[finalLayoutStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<slot v-if="zSlots.top" name="top" />
		<view class="zp-layout-super">
			<view v-if="zSlots.left" :class="{'zp-layout-left':true,'zp-absoulte':isOldWebView}">
				<slot name="left" />
			</view>
			<scroll-view scroll-y v-if="scrollable" :class="{'zp-layout':true,'zp-absoulte':isOldWebView}" :style="[layoutContentStyle]">
				<slot />
			</scroll-view>
			<view v-else :class="{'zp-layout':true,'zp-absoulte':isOldWebView}" :style="[layoutContentStyle]">
				<slot />
			</view>
			<view v-if="zSlots.right" :class="{'zp-layout-right':true,'zp-absoulte zp-right':isOldWebView}">
				<slot name="right" />
			</view>
		</view>
		<slot v-if="zSlots.bottom" name="bottom" />
	</view>
</template>

<script>
	import commonLayoutModule from '../z-paging/js/modules/common-layout'
	
	/**
	 * z-paging-layout 组件
	 * @description 专门用来承载页面基础容器布局，在根节点使用 z-paging-layout，其相当于一个 view 容器，默认铺满全屏，可免计算高度。
	 * @tutorial https://z-paging.zxlee.cn/api/sub-components/main.html#z-paging-layout配置
	 * @property {Boolean} scrollable 是否在 z-paging-layout 的主体内容外层包裹 scroll-view，默认为 true
	 * @property {Boolean} fixed 是否使用 fixed 布局，默认为 true
	 * @property {Boolean} safeAreaInsetBottom 是否开启底部安全区域适配，默认为 false
	 * @property {Object} layoutStyle z-paging-layout 样式，默认为 {}
	 * @example <z-paging-layout :safeAreaInsetBottom="true"></z-paging-layout>
	 */
	export default {
		name: "z-paging-layout",
		mixins: [commonLayoutModule],
		data() {
			return {
				layoutContentStyle: {}
			};
		},
		props: {
			// 是否在z-paging-layout的主体内容外层包裹scroll-view，默认为是
			scrollable: {
				type: Boolean,
				default: true
			},
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
			// z-paging-layout样式
			layoutStyle: {
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

			this.layoutContentStyle = { 'flex': '1' };
			// #ifndef APP-NVUE
			this.layoutContentStyle = { width: '100%',height: '100%' };
			// #endif
		},
		computed: {
			finalLayoutStyle() {
				const layoutStyle = { ...this.layoutStyle };
				if (!this.systemInfo) return layoutStyle;
				const windowTop = this.windowTop;
				const windowBottom = this.systemInfo.windowBottom;
				if (this.fixed) {
					if (windowTop && !layoutStyle.top) {
						layoutStyle.top = windowTop + 'px';
					}
					if (!layoutStyle.bottom) {
						let bottom = windowBottom || 0;
						bottom += this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
						if (bottom > 0) {
							layoutStyle.bottom = bottom + 'px';
						}
					}
				}
				return layoutStyle;
			}
		},
		methods: {
			// 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变时调用
			updateLeftAndRightWidth() {
				if (!this.isOldWebView) return;
				this.$nextTick(() => this._updateLeftAndRightWidth(this.layoutContentStyle, 'zp-layout'));
			}
		}
	}
</script>

<style scoped>
	.zp-layout-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
	}

	.zp-layout-container-fixed {
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

	.zp-layout-super {
		flex: 1;
		overflow: hidden;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	
	.zp-layout-left,.zp-layout-right{
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}

	.zp-layout {
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
	
	.zp-layout-item {
		height: 100%;
	}
</style>
