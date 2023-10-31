// [z-paging]useZPaging hooks

import { onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

function useZPaging(paging) {
	const cPaging = !!paging ? paging.value || paging : null;
	
	onPullDownRefresh(() => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.reload().catch(() => {});
	})
	
	onPageScroll(e => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.updatePageScrollTop(e.scrollTop);
		e.scrollTop < 10 && cPaging.value.doChatRecordLoadMore();
	})
	
	onReachBottom(() => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.pageReachBottom();
	})
}

export default useZPaging