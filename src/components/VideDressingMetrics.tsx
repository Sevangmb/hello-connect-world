
import React from "react";

interface VideDressingMetricsProps {
  itemsForSale: number;
  soldItems: number;
  transactionVolume: number;
  averageSalePrice: number;
  saleConversionRate: number;
  openDisputes: number;
  resolvedDisputes: number;
}

const VideDressingMetrics = ({
  itemsForSale,
  soldItems,
  transactionVolume,
  averageSalePrice,
  saleConversionRate,
  openDisputes,
  resolvedDisputes,
}: VideDressingMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Vide-Dressing</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Articles en vente:</p>
        <p className="font-bold">{itemsForSale}</p>
      </div>
      <div>
        <p className="text-sm">Articles vendus:</p>
        <p className="font-bold">{soldItems}</p>
      </div>
      <div>
        <p className="text-sm">Volume de transactions:</p>
        <p className="font-bold">{transactionVolume}€</p>
      </div>
      <div>
        <p className="text-sm">Prix de vente moyen:</p>
        <p className="font-bold">{averageSalePrice}€</p>
      </div>
      <div>
        <p className="text-sm">Taux de conversion des ventes:</p>
        <p className="font-bold">{saleConversionRate}%</p>
      </div>
      <div>
        <p className="text-sm">Litiges ouverts:</p>
        <p className="font-bold">{openDisputes}</p>
      </div>
      <div>
        <p className="text-sm">Litiges résolus:</p>
        <p className="font-bold">{resolvedDisputes}</p>
      </div>
    </div>
  </div>
);

export default VideDressingMetrics;
