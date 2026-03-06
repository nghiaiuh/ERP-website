/**
 * Composable for database operations in ERP system
 * Provides easy access to all API endpoints from Vue pages
 */

export const useERP = () => {
  // ============================
  // INVOICES - Using stub endpoints (returns empty data)
  // ============================
  const getInvoices = async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/invoices', { query: params });
  };

  const getInvoiceById = async (id: number) => {
    return await useFetch(`/api/invoices/${id}`);
  };

  const createInvoice = async (invoiceData: any) => {
    return await $fetch('/api/invoices', {
      method: 'POST',
      body: invoiceData
    } as any);
  };

  // ============================
  // SUPPLIERS - Temporarily disabled
  // ============================
  /*
  const getSuppliers = async (params?: {
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/suppliers', { query: params });
  };

  const createSupplier = async (supplierData: any) => {
    return await $fetch('/api/suppliers', {
      method: 'POST',
      body: supplierData
    });
  };
  */

  // ============================
  // DEBTS - Using stub endpoints (returns empty data)
  // ============================
  const getDebts = async (params?: {
    type?: 'receivables' | 'payables' | 'all';
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/debts', { query: params });
  };

  const getReceivables = async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/debts', { 
      query: { ...params, type: 'receivables' } 
    });
  };

  const getPayables = async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/debts', { 
      query: { ...params, type: 'payables' } 
    });
  };

  // ============================
  // REPORTS - Using stub endpoints (returns empty data)
  // ============================
  const getRevenueReports = async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/reports/revenue', { query: params });
  };

  const createRevenueReport = async (reportData: any) => {
    return await $fetch('/api/reports/revenue', {
      method: 'POST',
      body: reportData
    } as any);
  };

  const updateRevenueReport = async (id: number, reportData: any) => {
    return await $fetch(`/api/reports/revenue/${id}`, {
      method: 'PUT',
      body: reportData
    } as any);
  };

  const getExpenseReports = async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/reports/expense', { query: params });
  };

  const createExpenseReport = async (reportData: any) => {
    return await $fetch('/api/reports/expense', {
      method: 'POST',
      body: reportData
    } as any);
  };

  const updateExpenseReport = async (id: number, reportData: any) => {
    return await $fetch(`/api/reports/expense/${id}`, {
      method: 'PUT',
      body: reportData
    } as any);
  };

  const getCombinedReports = async (params?: {
    limit?: number;
    offset?: number;
  }) => {
    return await useFetch('/api/reports', { query: params });
  };

  const getRevenueReportById = async (id: number) => {
    return await useFetch(`/api/reports/revenue/${id}`);
  };

  const getExpenseReportById = async (id: number) => {
    return await useFetch(`/api/reports/expense/${id}`);
  };

  const deleteRevenueReport = async (id: number) => {
    return await $fetch(`/api/reports/revenue/${id}`, {
      method: 'DELETE'
    } as any);
  };

  const deleteExpenseReport = async (id: number) => {
    return await $fetch(`/api/reports/expense/${id}`, {
      method: 'DELETE'
    } as any);
  };

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
    const d = new Date(date);
    if (format === 'short') {
      return d.toLocaleDateString('vi-VN');
    }
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'processed': 'Đã xử lý',
      'rejected': 'Từ chối',
      'paid': 'Đã thanh toán',
      'partial': 'Thanh toán một phần',
      'overdue': 'Quá hạn',
      'draft': 'Nháp',
      'submitted': 'Đã nộp',
      'approved': 'Đã duyệt'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'pending': 'bg-[#fef9c2] text-[#a65f00]',
      'processing': 'bg-[#fef9c2] text-[#a65f00]',
      'processed': 'bg-[#dcfce7] text-[#008236]',
      'rejected': 'bg-[#fee2e2] text-[#991b1b]',
      'paid': 'bg-[#dcfce7] text-[#008236]',
      'partial': 'bg-[#dbeafe] text-[#1e40af]',
      'overdue': 'bg-[#fee2e2] text-[#991b1b]',
      'draft': 'bg-[#f3f4f6] text-[#364153]',
      'submitted': 'bg-[#dbeafe] text-[#1e40af]',
      'approved': 'bg-[#dcfce7] text-[#008236]'
    };
    return colorMap[status] || 'bg-[#f3f4f6] text-[#364153]';
  };

  return {
    // API methods - Using stub endpoints (temporarily return empty data)
    getInvoices,
    getInvoiceById,
    createInvoice,
    // getSuppliers,
    // createSupplier,
    getDebts,
    getReceivables,
    getPayables,
    getRevenueReports,
    getRevenueReportById,
    createRevenueReport,
    updateRevenueReport,
    deleteRevenueReport,
    getExpenseReports,
    getExpenseReportById,
    createExpenseReport,
    updateExpenseReport,
    deleteExpenseReport,
    getCombinedReports,
    
    // Utility methods
    formatCurrency,
    formatNumber,
    formatDate,
    getStatusText,
    getStatusColor
  };
};
