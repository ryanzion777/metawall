
const apiMessage = {
  FAIL: {
    status: 0,
    message: '失敗',
    statusCode: 400,
  },
  SUCCESS: {
    status: 1,
    message: '成功',
    statusCode: 200,
  },
  FIELD_FAIL: {
    status: 2,
    message: '資料欄位有誤或缺少欄位',
    statusCode: 400,
  },
  ID_FAIL: {
    status: 3,
    message: '請確認ＩＤ是否存在，找不到對應的ＩＤ',
    statusCode: 400,
  },
  LOGIN_FAILED: {
    status: 4,
    message: '登入失敗',
    statusCode: 400,
  },
  PERMISSION_DENIED: {
    status: 5,
    message: '權限不足',
    statusCode: 403,
  },
  ROUTER_NOT_FOUND: {
    status: 9000,
    message: '找不到路由',
    statusCode: 404,
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: '發生錯誤，請稍後再試',
    statusCode: 500,
  }
};

module.exports = apiMessage;