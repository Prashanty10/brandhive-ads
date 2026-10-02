import mongoose from "mongoose";

/**
 * Centralized Reusable Server-Side Pagination Utility
 *
 * @param {import('mongoose').Model} model - Mongoose Model to query
 * @param {Object} filter - Filter query object (e.g. { status: 'active' })
 * @param {Object} options - Options containing reqQuery, populateOptions, selectFields, defaultSort
 * @returns {Promise<Object>} Standardized paginated response schema
 */
export const paginate = async (model, filter = {}, options = {}) => {
  const {
    reqQuery = {},
    populateOptions = null,
    selectFields = null,
    defaultSort = { createdAt: -1 },
    lean = true,
  } = options;

  // Validate & parse page number (minimum 1, default 1)
  const pageRaw = parseInt(reqQuery.page, 10);
  const page = !isNaN(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  // Validate & parse limit (default 20, max 100)
  const limitRaw = parseInt(reqQuery.limit, 10);
  let limit = !isNaN(limitRaw) && limitRaw > 0 ? limitRaw : 20;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  // Determine sort order
  let sort = defaultSort;
  if (reqQuery.sort) {
    if (reqQuery.sort === "price_asc" || reqQuery.sort === "price_low") sort = { price: 1 };
    else if (reqQuery.sort === "price_desc" || reqQuery.sort === "price_high") sort = { price: -1 };
    else if (reqQuery.sort === "views") sort = { views: -1 };
    else if (reqQuery.sort === "oldest") sort = { createdAt: 1 };
    else if (reqQuery.sort === "newest") sort = { createdAt: -1 };
  }

  // Calculate total documents matching filter
  const total = await model.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;

  // Construct Mongoose Query
  let query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (selectFields) {
    query = query.select(selectFields);
  }

  if (populateOptions) {
    if (Array.isArray(populateOptions)) {
      populateOptions.forEach((pop) => {
        query = query.populate(pop);
      });
    } else {
      query = query.populate(populateOptions);
    }
  }

  if (lean) {
    query = query.lean();
  }

  const data = await query;

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export default paginate;
