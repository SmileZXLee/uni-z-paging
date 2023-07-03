<!-- [z-paging]下拉刷新view -->
<template>
	<view style="height: 100%;">
		<view :class="showUpdateTime?'zp-r-container zp-r-container-padding':'zp-r-container'">
			<view class="zp-r-left">
				<image v-if="status!==R.Loading" :class="leftImageClass" :style="[leftImageStyle,imgStyle]" :src="leftImageSrc" />
				<!-- #ifndef APP-NVUE -->
				<image v-else :class="{'zp-line-loading-image':refreshingAnimated,'zp-r-left-image':true}" :style="[leftImageStyle,imgStyle]" :src="leftImageSrc" />
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view v-else :style="[{'margin-right':showUpdateTime?'18rpx':'12rpx'}]">
					<loading-indicator :class="isIos?'zp-loading-image-ios':'zp-loading-image-android'" 
					:style="[{color:zTheme.indicator[ts]},imgStyle]" :animating="true" />
				</view>
				<!-- #endif -->
			</view>
			<view class="zp-r-right">
				<text class="zp-r-right-text" :style="[rightTextStyle,titleStyle]">{{currentTitle}}</text>
				<text v-if="showUpdateTime&&refresherTimeText.length" class="zp-r-right-text zp-r-right-time-text" :style="[rightTextStyle,updateTimeStyle]">
					{{refresherTimeText}}
				</text>
			</view>
		</view>
	</view>
</template>
<script>
	import zStatic from '../js/z-paging-static'
	import u from '../js/z-paging-utils'
	import Enum from '../js/z-paging-enum'
	
	export default {
		name: 'z-paging-refresh',
		data() {
			return {
				R: Enum.Refresher,
				isIos: uni.getSystemInfoSync().platform === 'ios',
				refresherTimeText: '',
				zTheme: {
					title: { white: '#efefef', black: '#555555' },
					arrow: { white: zStatic.base64ArrowWhite, black: zStatic.base64Arrow },
					flower: { white: zStatic.base64FlowerWhite, black: zStatic.base64Flower },
					success: { white: zStatic.base64SuccessWhite, black: zStatic.base64Success },
					indicator: { white: '#eeeeee', black: '#777777' }
				}
			};
		},
		props: ['status', 'defaultThemeStyle', 'defaultText', 'pullingText', 'refreshingText', 'completeText', 'defaultImg', 'pullingImg', 
			'refreshingImg', 'completeImg', 'refreshingAnimated', 'showUpdateTime', 'updateTimeKey', 'imgStyle', 'titleStyle', 'updateTimeStyle', 'updateTimeTextMap'
		],
		computed: {
			ts() {
				return this.defaultThemeStyle;
			},
			statusTextArr() {
				this.updateTime();
				return [this.defaultText,this.pullingText,this.refreshingText,this.completeText];
			},
			currentTitle() {
				return this.statusTextArr[this.status] || this.defaultText;
			},
			leftImageClass() {
				if (this.status === this.R.Complete) return 'zp-r-left-image-pre-size';
				return `zp-r-left-image zp-r-left-image-pre-size ${this.status === this.R.Default ? 'zp-r-arrow-down' : 'zp-r-arrow-top'}`;
			},
			leftImageStyle() {
				const showUpdateTime = this.showUpdateTime;
				const size = showUpdateTime ? '36rpx' : '30rpx';
				return {width: size,height: size,'margin-right': showUpdateTime ? '20rpx' : '9rpx'};
			},
			leftImageSrc() {
				const R = this.R;
				const status = this.status;
				if (status === R.Default) {
					if (!!this.defaultImg) return this.defaultImg;
					return this.zTheme.arrow[this.ts];
				} else if (status  === R.ReleaseToRefresh) {
					if (!!this.pullingImg) return this.pullingImg;
					if (!!this.defaultImg) return this.defaultImg;
					return this.zTheme.arrow[this.ts];
				} else if (status  === R.Loading) {
					if (!!this.refreshingImg) return this.refreshingImg;
					return this.zTheme.flower[this.ts];;
				} else if (status  === R.Complete) {
					if (!!this.completeImg) return this.completeImg;
					return this.zTheme.success[this.ts];;
				}
				return '';
			},
			rightTextStyle() {
				let stl = {};
				// #ifdef APP-NVUE
				const textHeight = this.showUpdateTime ? '40rpx' : '80rpx';
				stl = {'height': textHeight, 'line-height': textHeight}
				// #endif
				stl['color'] = this.zTheme.title[this.ts];
				return stl;
			}
		},
		methods: {
			updateTime() {
				if (this.showUpdateTime) {
					this.refresherTimeText = u.getRefesrherFormatTimeByKey(this.updateTimeKey, this.updateTimeTextMap);
				}
			}
		}
	}
</script>

<style scoped>
	@import "../css/z-paging-static.css";

	.zp-r-container {
		/* #ifndef APP-NVUE */
		display: flex;
		height: 100%;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.zp-r-container-padding {
		/* #ifdef APP-NVUE */
		padding: 15rpx 0rpx;
		/* #endif */
	}

	.zp-r-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		overflow: hidden;
		/* #ifdef MP-ALIPAY */
		margin-top: -4rpx;
		/* #endif */
	}

	.zp-r-left-image {
		transition-duration: .2s;
		transition-property: transform;
		color: #666666;
	}
	
	.zp-r-left-image-pre-size{
		/* #ifndef APP-NVUE */
		width: 30rpx;
		height: 30rpx;
		overflow: hidden;
		/* #endif */
	}

	.zp-r-arrow-top {
		transform: rotate(0deg);
	}

	.zp-r-arrow-down {
		transform: rotate(180deg);
	}

	.zp-r-right {
		font-size: 27rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.zp-r-right-text {
		/* #ifdef APP-NVUE */
		font-size: 28rpx;
		/* #endif */
	}

	.zp-r-right-time-text {
		margin-top: 10rpx;
		font-size: 24rpx;
	}
</style>
