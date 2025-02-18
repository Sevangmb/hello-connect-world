
import React from "react";

interface MarketingMetricsProps {
  CAC: number;
  marketingROI: number;
  websiteTraffic: number;
  campaignConversionRate: number;
}

const MarketingMetrics = ({
  CAC,
  marketingROI,
  websiteTraffic,
  campaignConversionRate,
}: MarketingMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Marketing</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Coût d'acquisition client (CAC):</p>
        <p className="font-bold">{CAC}€</p>
      </div>
      <div>
        <p className="text-sm">ROI des campagnes marketing:</p>
        <p className="font-bold">{marketingROI}%</p>
      </div>
      <div>
        <p className="text-sm">Trafic sur le site web:</p>
        <p className="font-bold">{websiteTraffic}</p>
      </div>
      <div>
        <p className="text-sm">Taux de conversion des campagnes:</p>
        <p className="font-bold">{campaignConversionRate}%</p>
      </div>
    </div>
  </div>
);

export default MarketingMetrics;
