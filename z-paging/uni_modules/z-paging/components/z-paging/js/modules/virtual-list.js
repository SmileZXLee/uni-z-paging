// [z-paging]虚拟列表实现模块（todo）
import u from '.././z-paging-utils'

const ZPVirtualList = {
	props: {
		
	},
	data() {
		return {
			virtualPlaceholderTopHeight: 0,
			virtualPlaceholderBottomHeight: 0,
		}
	},
	watch: {
		
	},
	computed: {
		
	},
	methods: {
		_updateScroll(scrollTop,scrollDiff){
			console.log(scrollTop,scrollDiff);
		}
	}
}

export default ZPVirtualList;
