// [z-paging]虚拟列表实现模块（todo）
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'

const ZPVirtualList = {
	props: {
		//是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: u.gc('useVirtualList', false)
		},
		//是否在z-paging内部循环渲染列表，默认为否。若use-virtual-list为true，则此项恒为true
		useInnerList: {
			type: Boolean,
			default: u.gc('useInnerList', false)
		},
		//innerList样式
		innerListStyle: {
			type: Object,
			default: function() {
				return u.gc('innerListStyle', {});
			}
		},
		//列表for循环的key，若不定义默认使用for循环的index
		listKey: {
			type: String,
			default: u.gc('listKey', null)
		},
		//预加载的列表可视范围(列表高度)页数，默认为7，即预加载当前页及上下各7页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
		preloadPage: {
			type: [Number, String],
			default: u.gc('preloadPage', 7),
			validator: (value) => {
				if (value <= 0) u.consoleErr('preload-page必须大于0！');
				return value > 0;
			}
		},
		//虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算
		cellHeightMode: {
			type: String,
			default: u.gc('cellHeight', 'fixed')
		}
	},
	data() {
		return {
			virtualPlaceholderTopHeight: 0,
			virtualPlaceholderBottomHeight: 0,
			virtualPageHeight: 0,
			virtualCellHeight: 0,

			virtualTopRangeIndex: 0,
			virtualBottomRangeIndex: 0,
			virtualListKey: u.getInstanceId(),
			virtualList: []
		}
	},
	watch: {
		realTotalData(newVal) {
			// #ifndef APP-NVUE
			this.$nextTick(()=>{
				this.finalUseVirtualList && this.isFirstPage && this._updateCellHeight();
				this.finalUseVirtualList && this._updateScroll(this.oldScrollTop);
			})
			// #endif
		}
	},
	computed: {
		finalUseVirtualList() {
			return this.useVirtualList && !this.usePageScroll;
		}
	},
	methods: {
		//初始化虚拟列表
		_virtualListInit() {
			this.$nextTick(() => {
				this._getNodeClientRect('.zp-scroll-view').then(node => {
					if (node && node.length) {
						this.virtualPageHeight = node[0].height;
					}
				});
			})
		},
		//获取第一个cell高度
		_updateCellHeight() {
			this.$nextTick(() => {
				setTimeout(() => {
					this._getNodeClientRect(`#z-paging-cell-id-${0}`).then(node => {
						this.virtualCellHeight = node && node.length ? node[0].height : 0;
						this._updateScroll(this.oldScrollTop);
					});
				}, 100);
			})
		},
		//设置cellItem的index
		_setCellIndex(list){
			let lastItem = null;
			let lastItemIndex = this.realTotalData.length;
			if (this.realTotalData.length) {
				lastItem = this.realTotalData.slice(-1)[0];
			}
			if(lastItem && lastItem[c.virtualListCellIndexKey] !== undefined){
				lastItemIndex = lastItem[c.virtualListCellIndexKey] + 1;
			}
			for (let i = 0; i < list.length; i++) {
				let item = list[i];
				if (!item || Object.prototype.toString.call(item) !== '[object Object]') {
					item = {item};
				}
				item[c.virtualListCellIndexKey] = lastItemIndex  + i;
				list[i] = item;
			}
		},
		
		_updateScroll(scrollTop, scrollDiff) {
			const scrollIndex = parseInt(scrollTop / this.virtualCellHeight);
			this._updateTopRangeIndex(scrollIndex);
			this._updateBottomRangeIndex(scrollIndex);
		},
		_updateTopRangeIndex(scrollIndex) {
			let virtualTopRangeIndex = this.virtualCellHeight === 0 ? 0 : scrollIndex - parseInt(this.virtualPageHeight / this.virtualCellHeight) * this.preloadPage;
			virtualTopRangeIndex = Math.max(0, virtualTopRangeIndex);
			this.virtualTopRangeIndex = virtualTopRangeIndex;
			this.virtualPlaceholderTopHeight = (virtualTopRangeIndex) * this.virtualCellHeight;
		},
		_updateBottomRangeIndex(scrollIndex) {
			let virtualBottomRangeIndex = this.virtualCellHeight === 0 ? 40 : scrollIndex + parseInt(this.virtualPageHeight / this.virtualCellHeight) * (this.preloadPage + 1);
			virtualBottomRangeIndex = Math.min(this.realTotalData.length, virtualBottomRangeIndex);
			this.virtualBottomRangeIndex = virtualBottomRangeIndex;
			this.virtualPlaceholderBottomHeight = (this.realTotalData.length - virtualBottomRangeIndex) * this.virtualCellHeight;
			this.virtualList = this.realTotalData.slice(this.virtualTopRangeIndex,this.virtualBottomRangeIndex + 1);
		},

	}
}

export default ZPVirtualList;
