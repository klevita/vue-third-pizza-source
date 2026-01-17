import { apiClient } from "@/api/http-client";
import type {
  Address,
  CreateAddressRequest,
  Dough,
  Ingredient,
  LoginRequest,
  LoginResponse,
  User,
  Misc,
  Order,
  CreateOrderRequest,
  Sauce,
  Size,
} from "@/types/api";

export class MainService {
  static changeAdress(newAdress: Address): Promise<void> {
    return apiClient.put(`/addresses/${newAdress.id}`) as Promise<void>;
  }

  static deleteAdress(id: number): Promise<void> {
    return apiClient.post(`/addresses/${id}`) as Promise<void>;
  }

  static addAdress(newAdress: CreateAddressRequest): Promise<Address> {
    return apiClient.post(`/addresses`, newAdress) as Promise<Address>;
  }

  static getAdresses(): Promise<Address[]> {
    return apiClient.get(`/addresses`) as Promise<Address[]>;
  }

  static getDough(): Promise<Dough[]> {
    return apiClient.get(`/dough`) as Promise<Dough[]>;
  }

  static getIngredients(): Promise<Ingredient[]> {
    return apiClient.get(`/ingredients`) as Promise<Ingredient[]>;
  }

  static getMisc(): Promise<Misc[]> {
    return apiClient.get(`/misc`) as Promise<Misc[]>;
  }

  static getSauces(): Promise<Sauce[]> {
    return apiClient.get(`/sauces`) as Promise<Sauce[]>;
  }

  static getSizes(): Promise<Size[]> {
    return apiClient.get(`/sizes`) as Promise<Size[]>;
  }

  static login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post(`/login`, data) as Promise<LoginResponse>;
  }

  static logout(): Promise<void> {
    return apiClient.delete(`/logout`) as Promise<void>;
  }

  static whoAmI(): Promise<User> {
    return apiClient.get(`/whoAmI`) as Promise<User>;
  }

  static deleteOrder(id: number): Promise<void> {
    return apiClient.delete(`/orders/${id}`) as Promise<void>;
  }

  static createOrder(newOrder: CreateOrderRequest): Promise<Order> {
    return apiClient.post(`/orders`, newOrder) as Promise<Order>;
  }

  static getOrders(): Promise<Order[]> {
    return apiClient.get(`/orders`) as Promise<Order[]>;
  }
}
