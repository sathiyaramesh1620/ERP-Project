import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";

function YearPicker() {
  const { state, dispatcher } = useContext(OverheadsContext);
  const { month, year } = state;
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={"Year"}
        views={["year"]}
        styles={{height:"4px"}}
        onChange={(newValue) => dispatcher({ type: "date", payload: newValue })}
        value={moment(`${year}-${month}`)}
      />
    </LocalizationProvider>
  );
}

export default YearPicker;
