import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import React from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WaiterLogin from './screens/WaiterLogin'
import WDashboard from './screens/Waiter/Dashboard'
import CookLogin from './screens/CookLogin'
import CDashboard from './screens/Cook/Dashboard'
import OwnerLogin from './screens/OwnerLogin'
import ODashboard from './screens/Owner/Dashboard'
import Employee from './screens/Owner/Employee'
import Category from './screens/Owner/Category'
import FoodItem from './screens/Owner/FoodItem'
import Table from './screens/Owner/Table'
import ViewOrder from './components/ViewOrder'
import Bill from './screens/Owner/Bill'
// import { AuthProvider } from './store/auth'
import CompletedOrdersPage from './screens/Owner/History'
import ProtectedRoute from './components/ProtectedRoute'
import HistoryOrderView from './screens/Owner/HistoryView'
import Revenue from './screens/Owner/Revenue'
function App() {
  return (
    <>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/waiterlogin' element={<WaiterLogin />} />
            <Route exact path='/cooklogin' element={<CookLogin />} />
            <Route exact path='/ownerlogin' element={<OwnerLogin />} />

            <Route element={<ProtectedRoute roles={['waiter']} />}>
              <Route exact path='/waiter/dashboard' element={<WDashboard />} />
              <Route exact path='/vieworder/:tableId' element={<ViewOrder />} />
            </Route>

            <Route element={<ProtectedRoute roles={['cook']} />}>
              <Route exact path='/cook/dashboard' element={<CDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={['owner']} />}>
              <Route exact path='/owner/dashboard' element={<ODashboard />} />
              <Route exact path='/owner/employee' element={<Employee />} />
              <Route exact path='/owner/category' element={<Category />} />
              <Route exact path='/owner/FoodItem' element={<FoodItem />} />
              <Route exact path='/owner/Table' element={<Table />} />
              <Route exact path='/vieworder/:tableId' element={<ViewOrder />} />
              <Route exact path='/bill/:tableId' element={<Bill />} />
              <Route
                exact
                path='/owner/history'
                element={<CompletedOrdersPage />}
              />
              <Route
                exact
                path='/owner/history/:orderId'
                element={<HistoryOrderView />}
              />
              <Route exact path='/owner/revenue' element={<Revenue />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  )
}

export default App
