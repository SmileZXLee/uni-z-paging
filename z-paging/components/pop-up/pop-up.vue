<template>
	<view v-if="show" class="pop-up">
		<view class="pop-up-container">
			<view class="pop-up-close-container">
				<image class="pop-up-close" src="/static/close.png" @click="show = false"></image>
			</view>
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name:"pop-up",
		data() {
			return {
				show: false
			};
		},
		methods: {
			open() {
				this.show = true;
			},
			close() {
				this.show = false;
			}
		}
	}
</script>

<style>
	.pop-up {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.pop-up-container {
		position: relative;
		background-color: white;
		border-radius: 10rpx;
		border-radius: 10rpx;
	}
	
	.pop-up-close-container {
		width: 100%;
		position: absolute;
		bottom: -80rpx;
		display: flex;
		justify-content: center;
	}
	
	.pop-up-close {
		width: 60rpx;
		height: 60rpx;
	}
</style>