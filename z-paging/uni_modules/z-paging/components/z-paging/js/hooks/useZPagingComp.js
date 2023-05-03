// [z-paging]useZPagingComp hooks

function useZPagingComp(paging) {
	
	const cPaging = !!paging ? paging.value || paging : null;
	
	const reload = () => {
		if (!cPaging) return;
		cPaging.value.reload();
	}
	const updatePageScrollTop = scrollTop => {
		if (!cPaging) return;
		cPaging.value.updatePageScrollTop(scrollTop);
	}
	const doChatRecordLoadMore = () => {
		if (!cPaging) return;
		cPaging.value.doChatRecordLoadMore();
	}
	const pageReachBottom = () => {
		if (!cPaging) return;
		cPaging.value.pageReachBottom();
	}
	return { reload, updatePageScrollTop, doChatRecordLoadMore, pageReachBottom };
}

export default useZPagingComp