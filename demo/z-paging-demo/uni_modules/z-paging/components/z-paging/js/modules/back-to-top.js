// [z-paging]点击返回顶部view模块
import u from '.././z-paging-utils'

export default {
	props: {
		// 自动显示点击返回顶部按钮，默认为否
		autoShowBackToTop: {
			type: Boolean,
			default: u.gc('autoShowBackToTop', false)
		},
		// 点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为400rpx
		backToTopThreshold: {
			type: [Number, String],
			default: u.gc('backToTopThreshold', '400rpx')
		},
		// 点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
		backToTopImg: {
			type: String,
			default: u.gc('backToTopImg', '')
		},
		// 点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
		backToTopWithAnimate: {
			type: Boolean,
			default: u.gc('backToTopWithAnimate', true)
		},
		// 点击返回顶部按钮与底部的距离，注意添加单位px或rpx，默认为160rpx
		backToTopBottom: {
			type: [Number, String],
			default: u.gc('backToTopBottom', '160rpx')
		},
		// 点击返回顶部按钮的自定义样式
		backToTopStyle: {
			type: Object,
			default: u.gc('backToTopStyle', {}),
		},
		// iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为是
		enableBackToTop: {
			type: Boolean,
			default: u.gc('enableBackToTop', true)
		},
	},
	data() {
		return {
			// 点击返回顶部的class
			backToTopClass: 'zp-back-to-top zp-back-to-top-hide',
			// 上次点击返回顶部的时间
			lastBackToTopShowTime: 0,
			// 点击返回顶部显示的class是否在展示中，使得按钮展示/隐藏过度效果更自然
			showBackToTopClass: false,
		}
	},
	computed: {
		backToTopThresholdUnitConverted() {
			return u.addUnit(this.backToTopThreshold, this.unit);
		},
		backToTopBottomUnitConverted() {
			return u.addUnit(this.backToTopBottom, this.unit);
		},
		finalEnableBackToTop() {
			return this.usePageScroll ? false : this.enableBackToTop;
		},
		finalBackToTopThreshold() {
			return u.convertToPx(this.backToTopThresholdUnitConverted);
		},
		finalBackToTopStyle() {
			const backToTopStyle = this.backToTopStyle;
			if (!backToTopStyle.bottom) {
				backToTopStyle.bottom = this.windowBottom + u.convertToPx(this.backToTopBottomUnitConverted) + 'px';
			}
			if(!backToTopStyle.position){
				backToTopStyle.position = this.usePageScroll ? 'fixed': 'absolute';
			}
			return backToTopStyle;
		},
		finalBackToTopClass() {
			return `${this.backToTopClass} zp-back-to-top-${this.unit}`;
		}
	},
	methods: {
		// 点击了返回顶部
		_backToTopClick() {
			let callbacked = false;
			this.$emit('backToTopClick', toTop => {
				(toTop === undefined || toTop === true) && this._handleToTop();
				callbacked = true;
			});
			// 如果用户没有禁止默认的返回顶部事件，则触发滚动到顶部
			this.$nextTick(() => {
				!callbacked && this._handleToTop();
			})
		},
		// 处理滚动到顶部（聊天记录模式中为滚动到底部）
		_handleToTop() {
			!this.backToTopWithAnimate && this._checkShouldShowBackToTop(0);
			!this.useChatRecordMode ? this.scrollToTop(this.backToTopWithAnimate) : this.scrollToBottom(this.backToTopWithAnimate);
		},
		// 判断是否要显示返回顶部按钮
		_checkShouldShowBackToTop(scrollTop) {
			if (!this.autoShowBackToTop) {
				this.showBackToTopClass = false;
				return;
			}
			if (scrollTop > this.finalBackToTopThreshold) {
				if (!this.showBackToTopClass) {
					// 记录当前点击返回顶部按钮显示的class生效了
					this.showBackToTopClass = true;
					this.lastBackToTopShowTime = new Date().getTime();
					// 当滚动到需要展示返回顶部的阈值内，则延迟300毫秒展示返回到顶部按钮
					u.delay(() => {
						this.backToTopClass = 'zp-back-to-top zp-back-to-top-show';
					}, 300)
				}
			} else {
				// 如果当前点击返回顶部按钮显示的class是生效状态并且滚动小于触发阈值，则隐藏返回顶部按钮
				if (this.showBackToTopClass) {
					this.backToTopClass = 'zp-back-to-top zp-back-to-top-hide';
					u.delay(() => {
						this.showBackToTopClass = false;
					}, new Date().getTime() - this.lastBackToTopShowTime < 500 ? 0 : 300)
				}
			}
		},
	}
}

