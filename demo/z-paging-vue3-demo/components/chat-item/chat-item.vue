<!-- z-paging聊天item -->

<template>
	<view class="chat-item">
		<text class="chat-time" v-if="item.time&&item.time.length">
			{{item.time}}
		</text>
		<view :class="{'chat-container':true,'chat-location-me':item.isMe}">
			<view class="chat-icon-container">
				<image class="chat-icon" :src="item.icon" mode="aspectFill" />
			</view>
			<view class="chat-content-container">
				<text :class="{'chat-user-name':true,'chat-location-me':item.isMe}">
					{{item.name}}
				</text>
				<view class="chat-text-container-super" :style="[{justifyContent:item.isMe?'flex-end':'flex-start'}]">
					<view :class="{'chat-text-container':true,'chat-text-container-me':item.isMe}">
						<text :class="{'chat-text':true,'chat-text-me':item.isMe}">{{item.content}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	
	const props = defineProps({
		item: {
			type: Object,
			default: () => ({
				time: '',
				icon: '',
				name: '',
				content: '',
				isMe: false
			})
		}
	});
</script>

<style scoped>
	.chat-item {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
	}
	.chat-time {
		padding: 4rpx 0rpx;
		text-align: center;
		font-size: 22rpx;
		color: #aaaaaa;
	}
	.chat-container {
		display: flex;
		flex-direction: row;
	}
	.chat-location-me {
		flex-direction: row-reverse;
		text-align: right;
	}
	.chat-icon-container {
		margin-top: 12rpx;
	}
	.chat-icon{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #eeeeee;
	}
	.chat-content-container {
		margin: 0rpx 15rpx;
	}
	.chat-user-name{
		font-size: 26rpx;
		color: #888888;
	}
	.chat-text-container {
		text-align: left;
		background-color: #f1f1f1;
		border-radius: 8rpx;
		padding: 10rpx 15rpx;
		margin-top: 10rpx;
		/* #ifndef APP-NVUE */
		max-width: 500rpx;
		/* #endif */
	}
	.chat-text-container-me {
		background-color: #007AFF;
	}
	.chat-text-container-super {
		display: flex;
		flex-direction: row;
	}
	.chat-text {
		font-size: 28rpx;
		/* #ifndef APP-NVUE */
		word-break: break-all;
		/* #endif */
		/* #ifdef APP-NVUE */
		max-width: 500rpx;
		/* #endif */
	}
	.chat-text-me {
		color: white;
	}
</style>