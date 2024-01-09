// [z-paging]聊天记录模式模块
import u from '.././z-paging-utils'

export default {
	props: {
		// 使用聊天记录模式，默认为否
		useChatRecordMode: {
			type: Boolean,
			default: u.gc('useChatRecordMode', false)
		},
		// 使用聊天记录模式时滚动到顶部后，列表垂直移动偏移距离。默认0rpx。单位px（暂时无效）
		chatRecordMoreOffset: {
			type: [Number, String],
			default: u.gc('chatRecordMoreOffset', '0rpx')
		},
		// 使用聊天记录模式时是否自动隐藏键盘：在用户触摸列表时候自动隐藏键盘，默认为是
		autoHideKeyboardWhenChat: {
			type: Boolean,
			default: u.gc('autoHideKeyboardWhenChat', true)
		},
	},
	data() {
		return {
			// 键盘高度
			keyboardHeight: 0
		}
	},
	computed: {
		finalChatRecordMoreOffset() {
			return u.convertToPx(this.chatRecordMoreOffset);
		},
		// 聊天记录模式旋转180度style
		chatRecordRotateStyle() {
			let cellStyle;
			// 在vue中，直接将列表倒置，因此在vue的cell中，也直接写style="transform: scaleY(-1)"转回来即可。
			// #ifndef APP-NVUE
			cellStyle = this.useChatRecordMode ? { transform: 'scaleY(-1)' } : {};
			// #endif
			
			// 在nvue中，需要考虑数据量不满一页的情况，因为nvue中的list无法通过flex-end修改不满一页的起始位置，会导致不满一页时列表数据从底部开始，因此需要特别判断
			// 当数据不满一屏的时候，不进行列表倒置
			// #ifdef APP-NVUE
			cellStyle = this.useChatRecordMode ? { transform: this.isFirstPageAndNoMore ? 'scaleY(1)' : 'scaleY(-1)' } : {};
			// #endif
			
			this.$emit('update:cellStyle', cellStyle);
			this.$emit('cellStyleChange', cellStyle);
			
			// 在聊天记录模式中，如果列表没有倒置并且当前是第一页，则需要自动滚动到最底部
			this.$nextTick(() => {
				if (this.isFirstPage && this.isChatRecordModeAndNotInversion) {
					this.$nextTick(() => {
						// 这里多次触发滚动到底部是为了避免在某些情况下，即使是在nextTick但是cell未渲染完毕导致滚动到底部位置不正确的问题
						this._scrollToBottom(false);
						u.delay(() => {
							this._scrollToBottom(false);
							u.delay(() => {
								this._scrollToBottom(false);
							}, 50)
						}, 50)
					})
				}
			})
			return cellStyle;
		},
		// 是否是聊天记录列表并且列表未倒置
		isChatRecordModeAndNotInversion() {
			return this.chatRecordRotateStyle && this.chatRecordRotateStyle.transform && this.chatRecordRotateStyle.transform === 'scaleY(1)';
		},
		// 最终的键盘高度
		finalKeyboardHeight() {
			return this.keyboardHeight;
		}
	},
	mounted() {
		// 监听键盘高度变化（H5、百度小程序、抖音小程序、飞书小程序不支持）
		// #ifndef H5 || MP-BAIDU || MP-TOUTIAO
		if (this.useChatRecordMode) {
			uni.onKeyboardHeightChange(res => {
				this.$emit('keyboardHeightChange', res);
				this.keyboardHeight = res.height;
			})
		}
		// #endif
	},
	methods: {
		// 添加聊天记录
		addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
			if (!this.useChatRecordMode) return;
			this.isTotalChangeFromAddData = true;
			this.addDataFromTop(data, toBottom, toBottomWithAnimate);
		},
		// 手动触发滚动到顶部加载更多，聊天记录模式时有效
		doChatRecordLoadMore() {
			this.useChatRecordMode && this._onLoadingMore('click');
		}
	}
}
