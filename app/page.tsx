import Hero from "./components/Hero";
import Articles from "./components/Articles";
import BestSellingProducts from "./components/BestSellingProducts";
import HighestDiscounts from "./components/HighestDiscounts";
export default function Home() {
  return (
    <div>
      <Hero/>
      <BestSellingProducts/>
      <HighestDiscounts/>
    </div>
  );
}
