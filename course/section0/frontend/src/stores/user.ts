import { defineStore } from "pinia";
import { computed, ref } from "vue";
import Cookies from "js-cookie";

export const useUserStore = defineStore("user-store", () => {
  const token = ref<string | null>(Cookies.get("token") || null);

  const isAuthorized = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    Cookies.set("token", newToken, { expires: 1 });
  }

  return { isAuthorized, setToken, token };
});
