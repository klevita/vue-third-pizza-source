import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePizzaStore } from "./pizza";

vi.mock("@/api/main-service", () => ({
  MainService: {
    getDough: vi.fn(() =>
      Promise.resolve([
        { id: 1, name: "Тонкое", price: 100 },
        { id: 2, name: "Толстое", price: 150 },
      ]),
    ),
    getIngredients: vi.fn(() =>
      Promise.resolve([
        { id: 1, name: "Моцарелла", price: 50 },
        { id: 2, name: "Томаты", price: 30 },
      ]),
    ),
    getSauces: vi.fn(() =>
      Promise.resolve([
        { id: 1, name: "Томатный", price: 20 },
        { id: 2, name: "Сливочный", price: 25 },
      ]),
    ),
    getSizes: vi.fn(() =>
      Promise.resolve([
        { id: 1, name: "23", multiplier: 1 },
        { id: 2, name: "32", multiplier: 1.5 },
      ]),
    ),
    getMisc: vi.fn(() =>
      Promise.resolve([
        { id: 1, name: "Кола", price: 100, image: "cola.svg" },
        { id: 2, name: "Соус", price: 50, image: "sauce.svg" },
      ]),
    ),
  },
}));

vi.mock("vue3-toastify", () => ({
  toast: vi.fn(),
}));

describe("Pizza Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with correct default values", () => {
    const store = usePizzaStore();
    expect(store.currentPizza).toBeDefined();
    expect(store.pizzas).toEqual([]);
    expect(store.selectedMisc).toEqual([]);
  });

  it("fetches pizza data on initialization", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(store.doughs.length).toBeGreaterThan(0);
    expect(store.sauces.length).toBeGreaterThan(0);
    expect(store.sizes.length).toBeGreaterThan(0);
    expect(store.ingridients.length).toBeGreaterThan(0);
    expect(store.misc.length).toBeGreaterThan(0);
  });

  it("calculates pizza price correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const pizza = {
      sauceId: 1,
      doughId: 1,
      sizeId: 1,
      quantity: 1,
      ingredients: [
        { id: 1, price: 50 },
        { id: 2, price: 30 },
      ],
    };

    const price = store.calculatePizzaPrice(pizza);
    expect(price).toBe((100 + 20 + 50 + 30) * 1 * 1);
  });

  it("calculates pizza price with multiplier", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const pizza = {
      sauceId: 1,
      doughId: 1,
      sizeId: 2,
      quantity: 2,
      ingredients: [{ id: 1, price: 50 }],
    };

    const price = store.calculatePizzaPrice(pizza);
    expect(price).toBe((100 + 20 + 50) * 1.5 * 2);
  });

  it("adds ingredient to current pizza", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const ingredient = { id: 1, name: "Моцарелла", price: 50 };
    const initialLength = store.currentPizza.ingredients.length;

    store.addIngredient(ingredient);

    expect(store.currentPizza.ingredients.length).toBe(initialLength + 1);
    expect(
      store.currentPizza.ingredients[store.currentPizza.ingredients.length - 1],
    ).toEqual(ingredient);
  });

  it("removes ingredient from current pizza by id", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const ingredient = { id: 1, name: "Моцарелла", price: 50 };
    store.addIngredient(ingredient);

    const lengthBefore = store.currentPizza.ingredients.length;
    store.removeIngredientById(1);
    const lengthAfter = store.currentPizza.ingredients.length;

    expect(lengthAfter).toBe(lengthBefore - 1);
  });

  it("adds pizza to bin", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    const initialLength = store.pizzas.length;

    store.pushPizzaToBin();

    expect(store.pizzas.length).toBe(initialLength + 1);
    expect(store.pizzas[store.pizzas.length - 1].name).toBe("Test Pizza");
  });

  it("prevents duplicate pizza names in bin", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.pushPizzaToBin();

    store.currentPizza.name = "Test Pizza";
    const lengthBefore = store.pizzas.length;
    store.pushPizzaToBin();

    expect(store.pizzas.length).toBe(lengthBefore);
  });

  it("decrements pizza quantity", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.quantity = 2;
    store.pushPizzaToBin();

    store.decrementPizzaByName("Test Pizza");

    const pizza = store.pizzas.find((p) => p.name === "Test Pizza");
    expect(pizza.quantity).toBe(1);
  });

  it("removes pizza when quantity reaches 0", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.quantity = 1;
    store.pushPizzaToBin();

    store.decrementPizzaByName("Test Pizza");
    const lengthBefore = store.pizzas.length;
    store.decrementPizzaByName("Test Pizza");

    expect(store.pizzas.length).toBe(lengthBefore - 1);
  });

  it("adds misc item correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const miscItem = store.misc[0];
    store.pushMisc(miscItem);

    expect(store.selectedMisc.length).toBe(1);
    expect(store.selectedMisc[0].quantity).toBe(1);
  });

  it("increments misc item quantity on multiple adds", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const miscItem = store.misc[0];
    store.pushMisc(miscItem);
    store.pushMisc(miscItem);

    expect(store.selectedMisc.length).toBe(1);
    expect(store.selectedMisc[0].quantity).toBe(2);
  });

  it("removes misc item correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const miscItem = store.misc[0];
    store.pushMisc(miscItem);
    store.pushMisc(miscItem);

    store.removeMisc(miscItem);

    expect(store.selectedMisc[0].quantity).toBe(1);
  });

  it("counts misc item quantity correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const miscItem = store.misc[0];
    store.pushMisc(miscItem);
    store.pushMisc(miscItem);

    const count = store.countMisc(miscItem);
    expect(count).toBe(2);
  });

  it("returns 0 for misc item not in cart", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const miscItem = store.misc[0];
    const count = store.countMisc(miscItem);

    expect(count).toBe(0);
  });

  it("gets pizza sauce by name", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.sauceId = 1;
    store.pushPizzaToBin();

    const sauce = store.getPizzaSauceByName("Test Pizza");
    expect(sauce).toBeDefined();
    expect(sauce.id).toBe(1);
  });

  it("gets pizza dough by name", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.doughId = 1;
    store.pushPizzaToBin();

    const dough = store.getPizzaDoughByName("Test Pizza");
    expect(dough).toBeDefined();
    expect(dough.id).toBe(1);
  });

  it("gets pizza size by name", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.sizeId = 1;
    store.pushPizzaToBin();

    const size = store.getPizzaSizeByName("Test Pizza");
    expect(size).toBeDefined();
    expect(size.id).toBe(1);
  });

  it("clears cart correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.pushPizzaToBin();
    store.pushMisc(store.misc[0]);

    store.clearCart();

    expect(store.pizzas.length).toBe(0);
    expect(store.selectedMisc.length).toBe(0);
  });

  it("calculates current full price correctly", async () => {
    const store = usePizzaStore();
    await new Promise((resolve) => setTimeout(resolve, 100));

    store.currentPizza.name = "Test Pizza";
    store.currentPizza.sauceId = 1;
    store.currentPizza.doughId = 1;
    store.currentPizza.sizeId = 1;
    store.currentPizza.quantity = 1;
    store.currentPizza.ingredients = [{ id: 1, price: 50 }];
    store.pushPizzaToBin();

    store.pushMisc(store.misc[0]);

    expect(store.currentFullPrice).toBeGreaterThan(0);
  });
});
