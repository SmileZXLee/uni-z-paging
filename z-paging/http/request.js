let listCount = 34;
let loadingTime = 1000;
/* 模拟分页网络请求获取数据 */
function queryList(pageNo,pageSize,callback){
	pageNo = parseInt(pageNo);
	pageSize = parseInt(pageSize);
	uni.showLoading({
		title: '加载中...'
	})
	if(pageNo < 0 || pageSize <= 0){
		callQueryResult(callback,[]);
		return;
	}
	console.log('%c\n----------请求开始--------','color:green;');
	console.info(`请求参数：【pageNo:${pageNo},pageSize:${pageSize}】`)
	console.log('%c----------请求结束--------\n','color:green;');
	
	if(pageNo == 0){
		pageNo = 1;
	}
	var totalPagingList = [];
	for(let i = 0;i < listCount;i++){
		var item = {'title':i+1,'detail':'测试信息'};
		totalPagingList.push(item);
	}
	let pageNoIndex = (pageNo - 1) * pageSize;
	if(pageNoIndex + pageSize <= totalPagingList.length){
		callQueryResult(callback,totalPagingList.splice(pageNoIndex,pageSize));
	}else if(pageNoIndex < totalPagingList.length){
		callQueryResult(callback,totalPagingList.splice(pageNoIndex,totalPagingList.length-pageNoIndex));
	}else{
		callQueryResult(callback,[]);
	}
}

function callQueryResult(callback,arg){
	setTimeout(()=>{
		uni.hideLoading();
		console.log('%c\n----------响应开始--------','color:#0113fa;');
		console.table(arg);
		console.log('%c----------响应结束--------\n','color:#0113fa;');
		callback(arg);
	},loadingTime)
}

module.exports = {
	queryList
}