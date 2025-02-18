
import React from "react";

interface RevenusMetricsProps {
  totalRevenue: number;
  revenueBreakdown: string;
  MRR: number;
  ARPU: number;
  ARPPU: number;
  LTV: number;
}

const RevenusMetrics = ({
  totalRevenue,
  revenueBreakdown,
  MRR,
  ARPU,
  ARPPU,
  LTV,
}: RevenusMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Revenus et Monétisation</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Chiffre d'affaires total:</p>
        <p className="font-bold">{totalRevenue}€</p>
      </div>
      <div>
        <p className="text-sm">Répartition des revenus:</p>
        <p className="font-bold">{revenueBreakdown}</p>
      </div>
      <div>
        <p className="text-sm">MRR (Revenu mensuel récurrent):</p>
        <p className="font-bold">{MRR}€</p>
      </div>
      <div>
        <p className="text-sm">ARPU (Revenu moyen par utilisateur):</p>
        <p className="font-bold">{ARPU}€</p>
      </div>
      <div>
        <p className="text-sm">ARPPU (Revenu moyen par utilisateur payant):</p>
        <p className="font-bold">{ARPPU}€</p>
      </div>
      <div>
        <p className="text-sm">LTV (Valeur vie client):</p>
        <p className="font-bold">{LTV}€</p>
      </div>
    </div>
  </div>
);

export default RevenusMetrics;
