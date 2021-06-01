// z-paging
// github地址:https://github.com/SmileZXLee/uni-z-paging
// dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935
// 反馈QQ群：790460711
// 使用renderjs在app-vue和h5中对touchmove事件冒泡进行处理

export default {
	data() {
		return {
			newScrollTop: 0,
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
			this.newScrollTop = newVal;
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
			const touch = this._getCommonTouch(e);
			this.startY = touch.touchY;
			this.isTouchFromZPaging = this.getTouchFromZPaging(e.target);
		},
		_handleTouchmove(e) {
			const touch = this._getCommonTouch(e);
			var moveY = touch.touchY - this.startY;
			if (this.isTouchFromZPaging && this.newScrollTop < 1 && moveY > 0) {
				if (e.cancelable && !e.defaultPrevented) {
					e.preventDefault();
				}
			}
		},
		//获取最终的touch位置
		_getCommonTouch(e) {
			let touch = null;
			if (e.touches && e.touches.length) {
				touch = e.touches[0];
			} else if (e.changedTouches && e.changedTouches.length) {
				touch = e.changedTouches[0];
			} else if (e.datail && e.datail !== {}) {
				touch = e.datail;
			} else {
				return {
					touchX: 0,
					touchY: 0
				}
			}
			return {
				touchX: touch.clientX,
				touchY: touch.clientY
			};
		},
		//判断当前手势是否在z-paging内触发
		getTouchFromZPaging(target) {
			if (target && target.tagName && target.tagName !== 'BODY' && target.tagName !== 'UNI-PAGE-BODY') {
				var classList = target.classList;
				if (classList && classList.contains('zp-paging-touch-view')) {
					return true;
				} else {
					return this.getTouchFromZPaging(target.parentNode);
				}
			} else {
				return false;
			}
		}
	}
};
