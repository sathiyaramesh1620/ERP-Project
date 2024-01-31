import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";
import { useEffect } from "react";

export default function DisplayInputValue({ data, index }) {
  const { state } = useContext(OverheadsContext);

  return (
    <p>
      <strong>{state.data[index].processBuilderRelationship[data]}% - </strong>
      {data}
    </p>
  );
}
