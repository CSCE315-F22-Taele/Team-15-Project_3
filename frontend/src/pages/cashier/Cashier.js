import Header from "../../components/Header";
import OrderView from "../view/OrderView";
import Mapper from "../../components/Map/MapComponent";

/**
 * Creates the cashier setup page
 * @returns The cashier setup page
 */
export default function Cashier() {
  return (
    <div>
      <Header name={"Cashier"} />
      <OrderView user={"cashier"} />
      <Mapper/>
    </div>
  );
}
