
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
  }
};

module.exports = apiMessage;