let listCount = 24;
const loadingTime = 500;
const showLog = false;
/* 这个js仅用于在demo中模拟网络请求，请勿导入或修改此文件 */
function queryList(data) {
	if (!data.pageNo || !data.pageSize) {
		return callQueryResult([]);
	}
	let pageNo = parseInt(data.pageNo);
	let pageSize = parseInt(data.pageSize);
	let type = data.type || 0;
	if (pageNo < 0 || pageSize <= 0) {
		return callQueryResult([]);
	}
	if (showLog) {
		console.log('%c\n----------请求开始--------', 'color:green;');
		console.info(`请求参数：【pageNo:${pageNo},pageSize:${pageSize}】`)
		console.log('%c----------请求结束--------\n', 'color:green;');
	}
	uni.showLoading({
		title: '加载中...'
	})
	if (pageNo == 0) {
		pageNo = 1;
	}
	var totalPagingList = [];
	for (let i = 0; i < listCount; i++) {
		var item = {
			'title': (i + 1).toString(),
			'detail': '测试信息' + type
		};
		totalPagingList.push(item);
	}
	let pageNoIndex = (pageNo - 1) * pageSize;
	if (pageNoIndex + pageSize <= totalPagingList.length) {
		return callQueryResult(totalPagingList.splice(pageNoIndex, pageSize));
	} else if (pageNoIndex < totalPagingList.length) {
		return callQueryResult(totalPagingList.splice(pageNoIndex, totalPagingList.length - pageNoIndex));
	} else {
		return callQueryResult([]);
	}
}

function callQueryResult(arg) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			uni.hideLoading();
			if (showLog) {
				console.log('%c\n----------响应开始--------', 'color:#0113fa;');
				// #ifdef H5
				console.table(arg);
				// #endif

				// #ifndef H5
				console.log(arg);
				// #endif
				console.log('%c----------响应结束--------\n', 'color:#0113fa;');
			}
			resolve({
				data: {
					list: arg
				}
			});
		}, loadingTime)
	})

}

function queryListLong(data, callback) {
	listCount = 10000;
	return this.queryList(data, callback);
}

module.exports = {
	queryList,
	queryListLong
}
