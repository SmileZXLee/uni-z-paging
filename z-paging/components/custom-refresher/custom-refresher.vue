<template>
	<view class="refresher">
		<image class="refresher-image" mode="aspectFit" src="http://www.zxlee.cn/github/uni-z-paging/refresher_loading.gif"></image>
		<view class="refresher-text">{{statusText}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		computed: {
			statusText(){
				var statusTextArr = ['哎呀，用点力继续下拉！','拉疼我啦，松手刷新~~','正在努力刷新中...']
				return statusTextArr[this.status];
			}
		},
		props: {
			status: {
				type: Number,
				default: function() {
					return 0;
				},
			},
		}
	}
</script>

<style scoped>
	.refresher{
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.refresher-image{
		margin-top: 10px;
		height: 50px;
		width: 50px;
	}
	.refresher-text{
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #666666;
	}
</style>
