<!-- [z-paging]下拉刷新view -->
<template>
	<view style="height: 100%;">
		<view :class="showUpdateTime?'zp-r-container zp-r-container-padding':'zp-r-container'">
			<view class="zp-r-left">
				<image v-if="status!==R.Loading" :class="leftImageClass" :style="[leftImageStyle,imgStyle]" :src="leftImageSrc" />
				<!-- #ifndef APP-NVUE -->
				<image v-else class="zp-line-loading-image zp-r-left-image" :style="[leftImageStyle,imgStyle]" :src="leftImageSrc" />
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view v-else :style="[{'margin-right':showUpdateTime?'18rpx':'12rpx'}]">
					<loading-indicator :class="isIos?'zp-loading-image-ios':'zp-loading-image-android'" 
					:style="[{color:defaultThemeStyle==='white'?'white':'#777777'},imgStyle]" :animating="true" />
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
				isIos: uni.getSystemInfoSync().platform==='ios',
				refresherTimeText: '',
				leftImageLoaded: false
			};
		},
		props: {
			'status': { default: Enum.Refresher.Default },
			'defaultThemeStyle': {},
			'defaultText': '',
			'pullingText': '',
			'refreshingText': '',
			'completeText': '',
			'defaultImg': '',
			'pullingImg': '',
			'refreshingImg': '',
			'completeImg': '',
			'showUpdateTime': { default: false },
			'updateTimeKey': '',
			'imgStyle': { default: {} },
			'titleStyle': { default: {} },
			'updateTimeStyle': { default: {} },
			'updateTimeTextMap': { default: {} },
		},
		computed: {
			isWhite() {
				return this.defaultThemeStyle === 'white';
			},
			statusTextArr() {
				this.updateTime();
				return [this.defaultText,this.pullingText,this.refreshingText,this.completeText];
			},
			currentTitle() {
				return this.statusTextArr[this.status] || this.defaultText;
			},
			leftImageClass() {
				if (this.status === this.R.Complete) return 'zp-r-left-image-no-transform zp-r-left-image-pre-size';
				let cls = 'zp-r-left-image ';
				if (this.status === this.R.Default) {
					cls += this.leftImageLoaded ? 'zp-r-arrow-down' : 'zp-r-arrow-down-no-duration';
					this.leftImageLoaded = true;
				} else {
					cls += 'zp-r-arrow-top';
				}
				return cls + ' zp-r-left-image-pre-size';
			},
			leftImageStyle() {
				const showUpdateTime = this.showUpdateTime;
				const size = showUpdateTime ? '36rpx' : '30rpx';
				return {width: size,height: size,'margin-right': showUpdateTime ? '20rpx' : '9rpx'};
			},
			leftImageSrc() {
				const R = this.R;
				const status = this.status;
				const isWhite = this.isWhite;
				const arrowImg = isWhite ? zStatic.base64ArrowWhite : zStatic.base64Arrow;
				const flowerImg = isWhite ? zStatic.base64FlowerWhite : zStatic.base64Flower;
				const successImg = isWhite ? zStatic.base64SuccessWhite : zStatic.base64Success;
				if (status === R.Default) {
					if (!!this.defaultImg) return this.defaultImg;
					return arrowImg;
				} else if (status  === R.ReleaseToRefresh) {
					if (!!this.pullingImg) return this.pullingImg;
					if (!!this.defaultImg) return this.defaultImg;
					return arrowImg;
				} else if (status  === R.Loading) {
					if (!!this.refreshingImg) return this.refreshingImg;
					return flowerImg;
				} else if (status  === R.Complete) {
					if (!!this.completeImg) return this.completeImg;
					return successImg;
				}
				return '';
			},
			rightTextStyle() {
				let stl = {};
				// #ifdef APP-NVUE
				const textHeight = this.showUpdateTime ? '40rpx' : '80rpx';
				stl = {'height': textHeight, 'line-height': textHeight}
				// #endif
				stl['color'] = this.isWhite ? '#efefef' : '#555555';
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
	
	.zp-r-left-image-no-transform {
		/* #ifndef APP-NVUE */
		margin-top: 2rpx;
		/* #endif */
	}
	
	.zp-r-left-image-pre-size{
		/* #ifndef APP-NVUE */
		width: 30rpx;
		height: 30rpx;
		overflow: hidden;
		/* #endif */
	}

	.zp-r-arrow-top {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-top .2s linear;
		-webkit-animation: refresher-arrow-top .2s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(0deg);
		/* #endif */
	}

	.zp-r-arrow-down {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-down .2s linear;
		-webkit-animation: refresher-arrow-down .2s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(180deg);
		/* #endif */
	}

	.zp-r-arrow-down-no-duration {
		/* #ifndef APP-NVUE */
		animation: refresher-arrow-down 0s linear;
		-webkit-animation: refresher-arrow-down 0s linear;
		animation-fill-mode: forwards;
		-webkit-animation-fill-mode: forwards;
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: rotate(180deg);
		/* #endif */
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
	
	/* #ifndef APP-NVUE */
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
	/* #endif */
</style>
