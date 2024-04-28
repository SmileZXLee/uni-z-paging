// [z-paging]拦截器

const queryKey = 'Query';
const fetchParamsKey = 'FetchParams';
const fetchResultKey = 'FetchResult';
const language2LocalKey = 'Language2Local';

// 拦截&处理@query事件
function handleQuery(callback) {
	_addHandleByKey(queryKey, callback);
	return this;
}

// 拦截&处理@query事件(私有，请勿调用)
function _handleQuery(pageNo, pageSize, from, lastItem) {
	const callback = _getHandleByKey(queryKey);
	return callback ? callback(pageNo, pageSize, from, lastItem) : [pageNo, pageSize, from];
}

// 拦截&处理:fetch参数
function handleFetchParams(callback) {
	_addHandleByKey(fetchParamsKey, callback);
	return this;
}

// 拦截&处理:fetch参数(私有，请勿调用)
function _handleFetchParams(parmas, extraParams) {
	const callback = _getHandleByKey(fetchParamsKey);
	return callback ? callback(parmas, extraParams || {}) : { pageNo: parmas.pageNo, pageSize: parmas.pageSize, ...(extraParams || {}) };
}

// 拦截&处理:fetch结果
function handleFetchResult(callback) {
	_addHandleByKey(fetchResultKey, callback);
	return this;
}

// 拦截&处理:fetch结果(私有，请勿调用)
function _handleFetchResult(result, paging, params) {
	const callback = _getHandleByKey(fetchResultKey);
	callback && callback(result, paging, params);
	return callback ? true : false;
}

// 拦截&处理系统language转i18n local
function handleLanguage2Local(callback) {
	_addHandleByKey(language2LocalKey, callback);
	return this;
}

// 拦截&处理系统language转i18n local(私有，请勿调用)
function _handleLanguage2Local(language, local) {
	const callback = _getHandleByKey(language2LocalKey);
	return callback ? callback(language, local) : local;
}

// 获取当前app对象
function _getApp(){
	// #ifndef APP-NVUE
	return getApp();
	// #endif
	// #ifdef APP-NVUE
	return getApp({ allowDefault: true });
	// #endif
}

// 添加处理函数
function _addHandleByKey(key, callback) {
	try {
		setTimeout(function() {
			_getApp().globalData[`zp_handle${key}Callback`] = callback;
		}, 1);
	} catch (_) {}
}

// 获取处理回调函数
function _getHandleByKey(key) {
	return _getApp().globalData[`zp_handle${key}Callback`];
}

export default {
	handleQuery,
	_handleQuery,
	handleFetchParams,
	_handleFetchParams,
	handleFetchResult,
	_handleFetchResult,
	handleLanguage2Local,
	_handleLanguage2Local
};
