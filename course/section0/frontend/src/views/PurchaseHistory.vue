<template>
  <div>
    <UserSidebar />

    <div class="layout__content">
      <div class="layout__title">
        <h1 class="title title--big">История заказов</h1>
      </div>

      <section v-for="order in orders" :key="order.id" class="sheet order">
        <div class="order__wrapper">
          <div class="order__number">
            <b>Заказ #{{ order.id }}</b>
          </div>

          <div class="order__sum">
            <span>Сумма заказа: {{ calculateOrderTotal(order) }} ₽</span>
          </div>

          <div class="order__button">
            <button
              type="button"
              class="button button--border"
              @click="deleteOrder(order.id)"
            >
              Удалить
            </button>
          </div>
          <div class="order__button">
            <button type="button" class="button" @click="repeatOrder(order)">
              Повторить
            </button>
          </div>
        </div>

        <ul class="order__list">
          <li
            v-for="pizza in order.orderPizzas"
            :key="pizza.id"
            class="order__item"
          >
            <div class="product">
              <img
                src="@assets/img/product.svg"
                class="product__img"
                width="56"
                height="56"
                :alt="pizza.name"
              />
              <div class="product__text">
                <h2>{{ pizza.name }}</h2>
                <ul>
                  <li>
                    {{ getSizeName(pizza.sizeId) }} см,
                    {{ getDoughName(pizza.doughId) }}
                  </li>
                  <li>Соус: {{ getSauceName(pizza.sauceId) }}</li>
                  <li>Начинка: {{ getPizzaIngredients(pizza) }}</li>
                </ul>
              </div>
            </div>

            <p class="order__price">
              <template v-if="pizza.quantity > 1">
                {{ pizza.quantity }}×
              </template>
              {{ calculatePizzaPrice(pizza) }} ₽
            </p>
          </li>
        </ul>

        <ul v-if="order.orderMisc.length > 0" class="order__additional">
          <li v-for="item in order.orderMisc" :key="item.id">
            <img
              :src="getMiscItem(item.miscId)?.image"
              width="20"
              height="30"
              :alt="getMiscItem(item.miscId)?.name"
            />
            <p>
              <span>{{ getMiscItem(item.miscId)?.name }}</span>
              <b>
                <template v-if="item.quantity > 1">
                  {{ item.quantity }}×
                </template>
                {{ (getMiscItem(item.miscId)?.price || 0) * item.quantity }} ₽
              </b>
            </p>
          </li>
        </ul>

        <p class="order__address">Адрес доставки: {{ formatAddress(order) }}</p>
      </section>

      <div v-if="orders.length === 0" class="sheet">
        <p>У вас пока нет заказов</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { MainService } from "@/api/main-service";
import { usePizzaStore } from "@/stores/pizza";
import { toast } from "vue3-toastify";
import UserSidebar from "@/components/UserSidebar.vue";
import type {
  Order,
  OrderPizza,
  OrderMisc,
  PizzaIngredient,
} from "@/types/api";

const router = useRouter();
const pizzaStore = usePizzaStore();

const orders = ref<Order[]>([]);

onMounted(async () => {
  orders.value = await MainService.getOrders();
});

function getDoughName(doughId: number) {
  return pizzaStore.doughs.find(({ id }) => id === doughId)?.name || "";
}

function getSauceName(sauceId: number) {
  return pizzaStore.sauces.find(({ id }) => id === sauceId)?.name || "";
}

function getSizeName(sizeId: number) {
  return pizzaStore.sizes.find(({ id }) => id === sizeId)?.name || "";
}

function getIngredientName(ingredientId: number) {
  return (
    pizzaStore.ingridients.find(({ id }) => id === ingredientId)?.name || ""
  );
}

function getMiscItem(miscId: number) {
  return pizzaStore.misc.find(({ id }) => id === miscId);
}

function calculatePizzaPrice(pizza: OrderPizza) {
  const pizzaWithIngredients = {
    ...pizza,
    ingredients: (pizza.ingredients || []).map((ing: PizzaIngredient) => {
      const ingredient = pizzaStore.ingridients.find(
        ({ id }) => id === ing.ingredientId,
      );
      return ingredient;
    }),
  };

  return pizzaStore.calculatePizzaPrice(pizzaWithIngredients as any);
}

function calculateOrderTotal(order: Order) {
  const pizzasTotal = order.orderPizzas.reduce(
    (acc: number, pizza: OrderPizza) => acc + calculatePizzaPrice(pizza),
    0,
  );

  const miscTotal = order.orderMisc.reduce((acc: number, item: OrderMisc) => {
    const miscItem = getMiscItem(item.miscId);
    return acc + (miscItem?.price || 0) * item.quantity;
  }, 0);

  return pizzasTotal + miscTotal;
}

async function deleteOrder(orderId: number) {
  await MainService.deleteOrder(orderId);
  orders.value = orders.value.filter((order) => order.id !== orderId);
  toast("Заказ удален", { type: "success" });
}

function repeatOrder(order: Order) {
  for (const pizza of order.orderPizzas) {
    const pizzaData = {
      name: pizza.name,
      sauceId: pizza.sauceId,
      doughId: pizza.doughId,
      sizeId: pizza.sizeId,
      quantity: pizza.quantity,
      ingredients: pizza.ingredients.map((ing: PizzaIngredient) => {
        const ingredient = pizzaStore.ingridients.find(
          ({ id }) => id === ing.ingredientId,
        );
        return ingredient;
      }),
    };
    pizzaStore.pizzas.push(pizzaData as any);
  }

  for (const item of order.orderMisc) {
    const miscItem = getMiscItem(item.miscId);
    if (miscItem) {
      for (let i = 0; i < item.quantity; i++) {
        pizzaStore.pushMisc(miscItem);
      }
    }
  }

  toast("Заказ добавлен в корзину", { type: "success" });
  router.push({ name: "Bin" });
}

function formatAddress(order: Order) {
  if (!order.orderAddress) {
    return "Самовывоз";
  }
  const addr = order.orderAddress;
  return addr.name || `${addr.street}, д.${addr.building}, кв.${addr.flat}`;
}

function getPizzaIngredients(pizza: OrderPizza) {
  return (pizza.ingredients || [])
    .map((ing: PizzaIngredient) => getIngredientName(ing.ingredientId))
    .join(", ");
}
</script>
<style scoped lang="scss">
@import "@assets/scss/layout/layout";
@import "@assets/scss/layout/sheet";
</style>
