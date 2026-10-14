import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import StockTable from '../components/stock/StockTable';
import LotesModal from '../components/stock/LotesModal';
import { stockService } from '../services/stockService';
import { 
  Package, 
  Boxes, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';
import Button from '../components/common/Button';
import '../assets/styles/dashboard.css';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [semaforoFilter, setSemaforoFilter] = useState('all');

  // Modal State
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [isLotesModalOpen, setIsLotesModalOpen] = useState(false);

  // Load products & compute expiration semáforos
  const loadStockData = async () => {
    setLoading(true);
    try {
      const data = await stockService.getProductos();
      setProductos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando inventario:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, []);

  // Filter products by search term & semáforo status
  const filteredProductos = useMemo(() => {
    return productos.filter((prod) => {
      const matchSearch =
        prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.categoria && prod.categoria.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSemaforo =
        semaforoFilter === 'all' || prod.semaforoEstado === semaforoFilter;

      return matchSearch && matchSemaforo;
    });
  }, [productos, searchQuery, semaforoFilter]);

  // Compute summary stats
  const stats = useMemo(() => {
    let totalStock = 0;
    let rojos = 0;
    let amarillos = 0;
    let verdes = 0;

    productos.forEach((p) => {
      totalStock += p.stockTotal || 0;
      if (p.semaforoEstado === 'rojo') rojos++;
      else if (p.semaforoEstado === 'amarillo') amarillos++;
      else verdes++;
    });

    return {
      totalProductos: productos.length,
      totalStock,
      rojos,
      amarillos,
      verdes
    };
  }, [productos]);

  const handleOpenLotes = (producto) => {
    setSelectedProducto(producto);
    setIsLotesModalOpen(true);
  };

  const handleCloseLotes = () => {
    setIsLotesModalOpen(false);
    setSelectedProducto(null);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          search={searchQuery}
          onSearchChange={setSearchQuery}
          alertCount={stats.rojos + stats.amarillos}
        />

        <main className="dashboard-content fade-in">
          {/* Page Top Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Control de Inventario & Caducidades</h1>
              <p className="page-subtitle">
                Monitoreo en tiempo real con Semáforo de Vencimiento de Lotes
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={loadStockData}
                isLoading={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Stat Metric Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Package size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.totalProductos}</span>
                <span className="stat-label">Total Productos</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon total" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                <Boxes size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.totalStock.toLocaleString()}</span>
                <span className="stat-label">Unidades en Stock</span>
              </div>
            </div>

            <div className="stat-card" style={{ borderColor: stats.rojos > 0 ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
              <div className="stat-icon rojo">
                <AlertCircle size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value" style={{ color: '#ef4444' }}>{stats.rojos}</span>
                <span className="stat-label">Caducados / &le;15 Días</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon amarillo">
                <AlertTriangle size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.amarillos}</span>
                <span className="stat-label">Por Caducar (16-60 Días)</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon verde">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value" style={{ color: '#10b981' }}>{stats.verdes}</span>
                <span className="stat-label">Vigentes / Óptimos</span>
              </div>
            </div>
          </div>

          {/* Stock & Expiration Table */}
          <StockTable
            productos={filteredProductos}
            onManageLotes={handleOpenLotes}
            selectedFilter={semaforoFilter}
            onFilterChange={setSemaforoFilter}
          />
        </main>
      </div>

      {/* Lotes & Expiration Management Modal */}
      {selectedProducto && (
        <LotesModal
          isOpen={isLotesModalOpen}
          onClose={handleCloseLotes}
          producto={selectedProducto}
          onRefreshStock={loadStockData}
        />
      )}
    </div>
  );
};

export default DashboardPage;
