import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "./user";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(() => null),
    set: vi.fn(),
  },
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with correct default values", () => {
    const store = useUserStore();
    expect(store.token).toBeDefined();
  });

  it("isAuthorized is false when no token", () => {
    const store = useUserStore();
    store.token = null;
    expect(store.isAuthorized).toBe(false);
  });

  it("isAuthorized is true when token exists", () => {
    const store = useUserStore();
    store.token = "test-token";
    expect(store.isAuthorized).toBe(true);
  });

  it("setToken updates token value", () => {
    const store = useUserStore();
    const newToken = "new-test-token";

    store.setToken(newToken);

    expect(store.token).toBe(newToken);
  });

  it("setToken calls Cookies.set with correct parameters", async () => {
    const Cookies = await import("js-cookie");
    const store = useUserStore();
    const newToken = "new-test-token";

    store.setToken(newToken);

    expect(Cookies.default.set).toHaveBeenCalledWith("token", newToken, {
      expires: 1,
    });
  });

  it("token persists after setToken", () => {
    const store = useUserStore();
    const newToken = "persistent-token";

    store.setToken(newToken);

    expect(store.token).toBe(newToken);
    expect(store.isAuthorized).toBe(true);
  });
});
