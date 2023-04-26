import { onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

function useZPaging(paging) {
	onPullDownRefresh(() => {
		paging.value && paging.value.reload();
	})
	
	onPageScroll(e => {
		paging.value && paging.value.updatePageScrollTop(e.scrollTop);
		e.scrollTop < 10 && paging.value.doChatRecordLoadMore();
	})
	
	onReachBottom(() => {
		paging.value && paging.value.pageReachBottom();
	}) 
}

export default useZPaging