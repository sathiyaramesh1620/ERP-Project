import React from "react";
import { useState, useEffect, useContext } from "react";
import { createContext } from "react";
import axios from "axios";
export const SalesDataContext = createContext();
import { UserContext } from "../../../Context/UserContext";

const SalesContext = ({ children }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false)
  const [selectedMMYYYY, setSelectedMMYYYY] = useState({
    month: "",
    year: "",
  });

  useEffect(() => {
    setLoading(true);
    setChannels((prevChannels) => {
      const resetChannels = prevChannels.map((channel) => {
        return {
          ...channel,
          active: false,
          food: "",
          beverages: "",
        };
      });
      setSalesData(resetChannels);
      return resetChannels;
    });
    const data = {
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
    };
    const fetchdata = async () => {

   
    axios
      .post("/Marie-ERP/api/sales_month", data)
      .then((response) => {
        console.log(response.data.data, 'AAAAA');
        const salesChannels = response.data.data.sales_channel;
        const salesChannelData = response.data.data.sales_channel_data;

        setChannels((prevChannels) => {
          const updatedChannels = prevChannels.map((channel, i) => {
            const matchedItem = salesChannels.find(
              (item) => item.reach === channel.name
            );
            if (matchedItem) {
              const index = salesChannels.findIndex(
                (item) => item.reach === channel.name
              );
              return {
                ...channel,
                active: true,
                food: salesChannelData.food_values[index],
                beverages: salesChannelData.beverages_values[index],
              };
            }
            return channel;
          });
          setSalesData(updatedChannels);
          return updatedChannels;
        });
        setLoading(false); })
      .catch((error) => {
        console.error("Error fetching sales_month_data:", error);
        setLoading(false);
      }) 
    }
    fetchdata()
  }, [selectedMMYYYY.month, selectedMMYYYY.year]);

  const [channels, setChannels] = useState([])

  useEffect(() => {
    const data = {
      month: selectedMMYYYY.month,
      year: selectedMMYYYY.year,
      userId: user.userId ? user.userId : "555",
    };
    setLoading(true)
    const fetchData = async () => {
 await axios.post('/Marie-ERP/api/init')
    .then((res) => {
      console.log(res.data, 'RESPONSE')
      const channelList = updatedChannels(res.data.data)
      console.log(res.data.data)
      setChannels(channelList)
      setLoading(false)
    })
    .catch(error => {
      console.error('There was an error!', error)
      setLoading(false)
    })}
    fetchData()
  },[selectedMMYYYY.month, selectedMMYYYY.year])
  

  //console.log(channels)
  const updatedChannels = (channels) => {
     console.log(channels, 'RESPONSE')
    //  for(let i = 0; i < channels.length; i++){
    //   cons
    //  }
    return channels.map((obj, index) => {
      //console.log(obj.name, 'NAME')
      let newObj = {...obj, id: index + 1,
                            active: false,
                            food: "",
                            beverages: ""}
      return newObj
      })
  } 

  //console.log(channels , 'Line 83')

  const [salesData, setSalesData] = useState(null);

  return (
    <SalesDataContext.Provider
      value={{
        selectedMMYYYY,
        setSelectedMMYYYY,
        channels,
        setChannels,
        salesData,
        setSalesData,
      }}>
      {children}
    </SalesDataContext.Provider>
  );
};

export default SalesContext;
