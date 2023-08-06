<!-- z-paging聊天输入框 -->

<template>
	<view class="chat-input-bar-container">
		<view class="chat-input-bar">
			<view class="chat-input-container">
				<input class="chat-input" v-model="msg" :cursor-spacing="cursorSpacing" confirm-type="send" type="text" placeholder="请输入内容" @focus="onInputFocus" @confirm="sendClick" />
			</view>
			<view class="chat-input-send" @click="sendClick">
				<text class="chat-input-send-text">发送</text>
			</view>
		</view>
		<view class="chat-input-bar-bottom-placeholder"></view>
	</view>
</template>

<!-- setup写法uni.createSelectorQuery().in(this)有问题，因此暂时先用options写法 -->
<script>
	export default {
		name:"chat-input-bar",
		data() {
			return {
				msg: '',
				cursorSpacing: 20
			};
		},
		mounted() {
			// #ifndef APP-NVUE
			const query = uni.createSelectorQuery().in(this);
			query.select('.chat-input-bar-bottom-placeholder').boundingClientRect(data => {
				if (data && data.height) {
					this.cursorSpacing = data.height + 20;
				}
			}).exec();
			// #endif
		},
		methods: {
			onInputFocus() {
				// input focus的时候重新设置一下input内容以修复在微信小程序&QQ小程序中input focus后位置偏移的bug
				// #ifdef MP-WEIXIN || MP-QQ
				this.msg += ' ';
				this.$nextTick(() => {
					this.msg = this.msg.slice(0, -1);
				})
				// #endif
			},
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
	.chat-input-bar-bottom-placeholder{
		background-color: #f8f8f8;
		/* #ifndef APP-PLUS */
		height: env(safe-area-inset-bottom);
		/* #endif */
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