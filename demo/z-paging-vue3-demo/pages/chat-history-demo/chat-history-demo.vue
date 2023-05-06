<!-- 聊天记录模式演示(vue)，vue中目前无法解决分页闪动问题，使用nvue可实现聊天记录无闪动分页 -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" use-page-scroll use-chat-record-mode @query="queryList">
			<!-- 聊天item -->
			<view :id="`z-paging-${index}`" v-for="(item,index) in dataList" :key="index">
				<chat-item :item="item"></chat-item>
			</view>
			
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<chat-input-bar @send="doSend" />
			</template>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll } from '@dcloudio/uni-app';
	import request from '/http/request.js';
	
    const paging = ref(null);
	//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
    let dataList = ref([]);
	
	onPageScroll((e) => {
		//如果滚动到顶部，触发加载更多聊天记录
		if (e.scrollTop < 10) {
			paging.value.doChatRecordLoadMore();
		}
	})
	
	
	// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.reload()即可
    const queryList = (pageNo, pageSize) => {
		//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
		//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
		//模拟请求服务器获取分页数据，请替换成自己的网络请求
		const params = {
			pageNo: pageNo,
			pageSize: pageSize
		}
		request.queryChatList(params).then(res => {
			//将请求的结果数组传递给z-paging
			paging.value.complete(res.data.list);
		}).catch(res => {
			//如果请求失败写paging.value.complete(false);
			//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			paging.value.complete(false);
		})
    }
	
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
