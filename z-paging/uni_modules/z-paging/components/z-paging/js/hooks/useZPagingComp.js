function useZPagingComp(paging) {
	const reload = () => {
		paging.value.reload();
	}
	const updatePageScrollTop = scrollTop => {
		paging.value.updatePageScrollTop(scrollTop);
	}
	const doChatRecordLoadMore = () => {
		paging.value.doChatRecordLoadMore();
	}
	const pageReachBottom = () => {
		paging.value.pageReachBottom();
	}
	return { reload, updatePageScrollTop, doChatRecordLoadMore, pageReachBottom };
}

export default useZPagingComp