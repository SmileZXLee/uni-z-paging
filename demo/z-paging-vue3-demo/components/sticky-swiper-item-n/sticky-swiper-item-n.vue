<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- :auto="false" 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!-- :fixed="false" 设置z-paging不铺满全屏，使用局部滚动-->
		<!-- :auto-clean-list-when-reload="false" reload时不自动清空list，用于页面中父组件触发此组件reload方法时，不清空原list-->
		<z-paging class="list" ref="paging" v-model="dataList" @query="queryList" :fixed="false" :auto="false" :auto-clean-list-when-reload="false">
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
	

	const paging = ref(null);
	
	const dataList = ref([]);
	const firstLoaded = ref(false);
	const completeFunc = ref(null);
	

	watch(() => props.currentIndex, (newVal) => {
		if (newVal === props.tabIndex) {
			if (!firstLoaded.value) {
				setTimeout(() => {
					paging.value.reload();
				}, 100)
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
			//将请求的结果数组传递给z-paging
			paging.value.complete(res.data.list);
			firstLoaded.value = true;
			// 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
			if (completeFunc.value) {
				completeFunc.value();
			}
		}).catch(res => {
			// 如果请求失败写paging.value.complete(false);
			// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
			// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
			paging.value.complete(false);
			// 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
			if (completeFunc.value) {
				completeFunc.value();
			}
		});
	}
	
	// 父组件下拉刷新了，通知子组件，子组件调用内部z-paging的reload方法，这里的参数func代表下拉刷新结束的回调函数
	const reload = (func) => {
		// 先把父组件下拉刷新的回调函数存起来
		completeFunc.value = func;
		// 调用z-paging的reload方法
		paging.value.reload();
	}
	
	// 设置嵌套list父容器支持swiper-list吸顶滚动效果
	const setSpecialEffects = (height) => {
		paging.value.setSpecialEffects({
			// 这个id就是sticky-swiper-demo-n中设置的nvue-list-id，二者的值必须完全一致！
			id: 'z-paging-nlist',
			headerHeight: height
		});
	}
	
	defineExpose({ reload, setSpecialEffects });
</script>

<style scoped>
	.content {
		flex: 1;
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
