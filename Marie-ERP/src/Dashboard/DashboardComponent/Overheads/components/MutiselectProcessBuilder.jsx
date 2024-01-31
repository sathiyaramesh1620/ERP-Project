import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";
import Multiselect from "multiselect-react-dropdown";

function MutiselectProcessBuilder({ index, setStep, processBuilderoptions }) {
  const { state, dispatcher, processBuilder } = useContext(OverheadsContext);

  return (
    <>
      <Multiselect
      id="multi"
        selectedValues={
          state.data[index]?.processBuilderRelationship
            ? Object.keys(state.data[index].processBuilderRelationship)
            : null
        }
        options={processBuilderoptions}
        
        
        isObject={false}
        avoidHighlightFirstOption
        onSelect={(e) => {
          //   setRowData({
          //     ...rowData,
          //     categories: val,
          //     processBuilderRelationship: e.map((val) => ({ [val]: "" })),
          //   });
          dispatcher({
            type: "ProcessBuilderSelect",
            payload: { value: e, index },
          });
        }}
        onRemove={(e) => {
          //   setRowData({
          //     ...rowData,
          //     processBuilderRelationship: e.map((val) => ({ [val]: "" })),
          //   });
          dispatcher({
            type: "ProcessBuilderSelect",
            payload: { value: e, index },
          });
        }}
      />
      <span
        className="position-absolute bottom-0 end-0 btn me-2 mb-2"
        style={{
          border: "none",
          outline: "none",
          padding: "3px 15px",
          background: "#FCA311",
          borderRadius: "17px",
          color: "#ffffff",
        }}
        onClick={() => setStep("input")}>
        Next
      </span>
    </>
  );
}

export default MutiselectProcessBuilder;
