import { Component, OnInit,EventEmitter ,Output, ViewChild, ElementRef} from '@angular/core';
import { Ingredient } from 'src/app/Models/Ingredient.model';
import { ShoppingListService } from 'src/app/ServiceDependencies/ShoppingList.Service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {

  private shoppingListSrvcSubscription;
  @Output() public newIngredientAdded = new EventEmitter<Ingredient>()

  private editingIndex = -1;
  private btnActionText = 'Add';

  @ViewChild('AddIngrForm')
  private ingrForm:NgForm;

  @ViewChild('ingredientName')
  private nameRef:ElementRef;
  @ViewChild('Quantity')
  private quanRef:ElementRef;
  @ViewChild('units')
  private unitsRef:ElementRef;


  
  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit() {

    this.shoppingListSrvcSubscription = this.shoppingListService.EditingIngredient;
    this.shoppingListSrvcSubscription.subscribe
    ( index => 
      {
        this.editingIndex = index;
        this.btnActionText = 'Edit';

        // this.ingrForm.reset();
        var ingr = this.shoppingListService.GetIngredient(index);
        this.ingrForm.setValue({ingredientName:ingr.name,Quantity:ingr.quantity,units:Ingredient.GetUnitId(ingr.units)});
        console.log(this.ingrForm);
        
      }
    );

  }

//   AddIngredient(name:string, quantity:number, sUnit:number)
//   {
//     if (sUnit != 0){
//     this.shoppingListService.AddIngredient(new Ingredient(name,quantity,'',sUnit));
//       //  this.newIngredientAdded.emit(new Ingredient(name,quantity,''));
//   }
// }
Form_AdddIngredient(AddIngrForm:NgForm)
{
  var sUnit = AddIngrForm.value['units']
  if (sUnit != 0){
    const result = this.shoppingListService
    .AddIngredient(new Ingredient(AddIngrForm.value['ingredientName'],AddIngrForm.value['Quantity'],'',sUnit));
    if (result)
    { 
      AddIngrForm.reset(); 
      this.btnActionText = 'Add'; 
    }
  }
}
ResetForm(AddIngrForm:NgForm)
{
  AddIngrForm.reset();
  this.btnActionText  = 'Add';
  this.editingIndex  = -1;
}
DeleteIngredient(AddIngrForm:NgForm)
{
  if (this.editingIndex > -1)
  {
    const ingr = AddIngrForm.value;
    this.shoppingListService.DeleteIngredient(new Ingredient(ingr['ingredientName'],ingr['Quantity'],'',ingr['units']));
    AddIngrForm.reset();
    this.btnActionText = 'Add'
  }
  this.editingIndex = -1;
}
} 
