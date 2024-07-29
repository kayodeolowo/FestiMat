const paginate = (data, page, pageSize) => {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
  
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (page - 1) * pageSize;
    const paginatedData = data.slice(skip, skip + pageSize);
  
    return {
      totalItems,
      totalPages,
      currentPage: page,
      data: paginatedData
    };
  };
  
  const search = (data, searchTerm, fields) => {
    if (!searchTerm) return data;
    
    const regex = new RegExp(searchTerm, 'i');
    return data.filter(item =>
      fields.some(field => regex.test(item[field]))
    );
  };
  
  module.exports = { paginate, search };
  