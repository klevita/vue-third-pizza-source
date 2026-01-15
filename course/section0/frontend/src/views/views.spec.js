import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createMemoryHistory } from "vue-router";

import HomeView from "./HomeView.vue";
import LoginView from "./LoginView.vue";
import PurchaseHistory from "./PurchaseHistory.vue";
import UserBin from "./UserBin.vue";
import UserProfile from "./UserProfile.vue";

vi.mock("@/api/main-service", () => ({
  MainService: {
    getDough: vi.fn(() => Promise.resolve([])),
    getIngredients: vi.fn(() => Promise.resolve([])),
    getSauces: vi.fn(() => Promise.resolve([])),
    getSizes: vi.fn(() => Promise.resolve([])),
    getMisc: vi.fn(() => Promise.resolve([])),
    getOrders: vi.fn(() => Promise.resolve([])),
    getAdresses: vi.fn(() => Promise.resolve([])),
    whoAmI: vi.fn(() =>
      Promise.resolve({ id: "1", name: "Test User", phone: "+7 999 999 99 99" }),
    ),
    login: vi.fn(() => Promise.resolve({ token: "test-token" })),
  },
}));

vi.mock("vue3-toastify", () => ({
  toast: vi.fn(),
}));

const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "Home", component: HomeView },
      { path: "/login", name: "Login", component: LoginView },
      { path: "/history", name: "History", component: PurchaseHistory },
      { path: "/bin", name: "Bin", component: UserBin },
      { path: "/profile", name: "Profile", component: UserProfile },
    ],
  });
};

describe("Page Mount Tests", () => {
  let pinia;
  let router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createTestRouter();
    vi.clearAllMocks();
  });

  describe("HomeView", () => {
    it("mounts without errors", () => {
      const wrapper = mount(HomeView, {
        global: {
          plugins: [pinia, router],
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("renders main content", () => {
      const wrapper = mount(HomeView, {
        global: {
          plugins: [pinia, router],
          stubs: {
            teleport: true,
          },
        },
      });

      expect(wrapper.find(".content").exists()).toBe(true);
    });
  });

  describe("LoginView", () => {
    it("mounts without errors", () => {
      const wrapper = mount(LoginView, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("renders login form", () => {
      const wrapper = mount(LoginView, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.find("form").exists()).toBe(true);
      expect(wrapper.find('input[type="email"]').exists()).toBe(true);
      expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    });

    it("has login button", () => {
      const wrapper = mount(LoginView, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });
  });

  describe("PurchaseHistory", () => {
    it("mounts without errors", async () => {
      const wrapper = mount(PurchaseHistory, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("renders title", () => {
      const wrapper = mount(PurchaseHistory, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      expect(wrapper.text()).toContain("История заказов");
    });

    it("shows empty state when no orders", async () => {
      const wrapper = mount(PurchaseHistory, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(wrapper.text()).toContain("У вас пока нет заказов");
    });
  });

  describe("UserBin", () => {
    it("mounts without errors", () => {
      const wrapper = mount(UserBin, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("renders cart title", () => {
      const wrapper = mount(UserBin, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.text()).toContain("Корзина");
    });

    it("shows empty cart message when no items", () => {
      const wrapper = mount(UserBin, {
        global: {
          plugins: [pinia, router],
        },
      });

      expect(wrapper.text()).toContain("В корзине нет ни одного товара");
    });
  });

  describe("UserProfile", () => {
    it("mounts without errors", async () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("renders title", () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      expect(wrapper.text()).toContain("Мои данные");
    });

    it("loads user data on mount", async () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(wrapper.text()).toContain("Test User");
    });

    it("has add address button", () => {
      const wrapper = mount(UserProfile, {
        global: {
          plugins: [pinia, router],
          stubs: {
            UserSidebar: true,
          },
        },
      });

      expect(wrapper.text()).toContain("Добавить новый адрес");
    });
  });
});
