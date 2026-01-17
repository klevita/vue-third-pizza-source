import type { Misc } from "./api";

// ----- Pizza Store Types -----
export interface CurrentPizzaIngredient {
  id: number;
  pizzaId: number;
  ingredientId: number;
  quantity: number;
  price?: number; // Added by store logic
  name?: string; // Used for display in constructor
}

export interface CurrentPizza {
  name: string;
  sauceId: number;
  doughId: number;
  sizeId: number;
  quantity: number;
  orderId: number;
  ingredients: CurrentPizzaIngredient[];
}

export interface MiscWithQuantity extends Misc {
  quantity: number;
}
