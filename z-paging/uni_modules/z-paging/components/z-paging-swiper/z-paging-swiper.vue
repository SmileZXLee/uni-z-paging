<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view :class="fixed?'zp-swiper-container zp-swiper-container-fixed':'zp-swiper-container'" :style="[swiperStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<slot v-if="$slots.top" name="top" />
		<view class="zp-swiper-super">
			<view class="zp-swiper">
				<slot />
			</view>
		</view>
		<slot v-if="$slots.bottom" name="bottom" />
	</view>
</template>

<script>
	export default {
		name: "z-paging-swiper",
		data() {
			return {
				systemInfo: null,
				cssSafeAreaInsetBottom: -1
			};
		},
		props: {
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
			// #ifndef APP-PLUS
			this._getCssSafeAreaInsetBottom();
			// #endif
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
					if(bottom > 0){
						swiperStyle.bottom = bottom + 'px';
					}
				}
				return swiperStyle;
			},
			safeAreaBottom() {
				if(!this.systemInfo){
					return 0;
				}
				let safeAreaBottom = 0;
				// #ifdef APP-PLUS
				safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
				// #endif
				// #ifndef APP-PLUS
				safeAreaBottom = this.cssSafeAreaInsetBottom === -1 ? 0 : this.cssSafeAreaInsetBottom;
				// #endif
				return safeAreaBottom;
			}
		},
		methods: {
			//通过获取css设置的底部安全区域占位view高度设置bottom距离
			_getCssSafeAreaInsetBottom(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.zp-safe-area-inset-bottom').boundingClientRect(res => {
					if (res) {
						this.cssSafeAreaInsetBottom = res.height;
					}
				}).exec();
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
		position: relative;
	}

	.zp-swiper {
		/* #ifndef APP-NVUE */
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
	
	.zp-swiper-item {
		height: 100%;
	}
</style>
