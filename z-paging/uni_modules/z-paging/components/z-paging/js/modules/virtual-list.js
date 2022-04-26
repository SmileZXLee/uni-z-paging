// [z-paging]虚拟列表实现模块（todo）
import u from '.././z-paging-utils'

const ZPVirtualList = {
	props: {
		//是否使用虚拟列表，默认为否
		useVirtualList: {
			type: Boolean,
			default: u.gc('useVirtualList', false)
		},
		//列表for循环的key，若不定义默认使用for循环的index
		listKey: {
			type: String,
			default: u.gc('listKey', null)
		},
		//列表for循环的key，若不定义默认使用for循环的index
		listKey: {
			type: String,
			default: u.gc('listKey', null)
		},
		//预加载的列表可视范围(列表高度)页数，默认为1，即预加载当前页及上下各1页的cell。此数值越大，则虚拟列表中加载的dom越多，但增加预加载页面可缓解快速滚动短暂白屏问题
		preloadPage: {
			type: [Number, String],
			default: u.gc('preloadPage', 1),
			validator: (value) => {
				if(value <= 0) u.consoleErr('preload-page必须大于0！');
				return value > 0;
			}
		},
		//虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算
		cellHeightModel: {
			type: String,
			default: u.gc('cellHeight', 'fixed')
		}
	},
	data() {
		return {
			virtualPlaceholderTopHeight: 0,
			virtualPlaceholderBottomHeight: 0,
			virtualPageHeight: 0,
			virtualCellHeight: 1,
			
			virtualTopRangeIndex: 0,
			virtualBottomRangeIndex: 0,
		}
	},
	watch: {
		realTotalData(newVal){
			this._updateBottomRangeIndex(this.oldScrollTop);
		}
	},
	computed: {
		finalUseVirtualList(){
			return this.useVirtualList && !this.usePageScroll;
		}
	},
	methods: {
		_virtualListInit(){
			this.$nextTick(()=>{
				this._getNodeClientRect('.zp-scroll-view').then(node => {
					if (node && node.length) {
						this.virtualPageHeight = node[0].height;
					}
				});
			})
		},
		_updateCellHeight(){
			this.$nextTick(()=>{
				setTimeout(()=> {
					this._getNodeClientRect(`#z-paging-cell-id-${0}`).then(node => {
						this.virtualCellHeight = node && node.length ? node[0].height : 1;
					});
				}, 1);
			})
		},
		_updateScroll(scrollTop,scrollDiff){
			const scrollIndex = parseInt(scrollTop / this.virtualCellHeight);
			this._updateTopRangeIndex(scrollIndex);
			this._updateBottomRangeIndex(scrollIndex);
		},
		_updateTopRangeIndex(scrollIndex){
			let virtualTopRangeIndex =  scrollIndex - parseInt(this.virtualPageHeight / this.virtualCellHeight) * this.preloadPage;
			virtualTopRangeIndex = Math.max(0,virtualTopRangeIndex);
			this.virtualTopRangeIndex = virtualTopRangeIndex;
			this.virtualPlaceholderTopHeight = (virtualTopRangeIndex) * this.virtualCellHeight;
		},
		_updateBottomRangeIndex(scrollIndex){
			let virtualBottomRangeIndex = scrollIndex + parseInt(this.virtualPageHeight / this.virtualCellHeight) * (this.preloadPage + 1);
			virtualBottomRangeIndex = Math.min(this.realTotalData.length,virtualBottomRangeIndex);
			this.virtualBottomRangeIndex = virtualBottomRangeIndex;
			this.virtualPlaceholderBottomHeight = (this.realTotalData.length - virtualBottomRangeIndex) * this.virtualCellHeight;
		},
		
	}
}

export default ZPVirtualList;