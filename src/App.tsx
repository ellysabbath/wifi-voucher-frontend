import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GenerateVouchers from './pages/GenerateVouchers';
import VoucherList from './pages/VoucherList';
import PrintVouchers from './pages/PrintVouchers';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portal" element={<CustomerPortal />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateVouchers />} />
          <Route path="/vouchers" element={<VoucherList />} />
          <Route path="/print" element={<PrintVouchers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;