import { useContext } from "react";
import DataContext from "../DataContext";

function Component() {
  const data = useContext(DataContext);
  const { WarrantyRegistered, uniqueData } = data;

  return <div>{WarrantyRegistered}</div>;
}

export default Component;
