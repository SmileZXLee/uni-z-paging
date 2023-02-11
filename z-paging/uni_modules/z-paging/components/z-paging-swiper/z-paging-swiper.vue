<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper，此组件支持easycom规范，可以在项目中直接引用 -->
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
	export default {
		name: "z-paging-swiper",
		data() {
			return {
				systemInfo: null,
				cssSafeAreaInsetBottom: -1,
				swiperContentStyle: {}
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
			},
			//z-paging-swiper样式
			swiperStyle: {
				type: Object,
				default: function() {
					return {};
				},
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.systemInfo = uni.getSystemInfoSync();
			})
			// #ifndef APP-PLUS
			this._getCssSafeAreaInsetBottom();
			// #endif
			this._updateLeftAndRightWidth();

			this.swiperContentStyle = {'flex': '1'};
			// #ifndef APP-NVUE
			this.swiperContentStyle = {width: '100%',height: '100%'};
			// #endif
		},
		computed: {
			finalSwiperStyle() {
				const swiperStyle = this.swiperStyle;
				if (!this.systemInfo) return swiperStyle;
				let windowTop = this.systemInfo.windowTop;
				//暂时修复vue3中隐藏系统导航栏后windowTop获取不正确的问题，具体bug详见https://ask.dcloud.net.cn/question/141634
				//感谢litangyu！！https://github.com/SmileZXLee/uni-z-paging/issues/25
				// #ifdef VUE3 && H5
				const pageHeadNode = document.getElementsByTagName("uni-page-head");
				if (!pageHeadNode.length) windowTop = 0;
				// #endif
				const windowBottom = this.systemInfo.windowBottom;
				if (this.fixed) {
					if (windowTop && !swiperStyle.top) {
						swiperStyle.top = windowTop + 'px';
					}
					if (!swiperStyle.bottom) {
						let bottom = windowBottom ? windowBottom : 0;
						if (this.safeAreaInsetBottom) {
							bottom += this.safeAreaBottom;
						}
						if(bottom > 0){
							swiperStyle.bottom = bottom + 'px';
						}
					}
				}
				return swiperStyle;
			},
			safeAreaBottom() {
				if (!this.systemInfo) return 0;
				let safeAreaBottom = 0;
				// #ifdef APP-PLUS
				safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0;
				// #endif
				// #ifndef APP-PLUS
				safeAreaBottom = this.cssSafeAreaInsetBottom === -1 ? 0 : this.cssSafeAreaInsetBottom;
				// #endif
				return safeAreaBottom;
			},
			isOldWebView() {
				// #ifndef APP-NVUE || MP-KUAISHOU
				try {
					const systemInfos = uni.getSystemInfoSync().system.split(' ');
					const deviceType = systemInfos[0];
					const version = parseInt(systemInfos[1].slice(0,1));
					if ((deviceType === 'iOS' && version <= 10) || (deviceType === 'Android' && version <= 6)) {
						return true;
					}
				} catch(e){
					return false;
				}
				// #endif
				return false;
			},
			zSlots() {
				// #ifdef VUE2
				
				// #ifdef MP-ALIPAY
				return this.$slots;
				// #endif
				
				return this.$scopedSlots ? this.$scopedSlots : this.$slots;
				// #endif
				
				return this.$slots;
			}
		},
		methods: {
			//更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变时调用
			updateLeftAndRightWidth() {
				this.$nextTick(() => {
					this._updateLeftAndRightWidth();
				})
			},
			//通过获取css设置的底部安全区域占位view高度设置bottom距离
			_getCssSafeAreaInsetBottom() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.zp-safe-area-inset-bottom').boundingClientRect(res => {
					if (res) {
						this.cssSafeAreaInsetBottom = res.height;
					}
				}).exec();
			},
			//获取slot="left"和slot="right"宽度并且更新布局
			_updateLeftAndRightWidth() {
				if (!this.isOldWebView) return;
				this.$nextTick(() => {
					let delayTime = 0;
					// #ifdef MP-BAIDU
					delayTime = 10;
					// #endif
					setTimeout(() => {
						['left','right'].map(position => {
							const query = uni.createSelectorQuery().in(this);
							query.select(`.zp-swiper-${position}`).boundingClientRect(res => {
								this.$set(this.swiperContentStyle, position, res ? res.width + 'px' : '0px');
							}).exec();
						})
					}, delayTime)
				})
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
	
	.zp-right{
		right: 0;
	}
	
	.zp-swiper-item {
		height: 100%;
	}
</style>
