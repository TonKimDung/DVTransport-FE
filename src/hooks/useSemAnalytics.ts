// src/components/sem/useSemAnalytics.ts

import { useEffect, useMemo, useState } from "react";
import { semService } from "../services/semService";

interface Estimate {
  lval: string;
  rval: string;
  Estimate: number;
  op: string;
  "Std. Err"?: number;
  "z-value"?: number;
  "p-value"?: number;
}

interface Insight {
  from: string;
  to: string;
  effect: number;
  direction: string;
}

interface ChartNode {
  id: string;
}

interface ChartEdge {
  source: string;
  target: string;
  weight: number;
}

interface SemResponse {
  rows: number;
  estimates: Estimate[];
  insights: Insight[];
  businessInsights: BusinessInsight[];
  chart?: {
    nodes: ChartNode[];
    edges: ChartEdge[];
  };
}

interface BusinessInsight {
  title: string;
  description: string;
  type:
    | "cost"
    | "revenue"
    | "risk"
    | "customer"
    | "general";

  impact: number;
}


export function useSemAnalytics() {
  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<SemResponse | null>(
      null
    );

  const labelMap: Record<
    string,
    string
  > = {
    total_capacity:
      "Tổng công suất vận chuyển",

    empty_miles:
      "Quãng đường chạy rỗng",

    new_vehicle_ratio:
      "Tỷ lệ xe mới",

    incident_rate:
      "Tỷ lệ sự cố",

    retention_rate:
      "Tỷ lệ giữ chân khách hàng",

    avg_revenue:
      "Doanh thu trung bình",

    new_contracts:
      "Số hợp đồng mới",
  };

  const getLabel = (
    value: string
  ) =>
    labelMap[value] || value;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res =
        await semService.analyze();

      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paths = useMemo(() => {
    if (!data?.estimates)
      return [];

    return data.estimates
      .filter((e) => e.op === "~")
      .map((e) => ({
        source: e.rval,
        target: e.lval,

        sourceLabel:
          getLabel(e.rval),

        targetLabel:
          getLabel(e.lval),

        effect: Number(
          Number(
            e.Estimate
          ).toFixed(3)
        ),

        pValue:
          e["p-value"] || 0,

        zValue:
          e["z-value"] || 0,
      }));
  }, [data]);

  const positiveCount =
    paths.filter(
      (p) => p.effect > 0
    ).length;

  const negativeCount =
    paths.filter(
      (p) => p.effect < 0
    ).length;

  const significantRelations =
    paths.filter(
      (p) => p.pValue < 0.05
    ).length;

  const strongestDrivers = [
    ...paths,
  ]
    .sort(
      (a, b) =>
        Math.abs(b.effect) -
        Math.abs(a.effect)
    )
    .slice(0, 6);

  return {
    loading,
    data,
    paths,
    getLabel,
    positiveCount,
    negativeCount,
    significantRelations,
    strongestDrivers,
  };
}