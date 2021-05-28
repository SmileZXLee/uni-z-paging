<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 下拉刷新view -->
<template>
	<view style="height: 100%;">
		<view
			:class="showRefresherUpdateTime?'zp-custom-refresher-container zp-custom-refresher-container-padding':'zp-custom-refresher-container'"
			style="height: 100%;">
			<view class="zp-custom-refresher-left">
				<image v-if="refresherStatus!==2" :class="refresherLeftImageClass"
					:src="defaultThemeStyle==='white'?base64ArrowWhite:base64Arrow">
				</image>
				<!-- #ifndef APP-NVUE -->
				<image v-else :class="refresherLeftLoadingImageClass"
					:src="defaultThemeStyle==='white'?base64FlowerWhite:base64Flower">
				</image>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view v-else :style="[{'margin-right':showRefresherUpdateTime?'18rpx':'12rpx'}]">
					<loading-indicator class="zp-loading-image"
						:style="[{color:defaultThemeStyle==='white'?'white':'#777777'}]" :animating="true">
					</loading-indicator>
				</view>
				<!-- #endif -->
			</view>
			<view class="zp-custom-refresher-right">
				<text class="zp-custom-refresher-right-text"
					:style="[refresherRightTextStyle]">{{refresherStatusTextMap[refresherStatus]}}
				</text>
				<text class="zp-custom-refresher-right-text zp-custom-refresher-right-time-text"
					:style="[refresherRightTextStyle]"
					v-if="showRefresherUpdateTime&&refresherTimeText.length">{{refresherTimeText}}
				</text>
			</view>
		</view>
	</view>
</template>
<script>
	import zStatic from '../js/z-paging-static'
	import {
		getRefesrherFormatTimeByKey
	} from '../js/z-paging-utils'
	export default {
		name: 'z-paging-refresh',
		data() {
			return {
				base64Arrow: zStatic.base64Arrow,
				base64ArrowWhite: zStatic.base64ArrowWhite,
				base64Flower: zStatic.base64Flower,
				base64FlowerWhite: zStatic.base64FlowerWhite,
				refresherTimeText: ''
			};
		},
		props: ['refresherStatus', 'defaultThemeStyle', 'refresherDefaultText', 'refresherPullingText',
			'refresherPullingText', 'refresherRefreshingText', 'showRefresherUpdateTime', 'refresherUpdateTimeKey'
		],
		computed: {
			refresherStatusTextMap() {
				this.updateTime(this.refresherUpdateTimeKey);
				return {
					0: this.refresherDefaultText,
					1: this.refresherPullingText,
					2: this.refresherRefreshingText
				};
			},
			refresherLeftImageClass() {
				let refresherLeftImageClass = ''
				if (this.refresherStatus === 0) {
					refresherLeftImageClass = 'zp-custom-refresher-left-image zp-custom-refresher-arrow-down';
				} else {
					refresherLeftImageClass = 'zp-custom-refresher-left-image zp-custom-refresher-arrow-top';
				}
				if (this.showRefresherUpdateTime) {
					refresherLeftImageClass += ' zp-custom-refresher-left-image-big';
				} else {
					refresherLeftImageClass += ' zp-custom-refresher-left-image-small';
				}
				return refresherLeftImageClass;
			},
			refresherLeftLoadingImageClass() {
				let refresherLeftImageClass = 'zp-loading-more-line-loading-image zp-custom-refresher-left-image';
				if (this.showRefresherUpdateTime) {
					refresherLeftImageClass += ' zp-custom-refresher-left-image-big';
				} else {
					refresherLeftImageClass += ' zp-custom-refresher-left-image-small';
				}
				return refresherLeftImageClass;
			},
			refresherRightTextStyle() {
				let refresherRightTextStyle = {};
				let color = '#555555';
				if (this.defaultThemeStyle === 'white') {
					color = '#efefef';
				}
				// #ifdef APP-NVUE
				if (this.showRefresherUpdateTime) {
					refresherRightTextStyle = {
						'height': '40rpx',
						'line-height': '40rpx'
					};
				} else {
					refresherRightTextStyle = {
						'height': '80rpx',
						'line-height': '80rpx'
					};
				}
				// #endif
				refresherRightTextStyle['color'] = color;
				return refresherRightTextStyle;
			}
		},
		methods: {
			updateTime(refresherUpdateTimeKey) {
				if (!refresherUpdateTimeKey) {
					refresherUpdateTimeKey = this.refresherUpdateTimeKey;
				}
				if (this.showRefresherUpdateTime) {
					this.refresherTimeText = getRefesrherFormatTimeByKey(refresherUpdateTimeKey);
				}
			}
		}
	}
</script>

<style scoped>
	@import "../css/z-paging-static.css";

	.zp-custom-refresher-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.zp-custom-refresher-container-padding {
		/* #ifdef APP-NVUE */
		padding: 15rpx 0rpx;
		/* #endif */
	}

	.zp-custom-refresher-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.zp-custom-refresher-left-image {
		/* #ifndef APP-NVUE */
		transform: rotate(180deg);
		margin-top: 2rpx;
		/* #endif */
		/* #ifdef APP-NVUE */
		transition-duration: .2s;
		transition-property: transform;
		color: #666666;
		/* #endif */
	}

	.zp-custom-refresher-left-image-small {
		margin-right: 8rpx;
		width: 30rpx;
		height: 30rpx;
		/* #ifdef APP-NVUE */
		width: 35rpx;
		height: 35rpx;
		/* #endif */
	}

	.zp-custom-refresher-left-image-big {
		margin-right: 20rpx;
		width: 36rpx;
		height: 36rpx;
		/* #ifdef APP-NVUE */
		width: 37rpx;
		height: 37rpx;
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
		font-size: 27rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.zp-custom-refresher-right-text {
		/* #ifdef APP-NVUE */
		font-size: 28rpx;
		/* #endif */
	}

	.zp-custom-refresher-right-time-text {
		margin-top: 10rpx;
		font-size: 24rpx;
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
