// [z-paging]虚拟列表模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'

export default {
	props: {
		// 是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: u.gc('useVirtualList', false)
		},
		// 在使用虚拟列表时，是否使用兼容模式，默认为否
		useCompatibilityMode: {
			type: Boolean,
			default: u.gc('useCompatibilityMode', false)
		},
		// 使用兼容模式时传递的附加数据
		extraData: {
			type: Object,
			default: u.gc('extraData', {})
		},
		// 是否在z-paging内部循环渲染列表(内置列表)，默认为否。若use-virtual-list为true，则此项恒为true
		useInnerList: {
			type: Boolean,
			default: u.gc('useInnerList', false)
		},
		// 强制关闭inner-list，默认为false，如果为true将强制关闭innerList，适用于开启了虚拟列表后需要强制关闭inner-list的情况
		forceCloseInnerList: {
			type: Boolean,
			default: u.gc('forceCloseInnerList', false)
		},
		// 内置列表cell的key名称，仅nvue有效，在nvue中开启use-inner-list时必须填此项
		cellKeyName: {
			type: String,
			default: u.gc('cellKeyName', '')
		},
		// innerList样式
		innerListStyle: {
			type: Object,
			default: u.gc('innerListStyle', {})
		},
		// innerCell样式
		innerCellStyle: {
			type: Object,
			default: u.gc('innerCellStyle', {})
		},
		// 预加载的列表可视范围(列表高度)页数，默认为12，即预加载当前页及上下各12页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
		preloadPage: {
			type: [Number, String],
			default: u.gc('preloadPage', 12),
			validator: (value) => {
				if (value <= 0) u.consoleErr('preload-page必须大于0！');
				return value > 0;
			}
		},
		// 虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
		cellHeightMode: {
			type: String,
			default: u.gc('cellHeightMode', Enum.CellHeightMode.Fixed)
		},
		// 固定的cell高度，cellHeightMode=fixed才有效，若设置了值，则不计算第一个cell高度而使用设置的cell高度
		fixedCellHeight: {
			type: [Number, String],
			default: u.gc('fixedCellHeight', 0)
		},
		// 虚拟列表列数，默认为1。常用于每行有多列的情况，例如每行有2列数据，需要将此值设置为2
		virtualListCol: {
			type: [Number, String],
			default: u.gc('virtualListCol', 1)
		},
		// 虚拟列表scroll取样帧率，默认为80，过低容易出现白屏问题，过高容易出现卡顿问题
		virtualScrollFps: {
			type: [Number, String],
			default: u.gc('virtualScrollFps', 80)
		},
		// 虚拟列表cell id的前缀，适用于一个页面有多个虚拟列表的情况，用以区分不同虚拟列表cell的id，注意：请勿传数字或以数字开头的字符串。如设置为list1，则cell的id应为：list1-zp-id-${item.zp_index}
		virtualCellIdPrefix: {
			type: String,
			default: u.gc('virtualCellIdPrefix', '')
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
			virtualItemInsertedCount: 0,
			
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
		// 监听总数据的改变，刷新虚拟列表布局
		realTotalData() {
			this.updateVirtualListRender();
		},
		// 监听虚拟列表渲染数组的改变并emit
		virtualList(newVal){
			this.$emit('update:virtualList', newVal);
			this.$emit('virtualListChange', newVal);
		},
		// 监听虚拟列表顶部占位高度改变并emit
		virtualPlaceholderTopHeight(newVal) {
			this.$emit('virtualTopHeightChange', newVal);
		}
	},
	computed: {
		virtualCellIndexKey() {
			return c.listCellIndexKey;
		},
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
		finalFixedCellHeight() {
			return u.convertToPx(this.fixedCellHeight);
		},
		fianlVirtualCellIdPrefix() {
			const prefix = this.virtualCellIdPrefix ? this.virtualCellIdPrefix + '-' : '';
			return prefix + 'zp-id';
		},
		finalPlaceholderTopHeightStyle() {
			// #ifdef VUE2
			return { transform: this.virtualPlaceholderTopHeight > 0 ? `translateY(${this.virtualPlaceholderTopHeight}px)` : 'none' };
			// #endif
			return {};
		},
		virtualRangePageHeight(){
			return this.finalVirtualPageHeight * this.preloadPage;
		},
		virtualScrollDisTimeStamp() {
			return 1000 / this.virtualScrollFps;
		}
	},
	methods: {
		// 在使用动态高度虚拟列表时，若在列表数组中需要插入某个item，需要调用此方法；item:需要插入的item，index:插入的cell位置，若index为2，则插入的item在原list的index=1之后，index从0开始
		doInsertVirtualListItem(item, index) {
			if (this.cellHeightMode !== Enum.CellHeightMode.Dynamic) return;
			this.realTotalData.splice(index, 0, item);
			// #ifdef VUE3
			this.realTotalData = [...this.realTotalData];
			// #endif
			this.virtualItemInsertedCount ++;
			if (!item || Object.prototype.toString.call(item) !== '[object Object]') {
				item = { item };
			}
			const cellIndexKey = this.virtualCellIndexKey;
			item[cellIndexKey] = `custom-${this.virtualItemInsertedCount}`;
			item[c.listCellIndexUniqueKey] = `${this.virtualListKey}-${item[cellIndexKey]}`;
			this.$nextTick(async () => {
				let retryCount = 0;
				while (retryCount <= 10) {
					await u.wait(c.delayTime);
					
					const cellNode = await this._getVirtualCellNodeByIndex(item[cellIndexKey]);
					// 如果获取当前cell的节点信息失败，则重试（不超过10次）
					if (!cellNode) {
						retryCount ++;
						continue;
					} 
					
					const currentHeight = cellNode ? cellNode[0].height : 0;
					const lastHeightCache = this.virtualHeightCacheList[index - 1];
					const lastTotalHeight = lastHeightCache ? lastHeightCache.totalHeight : 0;
					// 在缓存的cell高度数组中，插入此cell高度信息
					this.virtualHeightCacheList.splice(index, 0, {
						height: currentHeight,
						lastTotalHeight,
						totalHeight: lastTotalHeight + currentHeight
					});
					
					// 从当前index起后续的cell缓存高度的lastTotalHeight和totalHeight需要加上当前cell的高度
					for (let i = index + 1; i < this.virtualHeightCacheList.length; i++) {
						const thisNode = this.virtualHeightCacheList[i];
						thisNode.lastTotalHeight += currentHeight;
						thisNode.totalHeight += currentHeight;
					}
					
					this._updateVirtualScroll(this.oldScrollTop);
					break;
				}
			})
		},
		// 在使用动态高度虚拟列表时，手动更新指定cell的缓存高度(当cell高度在初始化之后再次改变后调用)；index:需要更新的cell在列表中的位置，从0开始
		didUpdateVirtualListCell(index) {
			if (this.cellHeightMode !== Enum.CellHeightMode.Dynamic) return;
			const currentNode = this.virtualHeightCacheList[index];
			this.$nextTick(() => {
				this._getVirtualCellNodeByIndex(index).then(cellNode => {
					// 更新当前cell的高度
					const cellNodeHeight = cellNode ? cellNode[0].height : 0;
					const heightDis = cellNodeHeight - currentNode.height;
					currentNode.height = cellNodeHeight;
					currentNode.totalHeight = currentNode.lastTotalHeight + cellNodeHeight;
					
					// 从当前index起后续的cell缓存高度的lastTotalHeight和totalHeight需要加上当前cell变化的高度
					for (let i = index + 1; i < this.virtualHeightCacheList.length; i++) {
						const thisNode = this.virtualHeightCacheList[i];
						thisNode.totalHeight += heightDis;
						thisNode.lastTotalHeight += heightDis;
					}
				});
			})
		},
		// 在使用动态高度虚拟列表时，若删除了列表数组中的某个item，需要调用此方法以更新高度缓存数组；index:删除的cell在列表中的位置，从0开始
		didDeleteVirtualListCell(index) {
			if (this.cellHeightMode !== Enum.CellHeightMode.Dynamic) return;
			const currentNode = this.virtualHeightCacheList[index];
			// 从当前index起后续的cell缓存高度的lastTotalHeight和totalHeight需要减去当前cell的高度
			for (let i = index + 1; i < this.virtualHeightCacheList.length; i++) {
				const thisNode = this.virtualHeightCacheList[i];
				thisNode.totalHeight -= currentNode.height;
				thisNode.lastTotalHeight -= currentNode.height;
			}
			// 将当前cell的高度信息从高度缓存数组中删除
			this.virtualHeightCacheList.splice(index, 1);
		},
		// 手动触发虚拟列表渲染更新，可用于解决例如修改了虚拟列表数组中元素，但展示未更新的情况
		updateVirtualListRender() {
			// #ifndef APP-NVUE
			if (this.finalUseVirtualList) {
				this.updateVirtualListFromDataChange = true;
				this.$nextTick(() => {
					this.getCellHeightRetryCount.fixed = 0;
					if (this.realTotalData.length) {
						this.cellHeightMode === Enum.CellHeightMode.Fixed && this.isFirstPage && this._updateFixedCellHeight()
					} else {
						this._resetDynamicListState(!this.isUserPullDown);
					}
					this._updateVirtualScroll(this.oldScrollTop);
				})
			}
			// #endif
		},
		// 初始化虚拟列表
		_virtualListInit() {
			this.$nextTick(() => {
				u.delay(() => {
					// 获取虚拟列表滚动区域的高度
					this._getNodeClientRect('.zp-scroll-view').then(node => {
						if (node) {
							this.pagingOrgTop = node[0].top;
							this.virtualPageHeight = node[0].height;
						}
					});
				});
			})
		},
		// cellHeightMode为fixed时获取第一个cell高度
		_updateFixedCellHeight() {
			if (!this.finalFixedCellHeight) {
				this.$nextTick(() => {
					u.delay(() => {
						this._getVirtualCellNodeByIndex(0).then(cellNode => {
							if (!cellNode) {
								if (this.getCellHeightRetryCount.fixed > 10) return;
								this.getCellHeightRetryCount.fixed ++;
								// 如果获取第一个cell的节点信息失败，则重试（不超过10次）
								this._updateFixedCellHeight();
							} else {
								this.virtualCellHeight = cellNode[0].height;
								this._updateVirtualScroll(this.oldScrollTop);
							}
						});
					}, c.delayTime, 'updateFixedCellHeightDelay');
				})
			} else {
				this.virtualCellHeight = this.finalFixedCellHeight;
			}
		},
		// cellHeightMode为dynamic时获取每个cell高度
		_updateDynamicCellHeight(list, dataFrom = 'bottom') {
			const dataFromTop = dataFrom === 'top';
			const heightCacheList = this.virtualHeightCacheList;
			const currentCacheList = dataFromTop ?  [] : heightCacheList;
			let listTotalHeight = 0;
			this.$nextTick(() => {
				u.delay(async () => {
					for (let i = 0; i < list.length; i++) {
						const cellNode = await this._getVirtualCellNodeByIndex(list[i][this.virtualCellIndexKey]);
						const currentHeight = cellNode ? cellNode[0].height : 0;
						if (!cellNode) {
							if (this.getCellHeightRetryCount.dynamic <= 10) {
								heightCacheList.splice(heightCacheList.length - i, i);
								this.getCellHeightRetryCount.dynamic ++;
								// 如果获取当前cell的节点信息失败，则重试（不超过10次）
								this._updateDynamicCellHeight(list, dataFrom);
							}
							return;
						} 
						const lastHeightCache = currentCacheList.length ? currentCacheList.slice(-1)[0] : null;
						const lastTotalHeight = lastHeightCache ? lastHeightCache.totalHeight : 0;
						// 缓存当前cell的高度信息：height-当前cell高度；lastTotalHeight-前面所有cell的高度总和；totalHeight-包含当前cell的所有高度总和
						currentCacheList.push({
							height: currentHeight,
							lastTotalHeight,
							totalHeight: lastTotalHeight + currentHeight
						});
						if (dataFromTop) {
							listTotalHeight += currentHeight;
						}
					}
					// 如果数据是从顶部拼接的
					if (dataFromTop && list.length) {
						for (let i = 0; i < heightCacheList.length; i++) {
							// 更新之前所有项的缓存高度，需要加上此次插入的所有cell高度之和（因为是从顶部插入的cell）
							const heightCacheItem = heightCacheList[i];
							heightCacheItem.lastTotalHeight += listTotalHeight;
							heightCacheItem.totalHeight += listTotalHeight;
						}
						this.virtualHeightCacheList = currentCacheList.concat(heightCacheList);
					}
					this._updateVirtualScroll(this.oldScrollTop);
				}, c.delayTime, 'updateDynamicCellHeightDelay')
			})
		},
		// 设置cellItem的index
		_setCellIndex(list, dataFrom = 'bottom') {
			let currentItemIndex = 0;
			const cellIndexKey = this.virtualCellIndexKey;
			dataFrom === 'bottom' && ([Enum.QueryFrom.Refresh, Enum.QueryFrom.Reload].indexOf(this.queryFrom) >= 0) && this._resetDynamicListState();
			if (this.totalData.length && this.queryFrom !== Enum.QueryFrom.Refresh) {
				if (dataFrom === 'bottom') {
					currentItemIndex = this.realTotalData.length;
					const lastItem = this.realTotalData.length ? this.realTotalData.slice(-1)[0] : null;
					if (lastItem && lastItem[cellIndexKey] !== undefined) {
						currentItemIndex = lastItem[cellIndexKey] + 1;
					}
				} else if (dataFrom === 'top') {
					const firstItem = this.realTotalData.length ? this.realTotalData[0] : null;
					if (firstItem && firstItem[cellIndexKey] !== undefined) {
						currentItemIndex = firstItem[cellIndexKey] - list.length;
					}
				}
			} else {
				this._resetDynamicListState();
			}
			for (let i = 0; i < list.length; i++) {
				let item = list[i];
				if (!item || Object.prototype.toString.call(item) !== '[object Object]') {
					item = { item };
				}
				if (item[c.listCellIndexUniqueKey]) {
					item = u.deepCopy(item);
				}
				item[cellIndexKey] = currentItemIndex + i;
				item[c.listCellIndexUniqueKey] = `${this.virtualListKey}-${item[cellIndexKey]}`;
				list[i] = item;
			}
			this.getCellHeightRetryCount.dynamic = 0;
			this.cellHeightMode === Enum.CellHeightMode.Dynamic && this._updateDynamicCellHeight(list, dataFrom);
		},
		// 更新scroll滚动（虚拟列表滚动时触发）
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
				// 如果是固定高度的虚拟列表
				// 计算当前滚动到的cell的index = scrollTop / 虚拟列表cell的固定高度
				scrollIndex = parseInt(scrollTop / this.virtualCellHeight) || 0;
				// 更新顶部和底部占位view的高度（为兼容考虑，顶部采用transformY的方式占位)
				this._updateFixedTopRangeIndex(scrollIndex);
				this._updateFixedBottomRangeIndex(scrollIndex);
			} else if(cellHeightMode === Enum.CellHeightMode.Dynamic) {
				// 如果是不固定高度的虚拟列表
				// 当前滚动的方向
				const scrollDirection = scrollDiff > 0 ? 'top' : 'bottom';
				// 视图区域的高度
				const rangePageHeight = this.virtualRangePageHeight;
				// 顶部视图区域外的高度（顶部不需要渲染而是需要占位部分的高度）
				const topRangePageOffset = scrollTop - rangePageHeight;
				// 底部视图区域外的高度（底部不需要渲染而是需要占位部分的高度）
				const bottomRangePageOffset = scrollTop + this.finalVirtualPageHeight + rangePageHeight;
				
				let virtualBottomRangeIndex = 0;
				let virtualPlaceholderBottomHeight = 0;
				let reachedLimitBottom = false;
				const heightCacheList = this.virtualHeightCacheList;
				const lastHeightCache = !!heightCacheList ? heightCacheList.slice(-1)[0] : null;
				
				let startTopRangeIndex = this.virtualTopRangeIndex;
				// 如果是向底部滚动（顶部占位的高度不断增大，顶部的实际渲染cell数量不断减少）
				if (scrollDirection === 'bottom') {
					// 从顶部视图边缘的cell的位置开始向后查找
					for (let i = startTopRangeIndex; i < heightCacheList.length; i++){
						const heightCacheItem = heightCacheList[i];
						// 如果查找到某个cell对应的totalHeight大于顶部视图区域外的高度，则此cell为顶部视图边缘的cell
						if (heightCacheItem && heightCacheItem.totalHeight > topRangePageOffset) {
							// 记录顶部视图边缘cell的index并更新顶部占位区域的高度并停止继续查找
							this.virtualTopRangeIndex = i;
							this.virtualPlaceholderTopHeight = heightCacheItem.lastTotalHeight;
							break;
						}
					}
				} else {
					// 如果是向顶部滚动（顶部占位的高度不断减少，顶部的实际渲染cell数量不断增加）
					let topRangeMatched = false;
					// 从顶部视图边缘的cell的位置开始向前查找
					for (let i = startTopRangeIndex; i >= 0; i--){
						const heightCacheItem = heightCacheList[i];
						// 如果查找到某个cell对应的totalHeight小于顶部视图区域外的高度，则此cell为顶部视图边缘的cell
						if (heightCacheItem && heightCacheItem.totalHeight < topRangePageOffset) {
							// 记录顶部视图边缘cell的index并更新顶部占位区域的高度并停止继续查找
							this.virtualTopRangeIndex = i;
							this.virtualPlaceholderTopHeight = heightCacheItem.lastTotalHeight;
							topRangeMatched = true;
							break;
						}
					}
					// 如果查找不到，则认为顶部占位高度为0了，顶部cell不需要继续复用，重置topRangeIndex和placeholderTopHeight
					!topRangeMatched && this._resetTopRange();
				}
				// 从顶部视图边缘的cell的位置开始向后查找
				for (let i = this.virtualTopRangeIndex; i < heightCacheList.length; i++){
					const heightCacheItem = heightCacheList[i];
					// 如果查找到某个cell对应的totalHeight大于底部视图区域外的高度，则此cell为底部视图边缘的cell
					if (heightCacheItem && heightCacheItem.totalHeight > bottomRangePageOffset) {
						// 记录底部视图边缘cell的index并更新底部占位区域的高度并停止继续查找
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
		// 更新fixedCell模式下topRangeIndex&placeholderTopHeight
		_updateFixedTopRangeIndex(scrollIndex) {
			let virtualTopRangeIndex = this.virtualCellHeight === 0 ? 0 : scrollIndex - (parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) || 1) * this.preloadPage;
			virtualTopRangeIndex *= this.virtualListCol;
			virtualTopRangeIndex = Math.max(0, virtualTopRangeIndex);
			this.virtualTopRangeIndex = virtualTopRangeIndex;
			this.virtualPlaceholderTopHeight = (virtualTopRangeIndex / this.virtualListCol) * this.virtualCellHeight;
		},
		// 更新fixedCell模式下bottomRangeIndex&placeholderBottomHeight
		_updateFixedBottomRangeIndex(scrollIndex) {
			let virtualBottomRangeIndex = this.virtualCellHeight === 0 ? this.pageSize : scrollIndex + (parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) || 1) * (this.preloadPage + 1);
			virtualBottomRangeIndex *= this.virtualListCol;
			virtualBottomRangeIndex = Math.min(this.realTotalData.length, virtualBottomRangeIndex);
			this.virtualBottomRangeIndex = virtualBottomRangeIndex;
			this.virtualPlaceholderBottomHeight = (this.realTotalData.length - virtualBottomRangeIndex) * this.virtualCellHeight / this.virtualListCol;
			this._updateVirtualList();
		},
		// 更新virtualList
		_updateVirtualList() {
			const shouldUpdateList = this.updateVirtualListFromDataChange || (this.lastVirtualTopRangeIndex !== this.virtualTopRangeIndex || this.lastVirtualBottomRangeIndex !== this.virtualBottomRangeIndex);
			if (shouldUpdateList) {
				this.updateVirtualListFromDataChange = false;
				this.lastVirtualTopRangeIndex =  this.virtualTopRangeIndex;
				this.lastVirtualBottomRangeIndex = this.virtualBottomRangeIndex;
				this.virtualList = this.realTotalData.slice(this.virtualTopRangeIndex, this.virtualBottomRangeIndex + 1);
			}
		},
		// 重置动态cell模式下的高度缓存数据、虚拟列表和滚动状态
		_resetDynamicListState(resetVirtualList = false) {
			this.virtualHeightCacheList = [];
			if (resetVirtualList) {
				this.virtualList = [];
			}
			this.virtualTopRangeIndex = 0;
			this.virtualPlaceholderTopHeight = 0;
		},
		// 重置topRangeIndex和placeholderTopHeight
		_resetTopRange() {
			this.virtualTopRangeIndex = 0;
			this.virtualPlaceholderTopHeight = 0;
			this._updateVirtualList();
		},
		// 检测虚拟列表当前滚动位置，如发现滚动位置不正确则重新计算虚拟列表相关参数(为解决在App中可能出现的长时间进入后台后打开App白屏的问题)
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
		// 获取对应index的虚拟列表cell节点信息
		_getVirtualCellNodeByIndex(index) {
			let inParent = false;
			// 在vue3+(微信小程序或QQ小程序)中，使用非内置列表写法时，若z-paging在swiper-item内存在无法获取slot插入的cell高度的问题
			// 通过uni.createSelectorQuery().in(this.$parent)来解决此问题
			// #ifdef VUE3
			// #ifdef MP-WEIXIN || MP-QQ
			if (this.forceCloseInnerList) {
				inParent = true;
			}
			// #endif
			// #endif
			return this._getNodeClientRect(`#${this.fianlVirtualCellIdPrefix}-${index}`, this.finalUseInnerList, false, inParent);
		},
		// 处理使用内置列表时点击了cell事件
		_innerCellClick(item, index) {
			this.$emit('innerCellClick', item, index);
		}
	}
}
