// [z-paging]聊天记录模式模块
import u from '.././z-paging-utils'

export default {
	props: {
		// 使用聊天记录模式，默认为否
		useChatRecordMode: {
			type: Boolean,
			default: u.gc('useChatRecordMode', false)
		},
		// 使用聊天记录模式时滚动到顶部后，列表垂直移动偏移距离。默认0rpx。单位px
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
			return this.useChatRecordMode ? { transform: 'scaleY(-1)' } : {};
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
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;
			if (!this.useChatRecordMode) return;
			this.isTotalChangeFromAddData = true;
			this.totalData = [...data, ...this.totalData];
			if (toBottom) {
				u.delay(() => {
					this._scrollToTop(toBottomWithAnimate);
				})
			}
		},
		// 手动触发滚动到顶部加载更多，聊天记录模式时有效
		doChatRecordLoadMore() {
			this.useChatRecordMode && this._onLoadingMore('click');
		}
	}
}
