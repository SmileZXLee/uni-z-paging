<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 空数据占位view，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view class="zp-swiper-container zp-swiper-container-fixed" :style="[swiperStyle]">
		<slot v-if="$slots.top" name="top"></slot>
		<view class="zp-swiper-super">
			<swiper class="zp-swiper" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="zp-swiper-item" v-for="(item,index) in tabsList" :key="index">
					<z-paging-swiper-item ref="swiperItem" :tabIndex="index" :currentIndex="swiperCurrent" @query="query" @updateList="updateList">
						<slot></slot>
					</z-paging-swiper-item>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import zPagingSwiperItem from './components/z-paging-swiper-item'
	export default {
		name: "z-paging-swiper",
		components: {
			zPagingSwiperItem
		},
		data() {
			return {
				systemInfo: null,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			};
		},
		props: {
			//空数据描述文字
			tabsList: {
				type: Array,
				default: []
			},
			//空数据描述文字
			fixed: {
				type: Boolean,
				default: true
			},
			//空数据描述文字
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
			setCurrent(current) {
				this.swiperCurrent = current;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				this.$emit('transition', e);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				// this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				// this.current = current;
				this.$emit('animationfinish', e);
			},
			query(pageNo, pageSize) {
				this.$emit('query', {
					pageNo,
					pageSize,
					current: this.swiperCurrent
				});
			},
			complete(data){
				console.log(this.$refs.swiperItem[this.swiperCurrent])
				this.$refs.swiperItem[this.swiperCurrent].complete(data);
			},
			updateList(list){
				
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
	}

	.zp-swiper {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.zp-swiper-item {
		height: 100%;
	}
</style>
