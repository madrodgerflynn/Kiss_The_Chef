const router = require("express").Router();
const { Recipe, User } = require("../../Models/index");
const chalk = require("chalk");

// route --> /api/recipes
router.get("/", async (req, res) => {
  try {
    const dbRecipeData = await Recipe.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    console.log(chalk.red(dbRecipeData)); //we are not hitting this
    console.log(dbRecipeData[0]);
    const allRecipes = dbRecipeData.map((recipe) =>
      recipe.get({ plain: true })
    );
    console.log(chalk.blue({ allRecipes })); //or this
    // res.status(200).json(allRecipes);
    res.render("all-recipes", { allRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//finding one recipe by recipe id
// route --> /api/recipes/:id
router.get("/:id", async (req, res) => {
  try {
    const dbRecipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const recipe = dbRecipeData.get({ plain: true });
    res.render("one-recipe", { recipe, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// finding all recipes by matching user_id
// route --> /api/recipes/my/:user_id
router.get("/my/:user_id", async (req, res) => {
  try {
    const userRecipeData = await Recipe.findAll({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        model: User,
        attributes: ["username"],
      },
    });

    let allRecipes = [];
    for (const recipe of userRecipeData) {
      allRecipes.push(recipe.get({ plain: true }));
    }

    res.render("all-recipes", { allRecipes });
  } catch (err) {
    console.log(chalk.green("Oops. Failed to get recipes."));
    res.status(500).json(err);
  }
});

// post a new recipe to the database
router.post("/add-recipe", async (req, res) => {
  try {
    const dbRecipeData = await Recipe.create({
      title: req.body.title,
      image: req.body.image,
      ingredients: req.body.ingredients,
      recipe_steps: req.body.recipe_steps,
      user_id: req.body.user_id,
    });
    res.status(200).json(dbRecipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
