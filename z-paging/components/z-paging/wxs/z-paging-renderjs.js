// [z-paging]使用renderjs在app-vue和h5中对touchmove事件冒泡进行处理

import u from '../js/z-paging-utils'
const data = {
	startY: 0,
	isTouchFromZPaging: false,
	isUsePageScroll: false,
	isReachedTop: true,
	isIosAndH5: false,
	useChatRecordMode: false,
	appLaunched: false
}

export default {
	mounted() {
		if (window) {
			this._handleTouch();
			// #ifdef APP-VUE
			this.$ownerInstance.callMethod('_handlePageLaunch');
			// #endif
		}
	},
	methods: {
		// 接收逻辑层发送的数据（是否是ios+h5）
		renderPropIsIosAndH5Change(newVal) {
			if (newVal === -1) return;
			data.isIosAndH5 = newVal;
		},

		// 拦截处理touch事件
		_handleTouch() {
			if (!window.$zPagingRenderJsInited) {
				window.$zPagingRenderJsInited = true;
				window.addEventListener('touchstart', this._handleTouchstart, { passive: true })
				window.addEventListener('touchmove', this._handleTouchmove, { passive: false })
			}
		},
		// 处理touch开始
		_handleTouchstart(e) {
			const touch = u.getTouch(e);
			data.startY = touch.touchY;
			const touchResult = u.getTouchFromZPaging(e.target);
			data.isTouchFromZPaging = touchResult.isFromZp;
			data.isUsePageScroll = touchResult.isPageScroll;
			data.isReachedTop = touchResult.isReachedTop;
			data.useChatRecordMode = touchResult.isUseChatRecordMode;
		},
		// 处理touch中
		_handleTouchmove(e) {
			const touch = u.getTouch(e);
			const moveY = touch.touchY - data.startY;
			// 如果是在z-paging内触摸并且（是在顶部位置且是下拉的情况下（或不是聊天记录滚动模式并且在iOS+h5+scroll-view并且是往上拉的情况：避免在此平台中滚动到底部后上拉有个系统灰色遮罩导致列表被短暂锁定的问题））
			// (data.useChatRecordMode ? moveY < 0 : moveY > 0)是为了判断是否是上拉的情况，聊天记录模式列表倒置，因此moveY < 0为上拉
			if (data.isTouchFromZPaging && ((data.isReachedTop && (data.useChatRecordMode ? moveY < 0 : moveY > 0)) || (!data.useChatRecordMode && data.isIosAndH5 && !data.isUsePageScroll && moveY < 0))) {
				if (e.cancelable && !e.defaultPrevented) {
					// 阻止事件冒泡，以避免在一些平台中下拉刷新时整个page跟着一起下拉&在iOS+h5+scroll-view中在底部上拉有个系统灰色遮罩导致列表被短暂锁定的问题
					e.preventDefault();
				}
			}
		},
		// 移除touch相关事件监听
		_removeAllEventListener(){
			window.removeEventListener('touchstart');
			window.removeEventListener('touchmove');
		}
	}
};
