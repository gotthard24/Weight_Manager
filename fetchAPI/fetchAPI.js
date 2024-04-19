const dbf = require('./config/config.js')

let recipec=null

async function getRecipe(){
    if (!recipec){
       let url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=681fac69b17140beaa6655931263c6c1&number=100' 
       res = await fetch(url)
       if(res.status != 200){
        throw new Error(`Status : ${res.status}`)
       }
       else{
        recipec = await res.json()
        let arrayOfRecepies = recipec.results
        let idsArray = []
        for(x of arrayOfRecepies){
            idsArray.push(x.id)
        }
        let ids = idsArray.join(',')
        let result = await getRecipeInfo(ids)
        let recipeId
        let trx
        try{
            const resultTrx = await dbf.transaction(async (transaction)=>{
                trx = transaction
                for (let x of result){
                    recipeId = await trx('recipes').insert({calories : x.nutrition.nutrients[0].amount,
                        carbohydrates : x.nutrition.nutrients[3].amount,
                        cuisines : x.cuisines.join(','),
                        diets : x.diets.join(','),
                        dishtypes : x.dishTypes.join(','),
                        fat : x.nutrition.nutrients[1].amount,
                        healthscore : x.healthScore,
                        image: x.image,
                        instructions : x.instructions,
                        nutrition_score : x.nutrition.properties[3].amount,
                        protein : x.nutrition.nutrients[8].amount,
                        ready_in_minutes : x.readyInMinutes,
                        servings : x.servings,
                        summary : x.summary,
                        title : x.title,
                        vegan : x.vegan,
                        vegetarian : x.vegetarian,
                        weightperserving : x.nutrition.weightPerServing.amount},).returning('id')
                        console.log(recipeId);
                        for (let ingredient of x.nutrition.ingredients){
                            await trx('ingredients').insert({amount : ingredient.amount,
                                                        name : ingredient.name,
                                                        recipe_id : recipeId[0].id,
                                                        unit : ingredient.unit})
                                    }
                } 

            })
            await trx.commit();
            return resultTrx 
        }
      catch(error){
        if(trx){
            await trx.rollback()
        }
        throw error
      }
       }
    }   
}
async function getRecipeInfo(ids){
    let url = `https://api.spoonacular.com/recipes/informationBulk?apiKey=681fac69b17140beaa6655931263c6c1&ids=${ids}&includeNutrition=true` 
    res = await fetch(url)
    if(res.status != 200){
    throw new Error(`Status : ${res.status}`)
    }
    else{
        recipec = await res.json()
        return recipec
    }
}

getRecipe()