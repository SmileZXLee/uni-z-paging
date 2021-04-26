<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 下拉刷新view -->
<template>
	<view style="height: 100%;">
		<view class="zp-custom-refresher-container" style="height: 100%;">
			<view class="zp-custom-refresher-left">
				<image v-if="refresherStatus!==2" :class="refresherLeftImageClass"
					:style="[{'filter' :defaultThemeStyle==='white'?'brightness(10)':''}]" :src="base64Arrow">
				</image>
				<!-- #ifndef APP-NVUE -->
				<image v-else class="zp-loading-more-line-loading-image zp-custom-refresher-left-image" :src="base64Flower">
				</image>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view v-else>
					<loading-indicator class="zp-custom-refresher-left-image" :animating="true"></loading-indicator>
				</view>
				<!-- #endif -->
			</view>
			<view
				:class="defaultThemeStyle==='white'?'zp-custom-refresher-right zp-custom-refresher-right-white':'zp-custom-refresher-right zp-custom-refresher-right-black'">
				<text class="zp-custom-refresher-right-text">{{refresherStatusTextMap[refresherStatus]}}
				</text>
			</view>
		</view>
	</view>
</template>
<script>
	import zStatic from './z-paging-static'
	export default {
		name: 'z-paging-refresh',
		data() {
			return {
				base64Arrow: zStatic.base64Arrow,
				base64Flower: zStatic.base64Flower,
				refresherStatusTextMap: {
					0: this.refresherDefaultText,
					1: this.refresherPullingText,
					2: this.refresherRefreshingText
				},
				refresherLeftImageClass: 'zp-custom-refresher-left-image',
			};
		},
		props: ['refresherStatus', 'defaultThemeStyle', 'refresherDefaultText', 'refresherPullingText',
			'refresherPullingText', 'refresherRefreshingText'
		],
		watch: {
			refresherStatus(newVal, oldVal) {
				if (newVal === 0 && oldVal !== 0) {
					this.refresherLeftImageClass = 'zp-custom-refresher-left-image zp-custom-refresher-arrow-down';
				}
				if (newVal !== 0 && oldVal === 0) {
					this.refresherLeftImageClass = 'zp-custom-refresher-left-image zp-custom-refresher-arrow-top';
				}
			}
		}
	}
</script>

<style scoped>
	@import "./z-paging-static.css";
	.zp-custom-refresher-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.zp-custom-refresher-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.zp-custom-refresher-left-image {
		width: 30rpx;
		height: 30rpx;
		transform: rotate(180deg);
		margin-right: 8rpx;
		/* #ifdef APP-NVUE */
		width: 35rpx;
		height: 35rpx;
		transition-duration: .2s;
		transition-property: transform;
		color: #666666;
		/* #endif */
	}

	.zp-custom-refresher-arrow-top {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-top 0.25s linear;
		-webkitanimation: refresher-arrow-top 0.25s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */

		/* #ifdef APP-NVUE */
		transform: rotate(0deg);
		/* #endif */
	}

	.zp-custom-refresher-arrow-down {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-down 0.25s linear;
		-webkit-animation: refresher-arrow-down 0.25s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(180deg);
		/* #endif */
	}

	.zp-custom-refresher-right {
		font-size: 26rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.zp-custom-refresher-right-text {
		/* #ifdef APP-NVUE */
		font-size: 28rpx;
		height: 40px;
		line-height: 40px;
		/* #endif */
		color: #555555
	}

	.zp-custom-refresher-right-black {
		color: #666666;
	}

	.zp-custom-refresher-right-white {
		color: #efefef;
	}

	@keyframes refresher-arrow-top {
		0% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		}

		100% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
	}

	@keyframes refresher-arrow-down {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);
		}
	}
	
</style>
