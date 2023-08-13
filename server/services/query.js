const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 0

const getPagination = query => {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT  // if limit is not specified, use the default limit of zero (zero
    const skip = (page - 1) * limit // skip can be negative if the page number is higher than the total number of pages. 描述： 返回从指定
    return { limit, skip }
}

module.exports = {
    getPagination
}
