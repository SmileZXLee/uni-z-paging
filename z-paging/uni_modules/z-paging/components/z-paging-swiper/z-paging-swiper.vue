<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view :class="fixed?'zp-swiper-container zp-swiper-container-fixed':'zp-swiper-container'" :style="[swiperStyle]">
		<slot v-if="$slots.top" name="top"></slot>
		<view class="zp-swiper-super">
			<swiper class="zp-swiper" :current="current" @transition="transition" @animationfinish="animationfinish">
				<slot></slot>
			</swiper>
		</view>
		<slot v-if="$slots.bottom" name="bottom"></slot>
	</view>
</template>

<script>
	export default {
		name: "z-paging-swiper",
		data() {
			return {
				dataList: [],
				systemInfo: null
			};
		},
		props: {
			//当前swiper切换到第几个index
			current: {
				type: Number,
				default: 0
			},
			//是否使用fixed布局，默认为是
			fixed: {
				type: Boolean,
				default: true
			},
			//是否开启底部安全区域适配
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.systemInfo = uni.getSystemInfoSync();
			})
		},
		computed: {
			swiperStyle() {
				if (!this.systemInfo) {
					return {};
				}
				let swiperStyle = {};
				const windowTop = this.systemInfo.windowTop;
				const windowBottom = this.systemInfo.windowBottom;
				if (this.fixed) {
					if (windowTop && windowTop !== undefined) {
						swiperStyle.top = windowTop + 'px';
					}
					let bottom = 0;
					if (windowBottom && windowBottom !== undefined) {
						bottom = windowBottom;
					}
					if (this.safeAreaInsetBottom) {
						bottom += this.safeAreaBottom;
					}
					swiperStyle.bottom = bottom + 'px';
				}
				return swiperStyle;
			},
			safeAreaBottom() {
				if (!this.systemInfo) {
					return 0;
				}
				let safeAreaBottom = 0;
				// #ifdef APP-PLUS || H5 || MP-WEIXIN
				safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
				// #endif
				return safeAreaBottom;
			}
		},
		methods: {
			//swiper-item 的位置发生改变时会触发 transition 事件
			transition(e) {
				this.$emit('transition', e);
			},
			//动画结束时会触发animationfinish事件
			animationfinish(e) {
				this.$emit('animationfinish', e);
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

	.zp-swiper-top,
	.zp-swiper-bottom {
		/* #ifndef APP-NVUE */
		width: auto;
		/* #endif */
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
	}

	.zp-swiper-super {
		flex: 1;
		position: relative;
		background-color: red;
	}

	.zp-swiper {
		/* #ifndef APP-NVUE */
		height: 100%;
		width: 100%;
		/* #endif */
		position: absolute;
		top: 0;
		left: 0;
		/* #ifdef APP-NVUE */
		bottom: 0;
		right: 0;
		/* #endif */
		background-color: blue;
	}

	.zp-swiper-item {
		height: 100%;
	}
</style>
