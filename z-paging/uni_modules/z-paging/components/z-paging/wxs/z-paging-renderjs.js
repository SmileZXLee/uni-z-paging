// [z-paging]使用renderjs在app-vue和h5中对touchmove事件冒泡进行处理

import u from '../js/z-paging-utils'
const data = {
	startY: 0,
	isTouchFromZPaging: false,
	isUsePageScroll: false,
	isReachedTop: true,
	isIosAndH5: false
}

export default {
	mounted() {
		this._handleTouch();
		// #ifdef APP-VUE
		this.$ownerInstance && this.$ownerInstance.callMethod('_checkVirtualListScroll');
		// #endif
	},
	methods: {
		//接收逻辑层发送的数据
		renderPropIsIosAndH5Change(newVal) {
			if (newVal === -1) return;
			data.isIosAndH5 = newVal;
		},
		//拦截处理touch事件
		_handleTouch() {
			if (window && !window.$zPagingRenderJsInited) {
				window.$zPagingRenderJsInited = true;
				window.addEventListener('touchstart', this._handleTouchstart, { passive: true })
				window.addEventListener('touchmove', this._handleTouchmove, { passive: false })
			}
		},
		_handleTouchstart(e) {
			const touch = u.getTouch(e);
			data.startY = touch.touchY;
			const touchResult = u.getTouchFromZPaging(e.target);
			data.isTouchFromZPaging = touchResult.isFromZp;
			data.isUsePageScroll = touchResult.isPageScroll;
			data.isReachedTop = touchResult.isReachedTop;
		},
		_handleTouchmove(e) {
			const touch = u.getTouch(e);
			const moveY = touch.touchY - data.startY;
			if (data.isTouchFromZPaging && ((data.isReachedTop && moveY > 0)  || (data.isIosAndH5 && !data.isUsePageScroll && moveY < 0))) {
				if (e.cancelable && !e.defaultPrevented) {
					e.preventDefault();
				}
			}
		},
		_removeAllEventListener(){
			window.removeEventListener('touchstart');
			window.removeEventListener('touchmove');
		}
	}
};
