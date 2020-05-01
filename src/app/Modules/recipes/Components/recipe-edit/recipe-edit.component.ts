import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/ServiceDependencies/Recipe.Service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Recipe } from 'src/app/Models/Recipe.model';
import { Ingredient } from 'src/app/Models/Ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  private editMode:boolean;
  private recipeId= -1;
  // private title:string;
  private recForm:FormGroup;

  private editingRec:Recipe;

  private recipeName:string;
  private recipeImagePath:string;

  constructor(private router:Router, private recipeService: RecipeService, private activeRoute: ActivatedRoute) 
  {
  }
  ngOnInit() 
  {
    this.activeRoute.params.subscribe
      (
        params => 
          {
            this.editMode = params['index'];
            this.recipeId = params['index'];
            this.editingRec = this.recipeService.GetRecipe(this.recipeId);
            this.ConstructForm();
          }
      );
  }
  
  ConstructForm()
  {
    var recName:string = null;
    var recImagePath:string = null;
    var recDescription:string = null;
    var ingredients = new FormArray([]);
    // var recipeIngredients:Ingredient[];
    if (this.editMode)
    {
      recName = this.editingRec.name;
      recImagePath = this.editingRec.imagePath;
      recDescription = this.editingRec.description;
      // recipeIngredients = ;
      for (let ing of this.editingRec.ingredients )
      {
        ingredients.push(
          new FormGroup
            ({
              'ingName':new FormControl(ing.name,Validators.required),
              'ingQuantity':new FormControl(ing.quantity,Validators.required),
              'ingUnits':new FormControl(Ingredient.GetUnitId(ing.units),Validators.required)
            }) 
          )
      }
    }
    this.recipeName = recName;
    this.recipeImagePath = recImagePath;
    this.recForm = new FormGroup
    ({
      'recName':new FormControl(this.recipeName,Validators.required),
      'recImagePath':new FormControl(this.recipeImagePath,Validators.required),
      'recDescription':new FormControl(recDescription,Validators.required),
      'recIngredients':ingredients
    });
  }
  GetIngredients()
  {
    return (<FormArray>this.recForm.get('recIngredients')).controls;
  }
  AddNewIngredient()
  {
    (<FormArray>this.recForm.get('recIngredients')).controls.push
      ( new FormGroup
        ({
          'ingName':new FormControl(null,Validators.required),
          'ingQuantity':new FormControl(null, [Validators.required]),
          'ingUnits':new FormControl(null, [Validators.required])
        }) 
    )
    // return false;
  }
  DeleteIngredient(index:number)
  {
    (<FormArray>this.recForm.get('recIngredients')).controls.splice(index,1);
  }

  RecipeNameChanged()
  {
    this.recipeImagePath = 'https://source.unsplash.com/1000x200/?'+this.recipeName.split(' ').join('');
  }

  SaveRecipe()
  {
    var rName = this.recForm.get('recName').value;
    var rImgPath = this.recForm.get('recImagePath').value;
    var rDesc = this.recForm.get('recDescription').value;
    var rIngs = (<FormArray>this.recForm.get('recIngredients')).controls;
    var rIngLst = []
    for(var ingIndex = 0; ingIndex<rIngs.length; ingIndex++)
    {
      var ingrGrp = rIngs[ingIndex]
      rIngLst.push
      (
        new Ingredient
        (
           ingrGrp.get('ingName').value, 
           ingrGrp.get('ingQuantity').value,
           'Preparation',
           ingrGrp.get('ingUnits').value
        )
      )
    }
    var recipe = new Recipe(rName,rDesc,rImgPath,rIngLst)
    if(!this.editMode)
    {
      var id = this.recipeService.AddRecipe(recipe);
      this.router.navigate(['../'+id.toString()],
       {relativeTo:this.activeRoute,fragment:'crd_div'+id.toString()});
    }
    else
    {
      if (this.recipeService.EditedRecipe(recipe,this.recipeId))
      {
        // this.editingRec= recipe; 
        this.editMode = false;
        this.editingRec = null;
        this.router.navigate(['../'],{relativeTo:this.activeRoute,fragment:'crd_div'+this.recipeId.toString()})
      }
    }
  }
  CancelEdit()
  {
    this.recForm.reset();
    if (this.editMode)
    {
      this.editMode = false;
      this.editingRec = null;
      // this.router.navigate(['../'],{relativeTo:this.activeRoute,fragment:'crd_div'+this.recipeId.toString()})
    }
    this.router.navigate(['../']);
    // else{
      // this.router.navigate(['../'],{relativeTo:this.activeRoute})
    // }
  }
}
