import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";
import moment from "moment";

function MonthYearPicker() {
  const { state, dispatcher } = useContext(OverheadsContext);
  const { month, year } = state;
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={"Mon and Year"}
        views={["month", "year"]}
        onChange={(newValue) => dispatcher({ type: "date", payload: newValue })}
        value={moment(`${year}-${month}`)}
      />
    </LocalizationProvider>
  );
}

export default MonthYearPicker;
