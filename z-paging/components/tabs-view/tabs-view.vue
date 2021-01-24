<template name="tabs-view">
	<view class="segment">
		<view class="segment-item" v-for="(title,index) in items" :key="index" :style="{width:itemWidth}" @click="itemClick(index)">
			<view class="title-container">
				<view class="title" :style="{color:currentIndex===index?'#007AFF':'darkgray'}">{{title}}</view>
			</view>
			<view class="line" :style="{'background-color':currentIndex===index?'#007AFF':'white'}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tabs-view',
		data() {
			return {
				currentIndex: 0
			};
		},
		props:{
			items: {
				type: Array,
				default: function(){
					return []
				}
			}
		},
		computed:{
			itemWidth(){
				return ((1.0 / this.items.length) * 100) + '%';
			}
		},
		methods:{
			itemClick(index){
				if(this.currentIndex != index){
					this.$emit('change',index);
				}
				this.currentIndex = index;
			}
		}
	}
</script>

<style scoped>
	.segment-control{
		
	}
	.segment{
		height: 100%;
		height: 80rpx;
		display: flex;
		font-size: 30rpx;
		color: darkgray;
		border-bottom: #eeeeee solid 1px;
	}
	.segment-item{
		height: 100%;
	}
	.title-container{
		width: 100%;
		height: calc(100% - 2px);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.title{
		width: 100%;
	}
	.line{
		height: 2px;
		width: 70%;
		margin-left: 15%;
	}
</style>
