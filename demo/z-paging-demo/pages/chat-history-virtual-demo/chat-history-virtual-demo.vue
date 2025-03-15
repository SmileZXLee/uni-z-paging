<!-- 聊天记录模式+虚拟列表演示(vue)，加载更多聊天记录无闪动&支持渲染大量数据 -->
<!-- 注意：虚拟列表缓存高度默认仅在cell初始化时获取一次，若您的聊天列表中带有图片，强烈建议给图片一个固定的高度，如果高度根据内容动态撑高，可能导致虚拟列表抖动 -->
<!-- 如果必须实现高度根据内容动态撑高+虚拟列表功能，可监听图片加载完毕事件，并在其中调用z-paging的didUpdateVirtualListCell刷新缓存高度 -->

<!-- 注意此demo为聊天记录模式+内置虚拟列表模式，在微信小程序一些平台此虚拟列表会有问题，请自行参考虚拟列表在不同平台兼容性进行更改 -->
<template>
	<view class="content">
		<!-- use-chat-record-mode：开启聊天记录模式 -->
		<!-- use-virtual-list：开启虚拟列表模式 -->
		<!-- cell-height-mode：设置虚拟列表模式高度不固定 -->
		<!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<z-paging ref="paging" v-model="dataList" use-chat-record-mode use-virtual-list cell-height-mode="dynamic" safe-area-inset-bottom bottom-bg-color="#f8f8f8"
		
		@query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard">
			<!-- 顶部提示文字 -->
			<template #top>
				<view class="header">聊天记录总条数：10万条</view>
			</template>
			
			<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置！！！ -->
			<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
			<template #cell="{item,index}">
				<view style="transform: scaleY(-1)">
					<chat-item :item="item"></chat-item>
				</view>
			</template>
			
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<chat-input-bar ref="inputBar" @send="doSend" />
			</template>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: []
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
				this.$request.queryChatListLong(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
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
				uni.showLoading({
					title: '发送中...'
				})
				setTimeout(()=>{
					uni.hideLoading();
					this.$refs.paging.addChatRecordData([{
						time: '',
						icon: '/static/daxiong.jpg',
						name: '大雄',
						content: msg,
						isMe: true
					}]);
				},500)
			}
		}
	}
</script>

<style scoped>
	.header{
		background-color: red;
		font-size: 24rpx;
		text-align: center;
		padding: 20rpx 0rpx;
		color: white;
	}
</style>
