<!-- 自定义的点击返回顶部view -->
<template>
	<view class="back-to-top">
		<view v-if="type===1" class="container">
			<text class="count-text">{{current}}</text>
			<text class="line"></text>
			<text class="count-text">{{total}}</text>
		</view>
		<view v-else class="container">
			<image class="back-img"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAdFQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2O4//QAAAJp0Uk5TADym1zsBi5WcApiblJd1chL08xFXVXNhXh78+xwItYyNYMLt6LNERbbv9splA3dTKFFrb1k1GLKP3eyjM9yOHQ+R+P6uIyTV2ik2XeP6PeYZxOUQvIRLFc85aTS0gMPrN1TOmWLB3vkn6TL1k8bIOP2qVod4LcdDsNnFBg5mT7suE824F+TgTn4LLHyrDCptbJ5bBNh7zJ/LogIavjEAAAABYktHRACIBR1IAAAACXBIWXMAAABIAAAASABGyWs+AAAD40lEQVR42u3c+1cMYRzH8alMbDcVlaxCF9kKle42upA2uXVBWCJJQpFbSO733CLMX8sRO7vbzOw8M9+deZ76vH+r88x3v69229PZMydJQgghhBBCCCGE0MosITEpKXGV21vYTk5W/pYsu72JTcdq5V9rPG7vQuMQWxLuEFkS6RBXEu0QVbLUIaZEyyGiRNshnkTPIZpE3yGWxMghkkROidw8JfprQf7uin4+Uj1ymojPyVLHn+8JKNFyiCjRdogn0XOIJtF3iCUxcogkMXaII4neM9XDfoKHzGwpgsTcjvxLzG7Iu8T8fnxLWLbjWcK2G78S1s14lbDvxafEylY8SqztxJ/E6ka8Sazvw5fEzjY8Seztwo/E7ia8SOzvwYeEYgseJHJ65A7plj4HpZliqwyaDaIla512ZGYR/SSjJNnrHIasJ3tFRElyHIbk0r2yIyVOv7byCH9DIyQbHIbkbyR8pwmTeDc5DJHS6RzhkjSnHVJB4eIjbyZ555e3LE4rLHAcInm2FhWXlG6jGle23VdeUbnDeQdCCCGEEEIIIYQQQgghhBBCCCG0EttpsV0GM6uqawyv3V1bZ3xnQL2pFWqqq8KuUSzWoLdEfmOTicub99QZQPxmt2jZuy9OkNa2dpMDOvYfsA9RlPa21nhAOg8yjCguI4AoSleAHtLtY5rhPUQBUXx11JD6HsYhh49QQJSjx2gh8nHmKb19FBClnxaSY2HMAAlEOUEJ8bD8ov8v+yQJ5JRMCBm0NOc0CUQ5QwgZsDTnLA0kKPm1U48UaR/oXPLo59RrztcM+Q26cFE9mhUDMqw7pftSr3psRNLJ6Eev0+XQJaNXYhzNHFPna71vhUGCBmOuekPHWggh4+qTGPPsNXV+wDpEuh46Nk4IYbkkqB7224A0qOcAAQQQQAABBBBAACGG3AgdyxYaMjEZOtbFPeRmjl63psrVY/3cQ0x2e7lA7iwTyF2SrTiA3FsmkPs0W7kOme7TfySRID1VRFu5DHlQT7WVq5DmjIdkW7kH8Y7kPiLcKq6Q0hm9Kh9PtNJuFVdIMOYsQAABBBBAAAEEEEAAAQQQ9caQ2Zhnp9T5T7iDqPfq+J7GOBp+06DWRwfuQp6p1zx/YXiyb1g96tW6J9tdSNh2ivKySb9Xk2EHK7RGuQt5rVjpDX+Qt2x3Ly/W8Y4/iPTeAuSD5iSXIXMlzA7vRx4hUsIoK+ST9iC3IdJnRscXnTmuQ6Sv5SyO4XluIdLgN9OMsVrdKRxApPm8aXOM73P6QwghC6Eama8N5P4o/Llg0Oyv4JDhf4gPqGdnbEIQQgghhBBCCCHkbr8BqZN4jjCZ2DwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDctMjFUMjA6Mjg6MjcrMDg6MDDDPaSrAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA3LTIxVDIwOjI4OjI3KzA4OjAwsmAcFwAAAE90RVh0c3ZnOmJhc2UtdXJpAGZpbGU6Ly8vaG9tZS9hZG1pbi9pY29uLWZvbnQvdG1wL2ljb25fYWZpM2l4dDdrdDgvZmFuaHVpZGluZ2J1LnN2Z/j46+sAAAAASUVORK5CYII=">
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 当前加载了几页
			current: {
				type: Number,
				default: function() {
					return 0;
				},
			},
			// 一共有多少页可以加载
			total: {
				type: Number,
				default: function() {
					return 0;
				},
			},
		},
		data() {
			return {
				//0 返回返回顶部图片 1显示current/total
				type: 0,
				//当前定时器
				timeout: null
			};
		},
		methods: {
			isScroll() {
				//如果页面正在滚动，则显示current/total
				if (this.type === 0) {
					this.type = 1;
					this.timeout = setTimeout(() => {
						//过1秒之后，显示返回顶部图片
						this.type = 0;
					}, 1000);
				} else {
					if (this.timeout) {
						//如果在1秒内，又触发了滚动事件，则清空定时器，重新计算时间
						clearTimeout(this.timeout);
						this.timeout = setTimeout(() => {
							this.type = 0;
						}, 1000);
					}
				}
			}
		}
	}
</script>

<style scoped>
	.back-to-top {
		/* 这里请设置100%填充满返回顶部按钮 */
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: white;
		border-radius: 50%;
		background-color: white;
		box-shadow: 0 0 20rpx #cccccc;
		background-color: white;

	}

	.container {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.count-text {
		font-size: 24rpx;
		color: #555555;
		font-weight: bold;
	}

	.line {
		width: 55rpx;
		height: 1rpx;
		background-color: #dedede;
	}

	.back-img {
		width: 50rpx;
		height: 50rpx;
	}
</style>
