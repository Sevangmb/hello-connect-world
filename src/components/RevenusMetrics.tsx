import React from "react";

const RevenusMetrics = ({
  totalRevenue,
  revenueBreakdown,
  MRR,
  ARPU,
  ARPPU,
  LTV,
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Revenus et Monétisation</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Chiffre d'affaires total:</p>
        <p className="font-bold">{totalRevenue}</p>
      </div>
      <div>
        <p className="text-sm">Répartition du chiffre d'affaires:</p>
        <p className="font-bold">{revenueBreakdown}</p>
      </div>
      <div>
        <p className="text-sm">MRR:</p>
        <p className="font-bold">{MRR}</p>
      </div>
      <div>
        <p className="text-sm">ARPU:</p>
        <p className="font-bold">{ARPU}</p>
      </div>
      <div>
        <p className="text-sm">ARPPU:</p>
        <p className="font-bold">{ARPPU}</p>
      </div>
      <div>
        <p className="text-sm">LTV:</p>
        <p className="font-bold">{LTV}</p>
      </div>
    </div>
  </div>
);

export default RevenusMetrics;
