<!-- z-paging聊天输入框 -->

<template>
	<view class="chat-input-bar-container">
		<view class="chat-input-bar">
			<view class="chat-input-container">
				<!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
				<input :focus="focus" class="chat-input" v-model="msg" :adjust-position="false" confirm-type="send" type="text" placeholder="请输入内容" @confirm="sendClick" />
			</view>
			<!-- （如果不需要切换表情面板则不用写） -->
			<view class="emoji-container">
				<image class="emoji-img" :src="`/static/${emojiType || 'emoji'}.png`" @click="emojiChange"></image>
			</view>
			<view class="chat-input-send" @click="sendClick">
				<text class="chat-input-send-text">发送</text>
			</view>
		</view>
		<!-- （如果不需要切换表情面板则不用写） -->
		<view v-if="emojiType === 'keyboard'" class="emoji-panel">
			<text class="emoji-panel-text" v-for="(item, index) in emojisArr" :key="index" @click="emojiClick(item)">
				{{item}}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"chat-input-bar",
		data() {
			return {
				msg: '',
				
				// 表情数组（如果不需要切换表情面板则不用写）
				emojisArr: ['😊','👻','👍','😜','😳','😋','😥','😰','🤠','😎','😇'],
				// 当前input focus（如果不需要切换表情面板则不用写）
				focus: false,
				// 当前表情/键盘切换类型（如果不需要切换表情面板则不用写）
				emojiType: '',
			};
		},
		methods: {
			// 更新了键盘高度（如果不需要切换表情面板则不用写）
			updateKeyboardHeightChange(res) {
				if (res.height > 0) {
					// 键盘展开，将emojiType设置为emoji
					this.emojiType = 'emoji';
				}
			},
			// 点击了切换表情面板/键盘（如果不需要切换表情面板则不用写）
			emojiChange() {
				this.$emit('emojiTypeChange', this.emojiType);
				if (this.emojiType === 'keyboard') {
					// 点击了键盘，展示键盘
					this.focus = true;
				} else {
					// 点击了切换表情面板
					this.focus = false;
					// 隐藏键盘
					uni.hideKeyboard();
				}
				this.emojiType = (!this.emojiType || this.emojiType === 'emoji') ? 'keyboard': 'emoji';
			},
			// 点击了某个表情，将其插入输入内容中（如果不需要切换表情面板则不用写）
			emojiClick(text) {
				this.msg += text;
			},
			
			// 点击了发送按钮
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
	.emoji-container {
		margin: 20rpx 0rpx 10rpx 20rpx;
	}
	.emoji-img {
		width: 54rpx;
		height: 54rpx;
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
	.emoji-panel {
		font-size: 30rpx;
		height: 400rpx;
		display: flex;
		flex-direction: row;
		background-color: #fef6d8;
		flex-wrap: wrap;
		gap: 15rpx;
		padding: 20rpx;
	}
	.emoji-panel-text {
		font-size: 40rpx;
		margin-left: 20rx;
	}
</style>