<!-- z-paging聊天输入框 -->

<template>
	<view class="chat-input-bar-container">
		<view class="chat-input-bar">
			<view class="chat-input-container">
				<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
				<input class="chat-input" v-model="msg" :adjust-position="false" confirm-type="send" type="text" placeholder="请输入内容" @confirm="sendClick" />
			</view>
			<view class="chat-input-send" @click="sendClick">
				<text class="chat-input-send-text">发送</text>
			</view>
		</view>
	</view>
</template>

<!-- setup写法uni.createSelectorQuery().in(this)有问题，因此暂时先用options写法 -->
<script>
	export default {
		name:"chat-input-bar",
		data() {
			return {
				msg: ''
			};
		},
		methods: {
			sendClick() {
				if (!this.msg.length) return;
				this.$emit('send', this.msg);
				this.msg = '';
			}
		}
	}
</script>

<style scoped>
	.chat-input-bar{
		display: flex;
		flex-direction: row;
		align-items: center;
		border-top: solid 1px #f5f5f5;
		background-color: #f8f8f8;
		
		padding: 10rpx 15rpx;
	}
	.chat-input-container{
		flex: 1;
		display: flex;
		/* #ifndef APP-NVUE */
		padding: 15rpx;
		/* #endif */
		/* #ifdef APP-NVUE */
		padding: 10rpx;
		/* #endif */
		background-color: white;
		border-radius: 10rpx;
	}
	.chat-input{
		flex: 1;
		font-size: 28rpx;
	}
	.chat-input-send{
		background-color: #007AFF;
		margin: 10rpx 10rpx 10rpx 20rpx;
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
		
	}
	.chat-input-send-text{
		color: white;
		font-size: 26rpx;
	}
</style>