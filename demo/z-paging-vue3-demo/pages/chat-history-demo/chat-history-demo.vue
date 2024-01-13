<!-- 聊天记录模式演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<template>
	<view class="content">
		<!-- use-chat-record-mode：开启聊天记录模式 -->
		<!-- safe-area-inset-bottom：开启底部安全区域适配 -->
		<!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
		<z-paging ref="paging" v-model="dataList" use-chat-record-mode safe-area-inset-bottom bottom-bg-color="#f8f8f8"
		@query="queryList" @keyboardHeightChange="keyboardHeightChange" @hidedKeyboard="hidedKeyboard">
			<!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置（必须写在for循环标签上，不得写在容器上）！！！ -->
			<!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
			<view v-for="(item,index) in dataList" :key="index" style="transform: scaleY(-1)">
				<chat-item :item="item"></chat-item>
			</view>
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<chat-input-bar ref="inputBar" @send="doSend" />
			</template>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import request from '/http/request.js';
	
    const paging = ref(null);
	const inputBar = ref(null);
	// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
    const dataList = ref([]);
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
    const queryList = (pageNo, pageSize) => {
		// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
		// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
		// 模拟请求服务器获取分页数据，请替换成自己的网络请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize
		}
		request.queryChatList(params).then(res => {
			// 将请求的结果数组传递给z-paging
			paging.value.complete(res.data.list);
		}).catch(res => {
			// 如果请求失败写paging.value.complete(false);
			// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			paging.value.complete(false);
		})
    }
	
	// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
	const keyboardHeightChange = (res) => {
		inputBar.value.updateKeyboardHeightChange(res);
	}
	
	// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
	const hidedKeyboard = () => {
		inputBar.value.hidedKeyboard();
	}
	
	// 发送新消息
	const doSend = (msg) => {
		uni.showLoading({
			title: '发送中...'
		})
		setTimeout(()=>{
			uni.hideLoading();
			paging.value.addChatRecordData({
				time: '',
				icon: '/static/daxiong.jpg',
				name: '大雄',
				content: msg,
				isMe: true
			});
		},500)
	}
</script>

<style>
	
</style>
