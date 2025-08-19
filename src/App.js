import MainPage from "./Pages/MainPage";
import { CartProvider } from "./Components/CartContext";

export default function App() {
  return (
    <CartProvider>
      <MainPage />
    </CartProvider>
  );
}
