// [z-paging]虚拟列表模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'

export default {
	props: {
		//是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: u.gc('useVirtualList', false)
		},
		//在使用虚拟列表时，是否使用兼容模式，默认为否
		useCompatibilityMode: {
			type: Boolean,
			default: u.gc('useCompatibilityMode', false)
		},
		//使用兼容模式时传递的附加数据
		extraData: {
			type: Object,
			default: function() {
				return u.gc('extraData', {});
			}
		},
		//是否在z-paging内部循环渲染列表(内置列表)，默认为否。若use-virtual-list为true，则此项恒为true
		useInnerList: {
			type: Boolean,
			default: u.gc('useInnerList', false)
		},
		//强制关闭inner-list，默认为false，如果为true将强制关闭innerList，适用于开启了虚拟列表后需要强制关闭inner-list的情况
		forceCloseInnerList: {
			type: Boolean,
			default: u.gc('forceCloseInnerList', false)
		},
		//内置列表cell的key名称，仅nvue有效，在nvue中开启use-inner-list时必须填此项
		cellKeyName: {
			type: String,
			default: u.gc('cellKeyName', '')
		},
		//innerList样式
		innerListStyle: {
			type: Object,
			default: function() {
				return u.gc('innerListStyle', {});
			}
		},
		//innerCell样式
		innerCellStyle: {
			type: Object,
			default: function() {
				return u.gc('innerCellStyle', {});
			}
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
		//虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
		cellHeightMode: {
			type: String,
			default: u.gc('cellHeightMode', Enum.CellHeightMode.Fixed)
		},
		//虚拟列表列数，默认为1。常用于每行有多列的情况，例如每行有2列数据，需要将此值设置为2
		virtualListCol: {
			type: [Number, String],
			default: u.gc('virtualListCol', 1)
		},
		//虚拟列表scroll取样帧率，默认为80，过低容易出现白屏问题，过高容易出现卡顿问题
		virtualScrollFps: {
			type: [Number, String],
			default: u.gc('virtualScrollFps', 80)
		},
	},
	data() {
		return {
			virtualListKey: u.getInstanceId(),
			virtualPageHeight: 0,
			virtualCellHeight: 0,
			virtualScrollTimeStamp: 0,
			
			virtualList: [],
			virtualPlaceholderTopHeight: 0,
			virtualPlaceholderBottomHeight: 0,
			virtualTopRangeIndex: 0,
			virtualBottomRangeIndex: 0,
			lastVirtualTopRangeIndex: 0,
			lastVirtualBottomRangeIndex: 0,
			
			virtualHeightCacheList: [],
			
			getCellHeightRetryCount: {
				fixed: 0,
				dynamic: 0
			},
			pagingOrgTop: -1,
			updateVirtualListFromDataChange: false
		}
	},
	watch: {
		realTotalData(newVal) {
			// #ifndef APP-NVUE
			if (this.finalUseVirtualList) {
				this.updateVirtualListFromDataChange = true;
				this.$nextTick(() => {
					this.getCellHeightRetryCount.fixed = 0;
					!newVal.length && this._resetDynamicListState(!this.isUserPullDown);
					newVal.length && this.cellHeightMode === Enum.CellHeightMode.Fixed && this.isFirstPage && this._updateFixedCellHeight();
					this._updateVirtualScroll(this.oldScrollTop);
				})
			}
			// #endif
		},
		virtualList(newVal){
			this.$emit('update:virtualList', newVal);
			this.$emit('virtualListChange', newVal);
		}
	},
	computed: {
		finalUseVirtualList() {
			if (this.useVirtualList && this.usePageScroll){
				u.consoleErr('使用页面滚动时，开启虚拟列表无效！');
			}
			return this.useVirtualList && !this.usePageScroll;
		},
		finalUseInnerList() {
			return this.useInnerList || (this.finalUseVirtualList && !this.forceCloseInnerList);
		},
		finalCellKeyName() {
			// #ifdef APP-NVUE
			if (this.finalUseVirtualList && !this.cellKeyName.length){
				u.consoleErr('在nvue中开启use-virtual-list必须设置cell-key-name，否则将可能导致列表渲染错误！');
			}
			// #endif
			return this.cellKeyName;
		},
		finalVirtualPageHeight(){
			return this.virtualPageHeight > 0 ? this.virtualPageHeight : this.windowHeight;
		},
		virtualRangePageHeight(){
			return this.finalVirtualPageHeight * this.preloadPage;
		},
		virtualScrollDisTimeStamp() {
			return 1000 / this.virtualScrollFps;
		},
	},
	methods: {
		//在使用动态高度虚拟列表时，手动更新指定cell的缓存高度(当cell高度在初始化之后再次改变时调用)，index代表需要更新的cell在列表中的位置，从0开始
		didUpdateVirtualListCell(index) {
			if (this.cellHeightMode !== Enum.CellHeightMode.Dynamic) return;
			const currentNode = this.virtualHeightCacheList[index];
			this._getNodeClientRect(`#zp-id-${index}`, this.finalUseInnerList).then(cellNode => {
				const cellNodeHeight = cellNode ? cellNode[0].height : 0;
				
				const heightDis = cellNodeHeight - currentNode.height;
				currentNode.height = cellNodeHeight;
				currentNode.totalHeight = currentNode.lastHeight + cellNodeHeight;
				
				for (let i = index + 1; i < this.virtualHeightCacheList.length; i++) {
					const thisNode = this.virtualHeightCacheList[i];
					if (i === index + 1) {
						thisNode.lastHeight = cellNodeHeight;
					}
					thisNode.totalHeight += heightDis;
				}
			});
		},
		//在使用动态高度虚拟列表时，若删除了列表数组中的某个item，需要调用此方法以更新高度缓存数组，index代表需要更新的cell在列表中的位置，从0开始
		didDeleteVirtualListCell(index) {
			if (this.cellHeightMode !== Enum.CellHeightMode.Dynamic) return;
			const currentNode = this.virtualHeightCacheList[index];
			for (let i = index + 1; i < this.virtualHeightCacheList.length; i++) {
				const thisNode = this.virtualHeightCacheList[i];
				if (i === index + 1) {
					thisNode.lastHeight = currentNode.lastHeight;
				}
				thisNode.totalHeight -= currentNode.height;
			}
			this.virtualHeightCacheList.splice(index, 1);
		},
		//初始化虚拟列表
		_virtualListInit() {
			this.$nextTick(() => {
				u.delay(() => {
					this._getNodeClientRect('.zp-scroll-view').then(node => {
						if (node) {
							this.pagingOrgTop = node[0].top;
							this.virtualPageHeight = node[0].height;
						}
					});
				});
			})
		},
		//cellHeightMode为fixed时获取第一个cell高度
		_updateFixedCellHeight() {
			this.$nextTick(() => {
				u.delay(() => {
					this._getNodeClientRect(`#zp-id-${0}`,this.finalUseInnerList).then(cellNode => {
						if (!cellNode) {
							if (this.getCellHeightRetryCount.fixed > 10) return;
							this.getCellHeightRetryCount.fixed ++;
							this._updateFixedCellHeight();
						} else {
							this.virtualCellHeight = cellNode[0].height;
							this._updateVirtualScroll(this.oldScrollTop);
						}
					});
				}, c.delayTime, 'updateFixedCellHeightDelay');
			})
		},
		//cellHeightMode为dynamic时获取每个cell高度
		_updateDynamicCellHeight(list) {
			this.$nextTick(() => {
				u.delay(async () => {
					for (let i = 0; i < list.length; i++) {
						let item = list[i];
						const cellNode = await this._getNodeClientRect(`#zp-id-${item[c.listCellIndexKey]}`, this.finalUseInnerList);
						const currentHeight = cellNode ? cellNode[0].height : 0;
						if (!cellNode) {
							this.virtualHeightCacheList = this.virtualHeightCacheList.slice(-i);
							if (this.getCellHeightRetryCount.dynamic > 10) return;
							this.getCellHeightRetryCount.dynamic ++;
							this._updateDynamicCellHeight(list);
							break;
						}
						const lastHeightCache = this.virtualHeightCacheList.length ? this.virtualHeightCacheList.slice(-1)[0] : null;
						const lastHeight = lastHeightCache ? lastHeightCache.totalHeight : 0;
						this.virtualHeightCacheList.push({
							height: currentHeight,
							lastHeight,
							totalHeight: lastHeight + currentHeight
						});
					}
					this._updateVirtualScroll(this.oldScrollTop);
				}, c.delayTime, 'updateDynamicCellHeightDelay')
			})
		},
		//设置cellItem的index
		_setCellIndex(list, isFirstPage) {
			let lastItemIndex = 0;
			if (!isFirstPage) {
				lastItemIndex = this.realTotalData.length;
				const lastItem = this.realTotalData.length ? this.realTotalData.slice(-1)[0] : null;
				if (lastItem && lastItem[c.listCellIndexKey] !== undefined) {
					lastItemIndex = lastItem[c.listCellIndexKey] + 1;
				}
			} else {			
				this._resetDynamicListState();
			}
			for (let i = 0; i < list.length; i++) {
				let item = list[i];
				if (!item || Object.prototype.toString.call(item) !== '[object Object]') {
					item = { item };
				}
				item[c.listCellIndexKey] = lastItemIndex + i;
				item[c.listCellIndexUniqueKey] = `${this.virtualListKey}-${item[c.listCellIndexKey]}`;
				list[i] = item;
			}
			this.getCellHeightRetryCount.dynamic = 0;
			this.cellHeightMode === Enum.CellHeightMode.Dynamic && this._updateDynamicCellHeight(list);
		},
		//更新scroll滚动
		_updateVirtualScroll(scrollTop, scrollDiff = 0) {
			const currentTimeStamp = u.getTime();
			scrollTop === 0 && this._resetTopRange();
			if (scrollTop !== 0 && this.virtualScrollTimeStamp && currentTimeStamp - this.virtualScrollTimeStamp <= this.virtualScrollDisTimeStamp) {
				return;
			}
			this.virtualScrollTimeStamp = currentTimeStamp;
			
			let scrollIndex = 0;
			const cellHeightMode = this.cellHeightMode;
			if (cellHeightMode === Enum.CellHeightMode.Fixed) {
				scrollIndex = parseInt(scrollTop / this.virtualCellHeight) || 0;
				this._updateFixedTopRangeIndex(scrollIndex);
				this._updateFixedBottomRangeIndex(scrollIndex);
			} else if(cellHeightMode === Enum.CellHeightMode.Dynamic) {
				const scrollDirection = scrollDiff > 0 ? 'top' : 'bottom';
				const rangePageHeight = this.virtualRangePageHeight;
				const topRangePageOffset = scrollTop - rangePageHeight;
				const bottomRangePageOffset = scrollTop + this.finalVirtualPageHeight + rangePageHeight;
				
				let virtualBottomRangeIndex = 0;
				let virtualPlaceholderBottomHeight = 0;
				let reachedLimitBottom = false;
				const heightCacheList = this.virtualHeightCacheList;
				const lastHeightCache = !!heightCacheList ? heightCacheList.slice(-1)[0] : null;
				
				let startTopRangeIndex = this.virtualTopRangeIndex;
				if (scrollDirection === 'bottom') {
					for (let i = startTopRangeIndex; i < heightCacheList.length; i++){
						const heightCacheItem = heightCacheList[i];
						if (heightCacheItem && heightCacheItem.totalHeight > topRangePageOffset) {
							this.virtualTopRangeIndex = i;
							this.virtualPlaceholderTopHeight = heightCacheItem.lastHeight;
							break;
						}
					}
				} else {
					let topRangeMatched = false;
					for (let i = startTopRangeIndex; i >= 0; i--){
						const heightCacheItem = heightCacheList[i];
						if (heightCacheItem && heightCacheItem.totalHeight < topRangePageOffset) {
							this.virtualTopRangeIndex = i;
							this.virtualPlaceholderTopHeight = heightCacheItem.lastHeight;
							topRangeMatched = true;
							break;
						}
					}
					!topRangeMatched && this._resetTopRange();
				}
				for (let i = this.virtualTopRangeIndex; i < heightCacheList.length; i++){
					const heightCacheItem = heightCacheList[i];
					if (heightCacheItem && heightCacheItem.totalHeight > bottomRangePageOffset) {
						virtualBottomRangeIndex = i;
						virtualPlaceholderBottomHeight = lastHeightCache.totalHeight - heightCacheItem.totalHeight;
						reachedLimitBottom = true;
						break;
					}
				}
				if (!reachedLimitBottom || this.virtualBottomRangeIndex === 0) {
					this.virtualBottomRangeIndex = this.realTotalData.length ? this.realTotalData.length - 1 : this.pageSize;
					this.virtualPlaceholderBottomHeight = 0;
				} else {
					this.virtualBottomRangeIndex = virtualBottomRangeIndex;
					this.virtualPlaceholderBottomHeight = virtualPlaceholderBottomHeight;
				}
				this._updateVirtualList();
			}
		},
		//更新fixedCell模式下topRangeIndex&placeholderTopHeight
		_updateFixedTopRangeIndex(scrollIndex) {
			let virtualTopRangeIndex = this.virtualCellHeight === 0 ? 0 : scrollIndex - parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) * this.preloadPage;
			virtualTopRangeIndex *= this.virtualListCol;
			virtualTopRangeIndex = Math.max(0, virtualTopRangeIndex);
			this.virtualTopRangeIndex = virtualTopRangeIndex;
			this.virtualPlaceholderTopHeight = (virtualTopRangeIndex / this.virtualListCol) * this.virtualCellHeight;
		},
		//更新fixedCell模式下bottomRangeIndex&placeholderBottomHeight
		_updateFixedBottomRangeIndex(scrollIndex) {
			let virtualBottomRangeIndex = this.virtualCellHeight === 0 ? this.pageSize : scrollIndex + parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) * (this.preloadPage + 1);
			virtualBottomRangeIndex *= this.virtualListCol;
			virtualBottomRangeIndex = Math.min(this.realTotalData.length, virtualBottomRangeIndex);
			this.virtualBottomRangeIndex = virtualBottomRangeIndex;
			this.virtualPlaceholderBottomHeight = (this.realTotalData.length - virtualBottomRangeIndex) * this.virtualCellHeight / this.virtualListCol;
			this._updateVirtualList();
		},
		//更新virtualList
		_updateVirtualList() {
			const shouldUpdateList = this.updateVirtualListFromDataChange || (this.lastVirtualTopRangeIndex !== this.virtualTopRangeIndex || this.lastVirtualBottomRangeIndex !== this.virtualBottomRangeIndex);
			if (shouldUpdateList) {
				this.updateVirtualListFromDataChange = false;
				this.lastVirtualTopRangeIndex =  this.virtualTopRangeIndex;
				this.lastVirtualBottomRangeIndex = this.virtualBottomRangeIndex;
				this.virtualList = this.realTotalData.slice(this.virtualTopRangeIndex, this.virtualBottomRangeIndex + 1);
			}
		},
		//重置动态cell模式下的高度缓存数据、虚拟列表和滚动状态
		_resetDynamicListState(resetVirtualList = false) {
			this.virtualHeightCacheList = [];
			if (resetVirtualList) {
				this.virtualList = [];
			}
			this.virtualTopRangeIndex = 0;
			this.virtualPlaceholderTopHeight = 0;
		},
		//重置topRangeIndex和placeholderTopHeight
		_resetTopRange() {
			this.virtualTopRangeIndex = 0;
			this.virtualPlaceholderTopHeight = 0;
			this._updateVirtualList();
		},
		//检测虚拟列表当前滚动位置，如发现滚动位置不正确则重新计算虚拟列表相关参数(为解决在App中可能出现的长时间进入后台后打开App白屏的问题)
		_checkVirtualListScroll() {
			if (this.finalUseVirtualList) {
				this.$nextTick(() => {
					this._getNodeClientRect('.zp-paging-touch-view').then(node => {
						const currentTop = node ? node[0].top : 0;
						if (!node || (currentTop === this.pagingOrgTop && this.virtualPlaceholderTopHeight !== 0)) {
							this._updateVirtualScroll(0);
						}
					});
				})
			}
		},
		//处理使用内置列表时点击了cell事件
		_innerCellClick(item, index) {
			this.$emit('innerCellClick', item, index);
		}
	}
}
