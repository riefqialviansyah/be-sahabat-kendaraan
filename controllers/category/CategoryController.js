const { Category } = require("../../models");

class CategoryController {
  static async add(req, res, next) {
    try {
      const { name } = req.body;
      const UserId = req.user.id;
      const roleAdd = req.user.role;

      const category = await Category.create({ name, UserId, roleAdd });

      res
        .status(201)
        .json({ message: "Category added successfully", data: category });
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res) {
    const categories = await Category.findAll();

    res.status(200).json({ message: "Categories fetched", data: categories });
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== category.UserId) {
        throw { name: "Unauthorized", message: "You are not authorized" };
      }

      await category.update({ name });

      res.status(200).json({ message: "Category updated", data: category });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
