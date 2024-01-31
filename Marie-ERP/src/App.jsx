import { Routes, Route } from "react-router-dom";
import GeneratePassword from "./pages/Login/GeneratePassword";
import Login from "./pages/Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration/Registration";
import RegistrationContext from "./pages/Registration/RegistrationContext";

import Sales from "./Dashboard/DashboardComponent/Sales";
import Home from "./Dashboard/DashboardComponent/Home";
import People from "./Dashboard/DashboardComponent/People";
import Ingredients from "./Dashboard/DashboardComponent/Ingredients/Ingredients";
import Overheads from "./Dashboard/DashboardComponent/Overheads";
import Payment from "./pages/Registration/Payment";
import EmailVerification from "./pages/EmailVerification/EmailVerification";
import EmailVerificationLink from "./pages/EmailVerification/EmailVerificationLink";

import Profile from "./Dashboard/DashboardComponent/Profile";
import Settings from "./Dashboard/DashboardComponent/Settings";
import DashboardLayout from "./Dashboard/DashboardLayout";
import IngredientsLayout from "./Dashboard/DashboardComponent/Ingredients/IngredientsLayout";
import IngredienstsContext from "./Dashboard/DashboardComponent/Ingredients/IngredienstsContext";
import SalesLayout from "./Dashboard/DashboardComponent/Sales/SalesLayout";
import ChannelType from "./Dashboard/DashboardComponent/Sales/ChannelType";
import SalesByChannel from "./Dashboard/DashboardComponent/Sales/SalesByChannel";
import SalesByMenu from "./Dashboard/DashboardComponent/Sales/SalesByMenu";
import SalesContext from "./Dashboard/DashboardComponent/Sales/SalesContext";
import Pantry from "./Dashboard/DashboardComponent/Ingredients/Pantry";
import PantryItems from "./Dashboard/DashboardComponent/Ingredients/PantryItems";
import StockLayout from "./Dashboard/DashboardComponent/Ingredients/StockLayout";
import StockItem from "./Dashboard/DashboardComponent/Ingredients/StockItem";
import Labour from "./Dashboard/DashboardComponent/Labour/Labour";
import AddNewLabour from "./Dashboard/DashboardComponent/Labour/AddNewLabour";
import Purchase from "./Dashboard/DashboardComponent/Ingredients/Purchase";
import PurchaseItem from "./Dashboard/DashboardComponent/Ingredients/PurchaseItem";
import EditLabours from "./Dashboard/DashboardComponent/Labour/EditLabours";
import LaboursContext, { LaboursDataContext } from "./Dashboard/DashboardComponent/Labour/LaboursContext";
import CostingHome from "./Dashboard/DashboardComponent/Costing/CostingHome";
import General from "./Dashboard/DashboardComponent/Costing/CostingComponents/General";
import CostingSales from "./Dashboard/DashboardComponent/Costing/CostingComponents/CostingSales";
import Sides from "./Dashboard/DashboardComponent/Costing/CostingComponents/Sides";
import CostIngredients from "./Dashboard/DashboardComponent/Costing/CostingComponents/CostIngredients";
import CostOverheads from "./Dashboard/DashboardComponent/Costing/CostingComponents/CostOverheads";
import DirectLabour from "./Dashboard/DashboardComponent/Costing/CostingComponents/DirectLabour";
import Performance from "./Dashboard/DashboardComponent/Costing/CostingComponents/Performance";
import CostingLayout from "./Dashboard/DashboardComponent/Costing/CostingLayout";
import CostContext from "./Dashboard/DashboardComponent/Costing/CostingComponents/CostContext";
import { OverHeadsProvider } from "./Dashboard/DashboardComponent/Overheads/OverHeadsContext";
import PrivateRoute from "./ProtectedRoutes/PrivateRoute";
import ProcessBuilder from "./Dashboard/DashboardComponent/ProcessBuilder/ProcessBuilder";
import LabourSetup from "./Dashboard/DashboardComponent/Labour/LabourSetup";
import LabourApply from "./Dashboard/DashboardComponent/Labour/LabourApply";
import LabourRecords from "./Dashboard/DashboardComponent/Labour/LabourRecords";
import LabourSummary from "./Dashboard/DashboardComponent/Labour/LabourSummary";
import { LabourLayout } from "./Dashboard/DashboardComponent/Labour/LabourLayout";
import LabourCreate from "./Dashboard/DashboardComponent/Labour/LabourCreation/LabourCreate";
import FormSummary from "./Dashboard/DashboardComponent/Labour/LabourCreation/FormSummary";
import Faq from "./Dashboard/DashboardComponent/Faq";
import RestDays from "./Dashboard/DashboardComponent/Labour/LabourCreation/RestDays";
import BalanceLeave from "./Dashboard/DashboardComponent/Labour/LabourCreation/BalanceLeave";
import LabourTraceable from "./Dashboard/DashboardComponent/Labour/LabourCreation/LabourTraceable";
import LabourActivity from "./Dashboard/DashboardComponent/Labour/LabourCreation/LabourActivity";
import EditLabour from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditLabour";
import EditRestDays from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditRestDays";
import EditBalanceLeave from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditBalanceLeave";
import EditLabourTraceable from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditLabourTraceable";
import EditLabourActivity from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditLabourActivity";
import EditFormSummary from "./Dashboard/DashboardComponent/Labour/LabourEdit/EditFormSummary";
import RestDaysHome from "./Dashboard/DashboardComponent/Labour/RestDaysHome";
import LabourTraceableAll from "./Dashboard/DashboardComponent/Labour/LabourTraceableAll";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/generatepassword/:id" element={<GeneratePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/payment" element={<Payment />} />

        <Route
          path="/registration"
          element={
            <RegistrationContext>
              <Registration />
            </RegistrationContext>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Home />} />

          <Route
            path="processbuilder"
            element={
              <PrivateRoute>
                <ProcessBuilder />
              </PrivateRoute>
            }
          />

          <Route
            path="overheads"
            
            element={
              <OverHeadsProvider>
                <Overheads />
              </OverHeadsProvider>
            }
          />

          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          {/*  */}
          <Route path="faq" element={<Faq />} />

          
          {/* <Route path="labour" element={<LaboursContext><LabourLayout /></LaboursContext>}>
            <Route
              index
              element={
                
                  <Labour />
              }
            />
            <Route path="summary" element={<LabourSummary />} />
            <Route path="setup" element={<LabourSetup />} />
            <Route path="apply" element={<LabourApply />} />
            <Route path="records" element={<LabourRecords />} />

            <Route path="records/c" element={<LabourCreate />}></Route>

            
            <Route
              path="records/c/r"
              element={<RestDays />}
            />
            <Route
              path="records/c/r/b"
              element={<BalanceLeave />}
            />
            <Route
              path="records/c/r/b/lt"
              element={<LabourTraceable />}
            />
            <Route
              path="records/c/r/b/lt/la"
              element={<LabourActivity />}
            />
            <Route
              path="records/c/r/b/lt/la/fs"
              element={<FormSummary />}
            />
          </Route> */}

<Route
            path="labour"
            element={
              <LaboursContext>
                <LabourLayout />
              </LaboursContext>
            }>
            <Route index element={<Labour />} />
            <Route path="summary" element={<LabourSummary />} />
            <Route path="setup" element={<LabourSetup />} />
            <Route path="apply" element={<LabourApply />} />
            <Route path="records" element={<LabourRecords />} />

            <Route path="records/c" element={<LabourCreate />} />
            <Route path="records/c/r" element={<RestDays />} />
            <Route path="records/c/r/b" element={<BalanceLeave />} />
           <Route path ="records/c/r/b/lt" element={<LabourTraceable />} />
            <Route path="records/c/r/b/lt/la" element={<LabourActivity />} />
            <Route path="records/c/r/b/lt/la/fs" element={<FormSummary />} />

            <Route path="records/e/:id" element={<EditLabour />} />
            <Route path="records/e/r" element={<EditRestDays />} />
            <Route path="records/e/r/b" element={<EditBalanceLeave />} />
            <Route path="records/e/r/b/lt" element={<EditLabourTraceable />} />
            <Route path="records/e/r/b/lt/la" element={<EditLabourActivity />} />
            <Route path="records/e/r/b/lt/la/fs" element={<EditFormSummary />} />
            <Route path="records/restDays/:id" element={<RestDaysHome />} />
            <Route path="records/traceable/:id" element={<LabourTraceableAll />} />

          </Route>

          <Route
            path="sales"
            element={
              <SalesContext>
                <SalesLayout />
              </SalesContext>
            }>
            <Route index element={<ChannelType />} />
            <Route path="channeltype" element={<ChannelType />} />
            <Route path="salesbychannel" element={<SalesByChannel />} />
            <Route path="salesbymenu" element={<SalesByMenu />} />
          </Route>

          <Route path="costing" element={<CostingHome />} />

          <Route
            path="cost"
            element={
              <CostContext>
                <CostingLayout />
              </CostContext>
            }>
            <Route index element={<General />} />
            <Route path="general" element={<General />} />
            <Route path="costsales" element={<CostingSales />} />
            <Route path="sides" element={<Sides />} />
            <Route path="costingredients" element={<CostIngredients />} />
            <Route path="costoverheads" element={<CostOverheads />} />
            <Route path="directlabour" element={<DirectLabour />} />
            <Route path="performance" element={<Performance />} />
          </Route>

          <Route
            path="ingredients"
            element={
              <IngredienstsContext>
                <IngredientsLayout />
              </IngredienstsContext>
            }>
            <Route index element={<Ingredients />} />
            <Route path="overview" element={<>Overview</>} />
            <Route path="Pantry" element={<Pantry />}>
              <Route index element={<>Please select categories</>} />
              <Route path=":item" element={<PantryItems />} />
            </Route>
            <Route path="stocktake" element={<StockLayout />}>
              <Route index element={<>Please select category</>} />
              <Route path=":id" element={<StockItem />} />
            </Route>

            <Route path="purchasing" element={<Purchase />}>
              <Route index element={<>Please select category</>} />
              <Route path=":id" element={<PurchaseItem />} />
            </Route>
          </Route>
        </Route>

        {/* <Route path="costing" element={<CostingHome />} /> */}

        <Route path="addnewlabours" element={<AddNewLabour />} />
        <Route path="editLabour/:employeeId" element={<EditLabours />} />
        <Route path="sales" element={<Sales />} />

        <Route path="/verifyemail" element={<EmailVerification />} />
        <Route
          path="/email-verification/:id"
          element={<EmailVerificationLink />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
