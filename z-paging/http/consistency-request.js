//对基础请求的再次封装，这个js是为了完成tab切换保证数据一致服务的
import request from './request.js'

function myQueryList(prarm, callback) {
	//当前这个myQueryList方法是为了演示对旧请求进行封装或改造的途径
	//在这里我直接调用了request的queryList方法，并把参数传给它，目的就是为了拦截上一层请求的js返回的data
	//拦截后将data包装一下，最终目的是告知页面，当前请求对应的type(这里的type是代指跟随tab切换而变换的变量)到底是谁
	//如果服务端原先就会返回当前请求的type，则可忽略，若没有返回，则需要包装一下，同数组一起传递给page
	//总而言之，这里传递给page的data必须告知其当前切换tab对应的标识，否则page根本不知道是哪个tab对应的数据，无法进行数据一致性处理！！
	return new Promise((resolve, reject) => {
		request.queryList({
			pageNo: prarm.pageNo,
			pageSize: prarm.pageSize,
			type: prarm.type
		}).then(res => {
			const myData = {
				data: {
					list: res.data.list
				},
				type: prarm.type
			};
			resolve(myData)
		})
	})
}

module.exports = {
	myQueryList
}
