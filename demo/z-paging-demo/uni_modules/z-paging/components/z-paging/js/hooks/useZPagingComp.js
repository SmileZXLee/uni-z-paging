// [z-paging]useZPagingComp hooks

function useZPagingComp(paging) {
	const cPaging = !!paging ? paging.value || paging : null;
	
	const reload = () => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.reload().catch(() => {});
	}
	const updatePageScrollTop = scrollTop => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.updatePageScrollTop(scrollTop);
	}
	const doChatRecordLoadMore = () => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.doChatRecordLoadMore();
	}
	const pageReachBottom = () => {
		if (!cPaging || !cPaging.value) return;
		cPaging.value.pageReachBottom();
	}
	return { reload, updatePageScrollTop, doChatRecordLoadMore, pageReachBottom };
}

export default useZPagingComp