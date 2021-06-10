// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// 使用renderjs在app-vue和h5中对touchmove事件冒泡进行处理

import zUtils from '../js/z-paging-utils'
export default {
	data() {
		return {
			renderScrollTop: 0,
			renderUsePageScroll: false,
			startY: 0,
			isTouchFromZPaging: false
		}
	},
	mounted() {
		this._handleTouch();
	},
	methods: {
		//接收逻辑层发送的数据
		renderPropScrollTopChange(newVal, oldVal, ownerVm, vm) {
			this.renderScrollTop = newVal;
		},
		renderUsePageScrollChange(newVal, oldVal, ownerVm, vm) {
			this.renderUsePageScroll = newVal;
		},
		//拦截处理touch事件
		_handleTouch() {
			if (window && !window.$zPagingRenderJsInited) {
				window.$zPagingRenderJsInited = true;
				window.addEventListener('touchstart', this._handleTouchstart, {
					passive: true
				})
				window.addEventListener('touchmove', this._handleTouchmove, {
					passive: false
				})
			}
		},
		_handleTouchstart(e) {
			const touch = zUtils.getCommonTouch(e);
			this.startY = touch.touchY;
			this.isTouchFromZPaging = zUtils.getTouchFromZPaging(e.target);
		},
		_handleTouchmove(e) {
			const touch = zUtils.getCommonTouch(e);
			var moveY = touch.touchY - this.startY;
			if ((this.isTouchFromZPaging && this.renderScrollTop < 1 && moveY > 0) || (this.isTouchFromZPaging && this
					.isIos && !this
					.renderUsePageScroll && moveY <
					0)) {
				if (e.cancelable && !e.defaultPrevented) {
					e.preventDefault();
				}
			}
		},

	}
};
