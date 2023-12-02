<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<!-- 如果当前页已经加载过数据或者当前切换到的tab是当前页，才展示当前页数据（懒加载） -->
		<z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" :fixed="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import request from '/http/request.js';

	const paging = ref(null);
	const dataList = ref([]);
	//当前组件是否已经加载过了
	const firstLoaded = ref(false);
	//是否滚动到当前页
	const isCurrentPage = ref(false);

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
			//懒加载，当滑动到当前的item时，才去加载
			if (!firstLoaded.value) {
				// 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
				setTimeout(() => {
					isCurrentPage.value = true;
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

<style>
	/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
	.content {
		height: 100%;
	}

	.item {
		position: relative;
		height: 150rpx;
		display: flex;
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
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>