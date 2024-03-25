<!-- 虚拟列表演示(兼容写法)(vue) -->
<!-- 使用虚拟列表兼容写法时必须手动在z-paging的源代码z-paging.vue中搜索zp-public-virtual-cell并打开相关注释 -->
<!-- 写法麻烦，而且需要手动修改z-paging源码，所有渲染cell写在相同组件内，不易维护，在vue2中兼容性很好，但非必须不建议使用 -->
<!-- 在各平台兼容性请查阅https://z-paging.zxlee.cn/module/virtual-list.html -->
<template>
	<view class="content">
		<!-- 如果页面中的cell高度是固定不变的，则不需要设置cell-height-mode，如果页面中高度是动态改变的，则设置cell-height-mode="dynamic" -->
		<z-paging ref="paging" use-virtual-list use-compatibility-mode :extra-data="extraData" :cell-height-mode="tabIndex===0?'fixed':'dynamic'" 
			@query="queryList" @innerCellClick="innerCellClick">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<template #top>
				<view class="header">列表总数据量：10万条</view>
				<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
				<z-tabs :list="tabList" @change="tabChange" />
			</template>
			
			<!-- 以下内容极为重要！！！！！！！！ -->
			<!-- cell中的内容必须写在zp-public-virtual-cell.vue文件中，必须在项目的components目录下创建名为zp-public-virtual-cell的组件 -->
			
			
			<!-- 放在所有cell上方的用slot="header"插入，放在所有cell下方的用slot="footer"插入 -->
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: ['cell高度相同','cell高度不同'],
				tabIndex: 0,
				extraData: {
					// 给这个页面的虚拟列表取一个名字，这样在zp-virtual-cell中可以根据这个名字来区分不同页面的cell
					id: 'test1',
					// 这边可以附加其他的当前页面需要传给cell的值
					
					// 这里示范了通过props传递方法回调来代替cell组件内部emit的场景，如果需要监听点击cell可以直接通过@innerCellClick监听
					titleClickedCallback: (title) => {
						// 点击了标题
						console.log('点击了标题' + title)
					}
				}
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				// 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					random: this.tabIndex === 1
				}
				this.$request.queryListLong(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			// 内置列表cell被点击时触发，会自动带两个参数：item和index过来
			innerCellClick(item, index){
				console.log('点击了' + item.title)
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
