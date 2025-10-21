// File: src/layouts/DashboardLayout.jsx
import { Outlet, NavLink, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <header className="navbar navbar-dark bg-dark sticky-top shadow">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-heart-pulse me-2"></i>
            <span>HealthLens AI</span>
          </Link>

          {/* Mobile: toggle sidebar */}
          <button
            className="navbar-toggler d-md-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop: quick search (placeholder for now) */}
          <form className="d-none d-md-flex ms-auto" role="search">
            <input
              className="form-control form-control-sm"
              type="search"
              placeholder="Search…"
              aria-label="Search"
            />
          </form>
        </div>
      </header>

      {/* Body */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar (offcanvas on mobile, static on md+) */}
          <aside
            id="sidebarMenu"
            className="offcanvas-md offcanvas-start col-md-3 col-lg-2 p-0 bg-body-tertiary border-end"
            tabIndex="-1"
            aria-labelledby="sidebarMenuLabel"
          >
            {/* Mobile-only offcanvas header */}
            <div className="offcanvas-header d-md-none">
              <h5 className="offcanvas-title" id="sidebarMenuLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                data-bs-target="#sidebarMenu"
                aria-label="Close"
              ></button>
            </div>

            <div className="offcanvas-body d-md-flex flex-column p-0 pt-md-3 overflow-y-auto">
              <nav className="px-3">
                <ul className="nav nav-pills flex-column gap-1">
                  <li className="nav-item">
                    <NavLink
                      end
                      to="/app/dashboard"
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-2 ${
                          isActive ? "active" : "link-body-emphasis"
                        }`
                      }
                    >
                      <i className="bi bi-speedometer2"></i>
                      Overview
                    </NavLink>
                  </li>

                  <li className="mt-3 mb-1 small text-uppercase text-muted">
                    Diseases
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/app/diseases/skin_cancer/detect"
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-2 ${
                          isActive ? "active" : "link-body-emphasis"
                        }`
                      }
                    >
                      <i className="bi bi-droplet-half"></i>
                      Skin Cancer
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/app/diseases/brain_tumor/detect"
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-2 ${
                          isActive ? "active" : "link-body-emphasis"
                        }`
                      }
                    >
                      <i className="bi bi-cpu"></i>
                      Brain Tumor
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/app/diseases/malnutrition/detect"
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-2 ${
                          isActive ? "active" : "link-body-emphasis"
                        }`
                      }
                    >
                      <i className="bi bi-egg-fried"></i>
                      Malnutrition
                    </NavLink>
                  </li>
                </ul>
              </nav>

              <div className="mt-auto p-3 small text-muted border-top d-none d-md-block">
                <span className="me-2">
                  <i className="bi bi-circle-fill text-success me-1"></i>
                  Healthy
                </span>
                <span>• v1.0</span>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="col-md-9 ms-md-auto col-lg-10 px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="h4 mb-0">Dashboard</h1>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
