"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', path: '/admin', icon: 'fas fa-home' },
    { name: 'Users', path: '/admin/users', icon: 'fas fa-users' },
    { name: 'Registrations', path: '/admin/registrations', icon: 'fas fa-clipboard-list' },
    { name: 'Students', path: '/admin/students', icon: 'fas fa-user-graduate'}
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          
<h3>
  {sidebarCollapsed ? (
        <span style={{ color: "white" }}>S</span>
  ) : (
    <a href="https://sypheracademy.com" target="_blank" rel="noopener noreferrer">
      <img 
        src="https://sypheracademy.com/images/footer_logo.svg" 
        alt="Sypher Logo" 
        className="h-8 w-auto" 
      />
    </a>
  )}
</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={pathname === item.path ? 'active' : ''}
                >
                  <i className={item.icon}></i>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="dropdown">
                <button className="profile-btn dropdown-toggle">
                  <i className="fas fa-user-circle"></i>
                  <span>{user?.name}</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="dropdown-menu">
                  <button 
                    onClick={logout}
                    className="dropdown-item logout-btn"
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
