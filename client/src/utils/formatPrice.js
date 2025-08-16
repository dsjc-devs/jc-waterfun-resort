const formatPeso = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "₱0.00";
  return `₱${Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default formatPeso;
