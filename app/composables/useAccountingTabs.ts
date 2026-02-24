export const useAccountingTabs = () => {
  return [
    {
      key: "revenue-expense",
      label: "Quản lý Thu - Chi",
      path: "/ke-toan/thu-chi",
    },
    {
      key: "invoice",
      label: "Hoá Đơn",
      path: "/ke-toan/hoa-don",
    },
    {
      key: "debt",
      label: "Công nợ",
      path: "/ke-toan/cong-no",
    },
    {
      key: "tax",
      label: "Thuế",
      path: "/ke-toan/thue",
    },
  ];
};
export const useFilteredAccountingTabs = (permissions?: {
  canViewRevenue?: boolean;
  canViewInvoice?: boolean;
  canViewDebt?: boolean;
  canViewTax?: boolean;
}) => {
  const allTabs = useAccountingTabs();

  if (!permissions) {
    return allTabs;
  }

  return allTabs.filter((tab) => {
    switch (tab.key) {
      case "revenue-expense":
        return permissions.canViewRevenue !== false;
      case "invoice":
        return permissions.canViewInvoice !== false;
      case "debt":
        return permissions.canViewDebt !== false;
      case "tax":
        return permissions.canViewTax !== false;
      default:
        return true;
    }
  });
};
