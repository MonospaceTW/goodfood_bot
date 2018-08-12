const { exports } = module;

exports.getDefaultAdminResponse = () => {
  return {
    success: true,
    status: 200,
    message: 'successed',
    type: ''
  };
};

exports.paginationView = (items, pagination, total) => {
  let {page, limit, sort} = pagination;
  return {
    total,
    perPage: parseInt(limit),
    currentPage: parseInt(page),
    sort: +sort,
    lastPage: Math.ceil(total / limit),
    items
  };
};

// for sequelize
exports.getPaginationOptions = (pagination) => {
  let { page = 1, limit = 5, orderColumn = 'id', sort = 0 } = pagination;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = 0;
  if (page !== 1) offset = (page - 1) * limit;
  let result = {
    offset, limit, order: [[orderColumn, ConvertSqlSort(sort)]]
  };

  return result;
};

const ConvertSqlSort = (sort) => {
  return sort === 0 ? 'ASC' : 'DESC';
};
