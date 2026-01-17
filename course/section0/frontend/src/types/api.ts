// ============================================
// API Response & Request Types
// ============================================

// ----- Address Types -----
export interface Address {
  id: number;
  name: string;
  userId: string;
  street: string;
  building: string;
  flat: string;
  comment: string;
}

export type CreateAddressRequest = Omit<Address, "id">;
export type UpdateAddressRequest = Address;

// ----- Authentication Types -----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
}

// ----- Pizza Ingredient Types -----
export interface Dough {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export interface Ingredient {
  id: number;
  name: string;
  image: string;
  price: number;
}

export interface Sauce {
  id: number;
  name: string;
  price: number;
}

export interface Size {
  id: number;
  name: string;
  image: string;
  multiplier: number;
}

export interface Misc {
  id: number;
  name: string;
  image: string;
  price: number;
}

// ----- Order Types -----
export interface PizzaIngredient {
  id: number;
  pizzaId: number;
  ingredientId: number;
  quantity: number;
}

export interface OrderPizza {
  id: number;
  name: string;
  sauceId: number;
  doughId: number;
  sizeId: number;
  quantity: number;
  orderId: number;
  ingredients: PizzaIngredient[];
}

export interface OrderMisc {
  id: number;
  orderId: number;
  miscId: number;
  quantity: number;
}

export interface OrderAddress {
  id: number;
  name: string;
  street: string;
  building: string;
  flat: string;
  comment: string;
  userId: string;
}

export interface Order {
  id: number;
  userId: string;
  addressId: number;
  orderPizzas: OrderPizza[];
  orderMisc: OrderMisc[];
  orderAddress: OrderAddress;
}

export interface CreateOrderRequest {
  userId: string;
  addressId: number;
  orderPizzas: Omit<OrderPizza, "id" | "orderId">[];
  orderMisc: Omit<OrderMisc, "id" | "orderId">[];
}
