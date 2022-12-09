<!-- [z-paging]上拉加载更多view -->
<template>
	<view class="zp-l-container" :style="[c.customStyle]" @click="doClick">
		<template v-if="!c.hideContent">
			<text v-if="c.showNoMoreLine&&finalStatus===M.NoMore" class="zp-l-line" :style="[{backgroundColor:zTheme.line[ts]},c.noMoreLineCustomStyle]" />
			<!-- #ifndef APP-NVUE -->
			<image v-if="finalStatus===M.Loading&&!!c.loadingIconCustomImage"
				:src="c.loadingIconCustomImage" :style="[c.iconCustomStyle]" :class="{'zp-l-line-loading-custom-image':true,'zp-l-line-loading-custom-image-animated':c.loadingAnimated}" />
			<image v-if="finalStatus===M.Loading&&finalLoadingIconType==='flower'&&!c.loadingIconCustomImage.length"
				class="zp-line-loading-image" :style="[c.iconCustomStyle]" :src="zTheme.flower[ts]" />
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<view>
				<loading-indicator v-if="finalStatus===M.Loading&&finalLoadingIconType!=='circle'" class="zp-line-loading-image" :style="[{color:zTheme.indicator[ts]}]" :animating="true" />
			</view>
			<!-- #endif -->
			<text v-if="finalStatus===M.Loading&&finalLoadingIconType==='circle'&&!c.loadingIconCustomImage.length"
				class="zp-l-circle-loading-view" :style="[{borderColor:zTheme.circleBorder[ts],borderTopColor:zTheme.circleBorderTop[ts]},c.iconCustomStyle]" />
			<text class="zp-l-text" :style="[{color:zTheme.title[ts]},c.titleCustomStyle]">{{ownLoadingMoreText}}</text>
			<text v-if="c.showNoMoreLine&&finalStatus===M.NoMore" class="zp-l-line" :style="[{backgroundColor:zTheme.line[ts]},c.noMoreLineCustomStyle]" />
		</template>
	</view>
</template>
<script>
	import zStatic from '../js/z-paging-static'
	import Enum from '../js/z-paging-enum'
	export default {
		name: 'z-paging-load-more',
		data() {
			return {
				M: Enum.More,
				zTheme: {
					title: { white: '#efefef', black: '#a4a4a4' },
					line: { white: '#efefef', black: '#eeeeee' },
					circleBorder: { white: '#aaaaaa', black: '#c8c8c8' },
					circleBorderTop: { white: '#ffffff', black: '#444444' },
					flower: { white: zStatic.base64FlowerWhite, black: zStatic.base64Flower },
					indicator: { white: '#eeeeee', black: '#777777' }
				}
			};
		},
		props: ['zConfig'],
		computed: {
			ts() {
				return this.c.defaultThemeStyle;
			},
			c() {
				return this.zConfig;
			},
			ownLoadingMoreText() {
				const statusTextArr = [this.c.defaultText,this.c.loadingText,this.c.noMoreText,this.c.failText];
				return statusTextArr[this.finalStatus];
			},
			finalStatus() {
				if (this.c.defaultAsLoading && this.c.status === this.M.Default) return this.M.Loading;
				return this.c.status;
			},
			finalLoadingIconType() {
				// #ifdef APP-NVUE
				return 'flower';
				// #endif
				return this.c.loadingIconType;
			}
		},
		methods: {
			doClick() {
				this.$emit('doClick');
			}
		}
	}
</script>

<style scoped>
	@import "../css/z-paging-static.css";

	.zp-l-container {
		height: 80rpx;
		font-size: 27rpx;
		/* #ifndef APP-NVUE */
		clear: both;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.zp-l-line-loading-custom-image {
		color: #a4a4a4;
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
	}
	
	.zp-l-line-loading-custom-image-animated{
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-l-circle-loading-view {
		margin-right: 8rpx;
		width: 23rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 30rpx;
		height: 30rpx;
		/* #endif */
	}

	.zp-l-text {
		/* #ifdef APP-NVUE */
		font-size: 30rpx;
		margin: 0rpx 10rpx;
		/* #endif */
	}

	.zp-l-line {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}

	/* #ifndef APP-NVUE */
	@keyframes loading-circle {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	/* #endif */
</style>
