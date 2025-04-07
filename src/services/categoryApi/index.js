import { Category } from "../../types/category.type";
import request from "../request";

const CategoryApi = {
  createCategory(body: Category) {
    return request.post("/category", body);
  },

  getListCategories() {
    return request.get("/categories");
  },
  getSubCategories(parentId:string|null) {
    return request.get(`/category/sub-category/${parentId}`);
  },

  getCategory(slug: string | null) {
    return request.get(`/category/${slug}`);
  },

  updateCategory(slug: string, body: Category) {
    return request.put(`/category/${slug}`, body);
  },

  deleteCategory(slug: string) {
    return request.delete(`/category/${slug}`);
  },
};

export default CategoryApi;
