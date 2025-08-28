// [z-paging]常量

export default {
	// 当前版本号
	version: '2.8.8',
	// 延迟操作的通用时间
	delayTime: 100,
	// 请求失败时候全局emit使用的key
	errorUpdateKey: 'z-paging-error-emit',
	// 全局emit complete的key
	completeUpdateKey: 'z-paging-complete-emit',
	// z-paging缓存的前缀key
	cachePrefixKey: 'z-paging-cache',
	
	// 虚拟列表中列表index的key
	listCellIndexKey: 'zp_index',
	// 虚拟列表中列表的唯一key
	listCellIndexUniqueKey: 'zp_unique_index'
}
