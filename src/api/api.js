const master = '/data-main'
const meta = '/metadata'
const API = {

    /****************** login  ******************/
    // 登录
    'loginByUsername': {
        'method': 'post',
        'url': '/auth/oauth/token'
    },
    // 刷新
    'refreshToken': {
        'method': 'post',
        'url': '/auth/oauth/token'
    },
    // 获取用户
    'getUserInfo': {
        'method': 'get',
        'url': '/admin/user/info'
    },
    // 登出
    'logout': {
        'method': 'delete',
        'url': '/auth/token/logout'
    },
    /****************** menu  ******************/
    'getMenu': {
        'method': 'get',
        'url': '/admin/menu'
        // params: {parentId: id},
    },
    'fetchMenuTree': {
        'method': 'get',
        'url': '/admin/menu/tree'
        // params: {lazy: lazy, parentId: parentId}
    },
    'addObj': {
        'method': 'post',
        'url': '/admin/menu'
        // data: obj
    },
    'getObj': {
        'method': 'get',
        'url': '/admin/menu'
        //id
    },
    'delObj': {
        'method': 'delete',
        'url': '/admin/menu'
        //id
    },
    'putObj': {
        'method': 'put',
        'url': '/admin/menu'
        // data: obj
    },
    /****************** 字典  ******************/
    // 查询字典表
    'queryDict': {
        'method': 'get',
        'url': '/compare/dict/list'
    },
    // 查模型
    'model': {
        'method': 'get',
        'url': '/compare/management/model'
    },
    // 查库
    'dbs': {
        'method': 'get',
        'url': '/compare/dict/dbs'
    },
    // 查表
    'tables': {
        'method': 'get',
        'url': '/compare/dict/tables'
    },
    // 查字段
    'fields': {
        'method': 'get',
        'url': '/compare/dict/fields'
    },

    // 查单表字典，或带条件查询
    'getDict': {
        'method': 'get',
        'url': '/compare/dict/one'
    },
    /****************** 首页  ******************/
    // 自定义任务批次
    'monthbatch': {
        'method': 'get',
        'url': '/compare/dict/job'
    },

    'indexScoreCharts': {
        'method': 'post',
        'url': '/compare/index/chart/score'
    },
    'indexRowCharts': {
        'method': 'post',
        'url': '/compare/index/chart/row'
    },
    'indexMainDetailCharts': {
        'method': 'post',
        'url': '/compare/index/chart/maindetail'
    },
    'indexNonEmptyCharts': {
        'method': 'post',
        'url': '/compare/index/chart/nonempty'
    },
    'indexEnumCharts': {
        'method': 'post',
        'url': '/compare/index/chart/enum'
    },
    'indexAbsCharts': {
        'method': 'post',
        'url': '/compare/index/chart/abs'
    },
    'indexSourceTargetCharts': {
        'method': 'post',
        'url': '/compare/index/chart/sourcetarget'
    },

    /****************** 日审分析  ******************/
    // 日审分析数据查询
    'incrementAnalysis': {
        'method': 'get',
        'url': '/compare/analysis/day/report'
    },
    // 日审分析核查结果详情
    'incrementDetail': {
        'method': 'post',
        'url': '/compare/analysis/detail'
    },

    'postprocess': {
        'method': 'post',
        'url': '/compare/issue/process'
    },

    'postmodify': {
        'method': 'post',
        'url': '/compare/responsible/modify'
    },

    'postpageCheckIssue': {
        'method': 'post',
        'url': '/compare/issue/pageCheckIssue'
    },

    'gettimeaxis': {
        'method': 'get',
        'url': '/compare/result/timeaxis'
    },

    'getmodel': {
        'method': 'get',
        'url': '/compare/management/model'
    },

    'postruleTree': {
        'method': 'get',
        'url': '/compare/issue/ruleTree'
    },
    'postissueadd': {
        'method': 'post',
        'url': '/compare/issue/add'
    },

    'postlistResponsible': {
        'method': 'get',
        'url': '/compare/dict/user'
    },

    'postlistJob': {
        'method': 'post',
        'url': '/compare/issue/listJob'
    },

    /******************* 用户 *********************************/
    'userPage': {
        'method': 'get',
        'url': '/compare/user'
    },

    'userInfo':{
        'method': 'get',
        'url': '/compare/user'
    },

    'userModify': {
        'method': 'post',
        'url': '/compare/user'
    },

    'userDelete': {
        'method': 'delete',
        'url': '/compare/user'
    },

    'userMonitor': {
        'method': 'get',
        'url': '/compare/user/monitor'
    },

    'saveMonitor': {
        'method': 'post',
        'url': '/compare/user/monitor'
    },
    /****************** 上报数据情况  ******************/
    // 数据日进量统计
    'rowReport': {
        'method': 'post',
        'url': '/compare/analysis/row/report'
    },
    /****************** 质量评估标准  ******************/
    // 事后规则查询
    'queryAfter': {
        'method': 'get',
        'url': '/compare/standard/after/query'
    },
    // 事后规则评分标准
    'getAfterStandard': {
        'method': 'get',
        'url': '/compare/standard/after/info'
    },
    // 保存事后规则评分标准
    'modifyAfterStandard': {
        'method': 'post',
        'url': '/compare/standard/after/modify'
    },
    // 查询历史评分标准
    'history': {
        'method': 'get',
        'url': '/compare/standard/after/history'
    },
    /****************** 质量管理规则  ******************/
    // 规则树
    'ruleTree': {
        'method': 'get',
        'url': '/compare/management/rule/tree'
    },
    // 单表规则预览
    'overview': {
        'method': 'post',
        'url': '/compare/management/overview'
    },

    // 维护：右侧规则列表
    'rulelist': {
        'method': 'post',
        'url': '/compare/management/rule/list'
    },

    'exportQuery': {
        'method': 'post',
        'url': '/compare/export/query'
    },

    'daoChuZhiLiangBaobiao': {
        'method': 'post',
        'responseType': "blob",
        'url': '/compare/analysis/export'
    },
    // 更新规则状态：启用，停用
    'modifyStatus': {
        'method': 'get',
        'url': '/compare/rule/status/modify'
    },
    // 删除规则
    'removeRule': {
        'method': 'get',
        'url': '/compare/rule/delete'
    },
    // sql编辑页面，左侧规则列表
    'ruleGroupTree': {
        'method': 'get',
        'url': '/compare/management/rule/category/tree'
    },

    // 查询告警订阅
    'queryAlert':{
        'method': 'get',
        'url': '/compare/management/alert'
    },
    // 保存告警订阅
    'modifyAlert':{
        'method': 'post',
        'url': '/compare/management/alert'
    },

    /****************** 质量曾删改查 ******************/
    // 查询源目规则
    'querySourceTarget': {
        'method': 'post',
        'url': '/compare/rule/sourcetarget/query'
    },
    // 保存源目规则
    'modifySourceTarget': {
        'method': 'post',
        'url': '/compare/rule/sourcetarget/modify'
    },
    // 查询主子关系规则
    'queryMainDetail': {
        'method': 'post',
        'url': '/compare/rule/maindetail/query'
    },
    // 保存主子关系规则
    'modifyMainDetail': {
        'method': 'post',
        'url': '/compare/rule/maindetail/modify'
    },
    // 查询非空规则
    'queryNonEmpty': {
        'method': 'post',
        'url': '/compare/rule/nonempty/query'
    },
    // 保存非空规则
    'modifyNonEmpty': {
        'method': 'post',
        'url': '/compare/rule/nonempty/modify'
    },
    // 查询绝对值规则
    'queryAbs': {
        'method': 'post',
        'url': '/compare/rule/abs/query'
    },
    // 保存绝对值规则
    'modifyAbs': {
        'method': 'post',
        'url': '/compare/rule/abs/modify'
    },
    // 查询枚举值规则
    'queryEnum': {
        'method': 'post',
        'url': '/compare/rule/enum/query'
    },
    // 保存枚举
    'modifyEnum': {
        'method': 'post',
        'url': '/compare/rule/enum/modify'
    },
    // 报告
    'report': {
        'method': 'get',
        'url': '/compare/qualitymanagement/report'
    },

    'ziDingYiQuJianJianCeApi': {
        'method': 'post',
        'url': '/compare/standard/job/query'
    },

    // /compare/common/dict
    'getJiGou': {
        'method': 'get',
        'url': '/compare/dict'
    },

    'zhiXingQuJian': {
        'method': 'post',
        'url': '/compare/standard/job/create'
    },

    'getoverview': {
        'method': 'post',
        'url': '/compare/result/overview'
    },

    /****************** 问题稽查核对  ******************/
    // 知识库-规则树
    'getKnowledgeTree': {
        'method': 'get',
        'url': '/compare/issue/knowledge/ruleTree'
    },
    // 知识库-列表
    'postKnowledgeList': {
        'method': 'post',
        'url': '/compare/issue/knowledge/list'
    },
    // 反馈审核-提交知识库
    'postKnowledge': {
        'method': 'post',
        'url': '/compare/issue/knowledge/commit'
    },

    // 问题查询
    'getIssueQuery': {
        'method': 'post',
        'url': '/compare/issue/query'
    },
    // 核查详情
    'getIssueResult': {
        'method': 'post',
        'url': '/compare/issue/result'
    },
    // 问题提交
    'saveIssue': {
        'method': 'post',
        'url': '/compare/issue/save'
    },
    // 反馈核查、知识库菜单
    'getIssueMenu': {
        'method': 'get',
        'url': '/compare/issue/menu'
    },
    // 反馈核查查询
    'getIssueRuleQuery': {
        'method': 'post',
        'url': '/compare/issue/rule/query'
    },
    // 知识库查询
    'getIssueKnowledgeQuery': {
        'method': 'post',
        'url': '/compare/issue/knowledge/query'
    },
    // 知识库查询
    'issueCommit': {
        'method': 'post',
        'url': '/compare/issue/commit'
    },


    /****************** 机构维护  ******************/
    // 机构-查询
    'getDepartment': {
        'method': 'get',
        'url': '/compare/dept'
    },
    // 机构-保存，修改
     'saveDepartment': {
        'method': 'post',
        'url': '/compare/dept'
    },
    // 机构-删除
     'removeDepartment': {
        'method': 'delete',
        'url': '/compare/dept'
    },


    // 上报数据情况
     'countReport': {
        'method': 'post',
        'url': '/compare/count/report'
    },

    // 责任人-查询监控路径
    'getUserMonitor': {
        'method': 'get',
        'url': '/compare/user/monitor'
    },
    // 责任人-保存监控路径
    'saveUserMonitor': {
        'method': 'post',
        'url': '/compare/user/monitor'
    },

    /****************** 执行任务  ******************/
    // 执行任务-查询
    'getJobList': {
        'method': 'get',
        'url': '/compare/job/list'
    },
    // 执行任务-详情
    'getJobInfo': {
        'method': 'get',
        'url': '/compare/job/info'
    },
    // 执行任务-查询表
    'getJobTable': {
        'method': 'get',
        'url': '/compare/job/table'
    },
    // 执行任务-生成任务
    'addJob': {
        'method': 'post',
        'url': '/compare/job'
    },

    /****************** 元数据管理  ******************/
    // 库分页查询
    'getSchema': {
        'method': 'get',
        'url': meta + '/schema/page'
    },
    // 测试连接
    'putSchema': {
        'method': 'put',
        'url': meta + '/schema/',
        'resAll': true //返回所有信息
    },
    // 保存
    'postSchema': {
        'method': 'post',
        'url': meta + '/schema/'
    },
    // 删除
    'deleteSchema': {
        'method': 'delete',
        'url': meta + '/schema/',
    },

    // 数据库类型下拉
    'metadataDict': {
        'method': 'get',
        'url': meta + '/dict/',
    },

    // 目标库：表查询
    'metaRemoteTable': {
        'method': 'get',
        'url': meta + '/remote/table/list',
    },

    // 目标库：列查询
    'metaRemoteColumn': {
        'method': 'get',
        'url': meta + '/remote/column/list',
    },

    // 本地：表查询分页
    'getMetaTable': {
        'method': 'get',
        'url': meta + '/table/page',
    },

    // 本地：修改表名
    'putMetaTable': {
        'method': 'post',
        'url': meta + '/table/',
    },

    // 本地：删除表
    'deleteMetaTable': {
        'method': 'delete',
        'url': meta + '/table/',
    },

    // 目标库：导入
    'metaRemoteLoad': {
        'method': 'post',
        'url': meta + '/remote/load',
    },

    // 本地：表查询
    'metaTableList': {
        'method': 'get',
        'url': meta + '/table/list',
    },

    // 本地：字段查询
    'metaColumnList': {
        'method': 'get',
        'url': meta + '/column/list',
    },

    // 更新本地表字段
    'postMetaColumn': {
        'method': 'post',
        'url': meta + '/column/',
    },

    /****************** 主数据管理  ******************/
    // 分页获取字典信息
    'getMainData': {
        'method': 'get',
        'url': master + '/mainData',
        'resAll': true //返回所有信息
    },

    // 启用禁用状态修改
    'updateState': {
        'method': 'put',
        'url': master + '/mainData/state/',
        'resAll': true, //返回所有信息
    },

    // 新增字典信息
    'addDictionaryInfo': {
        'method': 'post',
        'url': master + '/mainData',
        'resAll': true, //返回所有信息
    },

    // 修改字典信息
    'updateDictionaryInfo': {
        'method': 'put',
        'url': master + '/mainData',
        'resAll': true, //返回所有信息
    },

    // 删除字典信息
    'delDictionaryInfo': {
        'method': 'delete',
        'url': master + '/mainData/',
        'resAll': true, //返回所有信息
    },

    // 分页查询明细
    'getDetailInfo': {
        'method': 'get',
        'url': master + '/mainData/detail',
        'resAll': true, //返回所有信息
    },

    // 获取字典类别（下拉选）
    'getMainDataType': {
        'method': 'get',
        'url': master + '/mainData/type',
        'resAll': true, //返回所有信息
    },

    // 获取医疗机构（下拉选）
    'getAllOrgan': {
        'method': 'get',
        'url': master + '/extend/code/all',
        'resAll': true, //返回所有信息
    },

    // 新增明细
    'addDetail': {
        'method': 'post',
        'url': master + '/mainData/detail',
        'resAll': true, //返回所有信息
    },

    // 修改明细
    'updateDetail': {
        'method': 'put',
        'url': master + '/mainData/detail',
        'resAll': true, //返回所有信息
    },

    // 删除明细
    'delDetail': {
        'method': 'delete',
        'url': master + '/mainData/detail/',
        'resAll': true, //返回所有信息
    },

    // 批量导入模板下载
    'getFormwork': {
        'method': 'get',
        'url': master + '/mainData/detail/download'
    },

    // 批量导入明细数据
    'uploadFile': {
        'method': 'post',
        'url': master + '/mainData/detail/import'
    },

};
export default API;

