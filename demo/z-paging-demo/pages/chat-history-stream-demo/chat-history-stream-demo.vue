<!-- 聊天记录模式流式输出-类似chatGPT对话演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
	<view class="content">
		<!-- use-chat-record-mode：开启聊天记录模式 -->
		<!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<z-paging ref="paging" v-model="dataList" use-chat-record-mode safe-area-inset-bottom bottom-bg-color="#f8f8f8" empty-view-text="有什么可以帮忙的？"
		@query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard">
			<!-- 顶部提示文字 -->
			<!-- #ifdef H5 || MP-BAIDU || MP-TOUTIAO -->
			<template #top>
				<view class="header">由于在H5、百度小程序、抖音小程序、飞书小程序中无法监听键盘高度变化，底部输入框切换时可能会有些bug，请运行在其他平台体验最佳效果</view>
			</template>
			<!-- #endif -->
			
			<!-- for循环渲染聊天记录列表 -->
			<view v-for="(item,index) in dataList" :key="index" style="position: relative;">
				<!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
				<!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->
				
				<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
				<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
				<view style="transform: scaleY(-1);">
					<chat-item :item="item"></chat-item>
				</view>
			</view>
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<chat-input-bar :disabled="isAnswering" ref="inputBar" @send="doSend" />
			</template>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				// 用户发送的提问信息
				askMsg: '',
				// 是否在回答中，回答中不允许用户发言，避免数据错乱
				isAnswering: false,
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
				}
				this.$request.queryChatList(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete([]);
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
			keyboardHeightChange(res) {
				this.$refs.inputBar.updateKeyboardHeightChange(res);
			}, 
			// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
			hidedKeyboard() {
				this.$refs.inputBar.hidedKeyboard();
			},
			// 发送新消息
			doSend(msg) {
				if (this.isAnswering) {
					// 如果在回答中，不允许发送新的消息，避免数据错乱
					return;
				}
				this.askMsg = msg;
				this.$refs.paging.addChatRecordData({
					time: '',
					icon: '/static/daxiong.jpg',
					name: '大雄',
					content: msg,
					isMe: true
				});
				// 在用户发送新消息之后，开始回复消息
				this.doAnswer();
			},
			// 回复消息
			doAnswer() {
				// 设置在回复中
				this.isAnswering = true;
				// 立刻添加一个思考中的回复
				this.$refs.paging.addChatRecordData({
					time: '',
					icon: '/static/duola.jpg',
					name: '哆啦A梦',
					content: '思考中...',
					isMe: false
				});
				
				// 延迟500毫秒，模拟网络请求的情况
				setTimeout(() => {
					// 完整的回复字符串，这里直接重复用户提问的内容
					const totalAnswerStr = `你发送了：${this.askMsg}`;
					// 当前显示回复的字符串
					let currentAnswerStr = '';
					this.streamTextAsync(totalAnswerStr, (char) => {
						currentAnswerStr += char;
						// 获取最后一条数据，也就是上面思考中这条数据，然后更新这条数据
						this.dataList[0].content = currentAnswerStr;
						// 这里是判断当前显示回复的字符串长度等于完整的回复字符串长度，也就是回答结束了，将回答中状态设置为false
						if (currentAnswerStr.length === totalAnswerStr.length) {
							this.isAnswering = false;
						}
					})
				}, 800)
			},
			// 模拟生成流式数据，根据一个已知字符串每150毫秒返回一个字符
			async streamTextAsync(text, callback, interval = 150) {
			    for (const char of text) {
			        callback(char); // 逐个返回字符
			        await new Promise(resolve => setTimeout(resolve, interval)); // 等待
			    }
			}
		}
	}
</script>

<style scoped>
	.header{
		background-color: red;
		font-size: 20rpx;
		padding: 20rpx;
		color: white;
	}
	.popup {
		position: absolute;
		top: -20px;
		height: 200rpx;
		width: 400rpx;
		background-color: red;
		z-index: 1000;
	}
</style>
