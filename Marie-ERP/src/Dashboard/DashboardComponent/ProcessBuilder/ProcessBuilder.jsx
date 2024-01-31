import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Procurement from "./Procurement";
import { UserContext } from "../../../Context/UserContext";

export default function ProcessBuilder() {
  const [ processbuilder, setProcessbuilder ] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const getData = async () => {
    await axios
      .post("/Marie-ERP/api/processBuilder/init", {
        userId: user.userId ? user.userId : 7,
        month: "January",
        year: "2024",
      })
      .then((response) => {
        setProcessbuilder(response.data.data);
      })
      .then(setLoading(false))
      .catch((error) => console.error(error));
  };
  useEffect(() => {getData()}, []);

    if (loading) {
      return <p style={{display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center"}}>Fetching data please wait...</p>;
    }
      if (!processbuilder) {
        return (
          <p
            style={{
              display: "flex",
              minHeight: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}>
            Fetching data please wait...
          </p>
        );
      }

  return (
    <>
      <Procurement
        processbuilder={processbuilder}
        setProcessbuilder={setProcessbuilder}
      />
    </>
  );
}