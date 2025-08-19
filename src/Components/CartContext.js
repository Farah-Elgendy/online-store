import { createContext, useContext, useReducer, useMemo } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.item;
      const idx = state.items.findIndex((i) => i.key === item.key);
      const items =
        idx >= 0
          ? state.items.map((i, n) => (n === idx ? { ...i, qty: i.qty + item.qty } : i))
          : [...state.items, item];
      const count = items.reduce((s, i) => s + i.qty, 0);
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      return { items, count, total };
    }
    case "REMOVE": {
      const items = state.items.filter((i) => i.key !== action.key);
      const count = items.reduce((s, i) => s + i.qty, 0);
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      return { items, count, total };
    }
    case "CLEAR":
      return { items: [], count: 0, total: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], count: 0, total: 0 });

  const value = useMemo(
    () => ({
      ...state,
      addItem: (item) => dispatch({ type: "ADD", item }),
      removeItem: (key) => dispatch({ type: "REMOVE", key }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
