import { useNavigate, Outlet } from 'react-router-dom'; // 👈 Outlet ইম্পোর্ট করুন
import { logoutAdmin } from '../services/adminApi';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* আপনার সাইডবার বা হেডার */}
      <nav className="p-4 bg-dark-2 flex justify-between items-center border-b border-dark-3">
        <span className="text-cream font-bold">Admin Panel</span>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-md text-sm hover:bg-red-500/20 transition-colors"
        >
          Logout
        </button>
      </nav>


      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;