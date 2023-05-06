<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在nvue上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging ref="paging" class="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false">
			<!-- 在nvue中，z-paging中插入的列表item必须是cell，必须使用cell包住，因为在nvue中，z-paging使用的是nvue的list组件。 -->
			<!-- 不能使用index作为key的唯一标识，:key必须添加并且必须是唯一的 -->
			<!-- 如果希望在vue中渲染view，nvue中渲染cell，可使用z-paging-cell代替cell -->
			<cell class="item" v-for="(item,index) in dataList" :key="item.title">
				<text class="item-title">{{item.title}}</text>
				<text class="item-detail">{{item.detail}}</text>
				<view class="item-line"></view>
			</cell>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import request from '/http/request.js';

	const paging = ref(null);
	const dataList = ref([]);
	const firstLoaded = ref(false);

	const props = defineProps({
		tabIndex: {
			type: Number,
			default: 0
		},
		currentIndex: {
			type: Number,
			default: 0
		}
	});

	watch(() => props.currentIndex, (newVal) => {
		if (newVal === props.tabIndex) {
			if (!firstLoaded.value) {
				setTimeout(() => {
					paging.value.reload();
				}, 100);
			}
		}
	}, {
		immediate: true
	});

	const queryList = (pageNo, pageSize) => {
		const params = {
			pageNo: pageNo,
			pageSize: pageSize,
			type: props.tabIndex + 1
		};

		request.queryList(params).then(res => {
			paging.value.complete(res.data.list);
			firstLoaded.value = true;
		}).catch(res => {
			paging.value.complete(false);
		});
	};
	
</script>

<style scoped>
	.content {
		flex: 1;
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}
	
	.paging{
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}
	
	.item {
		flex-direction: row;
		position: relative;
		height: 150rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #eeeeee;
	}
</style>
