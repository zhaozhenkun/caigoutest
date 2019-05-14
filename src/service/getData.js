// let httpPath = '/api'
let httpPath = '/'
// let httpPath = 'http://192.168.32.223:8080'

import { fetchGet, fetchPost, fetchDelete, fetchPut, fetchCancelGet } from '../config/http'

// export const getByTypeList = data => fetchPost('/app/web/bytype', data)

export const getByTypeList = data => fetchPost(httpPath+'/app/article/list', data)

export const getBannerList = data => fetchPost(httpPath+'/app/web/homebanner', data)

export const getDetail = (data,ids) => fetchGet(httpPath+'/purchaseInfo', data, false, ids)

export const getPolicy = (data,ids) => fetchGet(httpPath+'/policyInfo', data, false, ids)
// 政策法规列表接口
export const getPolicyList = (data,ids) => fetchGet(httpPath+'/policyInfo/search', data, true)

export const getpurchaseDemand = (data,ids) => fetchGet(httpPath+'/purchaseDemand', data, false, ids)

export const getpurchaseSecret = (data,ids) => fetchGet(httpPath+'/purchaseSecret', data, false, ids)

export const gethotSearch = data => fetchGet(httpPath+'/hot/search', data,true)

export const searchListAll = data => fetchGet(httpPath+'/purchaseInfo', data,true)

export const channelListAll = data => fetchPost(httpPath+'/app/channel', data)

export const YanTaoListAll = data => fetchPost(httpPath+'/app/getProblem', data)

export const YanTaoDataAll = data => fetchPost(httpPath+'/app/questions', data)

export const YanTaoOptionsAll = data => fetchPost(httpPath+'/app/answer', data)

// 获取分类接口
export const getInfoType = data => fetchGet(httpPath+'/infoType',data,true)
// 获取来源接口
export const getSource = data => fetchGet(httpPath+'/source',data,true)
// 获取今日更新条数
export const getTodayUpdateCount = data => fetchGet(httpPath+'/purchaseInfo/todayUpdateCount',data,true)
// 采购信息列表接口
export const getPurchaseInfo = data => fetchGet(httpPath+'/purchaseInfo',data,true)
// 精灵智库列表接口
export const getViewpoint = data => fetchGet(httpPath+'/viewpoint',data,true)
// 精灵智库内容页接口
export const viewpointContent = (data,ids) => fetchGet(httpPath+'/viewpoint',data,false, ids)
// 产品列表接口
export const product = data => fetchGet(httpPath+'/product',data,true)
// 产品详情页接口
export const productContent = (data,ids) => fetchGet(httpPath+'/product', data,false, ids)
// 涉密采购列表接口
export const purchaseSecret = (data,ids) => fetchGet(httpPath+'/purchaseSecret/v2', data,true)
// 采购需求接口接口
export const purchaseDemand = (data,ids) => fetchGet(httpPath+'/purchaseDemand/v2', data,true)
// 企业名录列表接口
export const company = (data,ids) => fetchGet(httpPath+'/company', data,true)
// 业主分析列表接口
export const proprietor = (data,ids) => fetchGet(httpPath+'/proprietor', data,true)
// 企业名录内容接口
export const companyContent = (data,ids) => fetchGet(httpPath+'/company', data, false, ids)
// 企业名录中标详情接口
export const winTender = (data,ids) => fetchGet(httpPath+'/company/winTender', data, true)
// 业主分析内容接口
export const proprietorContent = (data,ids) => fetchGet(httpPath+'/proprietor/detail', data, false, ids)
// 获取政策分类列表接口
export const policyType = (data,ids) => fetchGet(httpPath+'/policyType', data, true)
// 提交内容页报错接口
export const reportErrors = data => fetchPost(httpPath+'/reportErrors', data)
// 获取banner图接口
export const getAdInfo = data => fetchGet(httpPath+'/adInfo', data, true)
// 获取分类列表
export const getKnowledgeType = data => fetchGet(httpPath+'/knowledgeType', data, true)
// 获取分类列表
export const getKnowledge = data => fetchGet(httpPath+'/knowledge', data, true)
// 学习搜索
export const knowledgeSearch = data => fetchGet(httpPath+'/knowledge/search', data, true)
// 获取学习详情页列表
export const knowledgeTypeContent = (data,ids) => fetchGet(httpPath+'/knowledge', data,false, ids)
// 获取pdf流
export const imagesFile = (data,ids) => fetchGet(httpPath+'/download/images', data,true)
// 采购信息搜索接口
export const purchaseInfoSearch = (data,ids) => fetchGet(httpPath+'/purchaseInfo/search', data,true)



