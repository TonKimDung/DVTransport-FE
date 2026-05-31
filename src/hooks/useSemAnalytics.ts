import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { semService }
from "../services/semService";

interface Estimate {
  lval: string;
  rval: string;
  Estimate: number;
  op: string;

  "Std. Err"?: number;
  "z-value"?: number;
  "p-value"?: number;
}

interface SummaryInsight {
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

interface ChartNode {
  name: string;
}

interface ChartEdge {
  source: string;
  target: string;

  weight: number;

  p_value?: number;

  visual_width?: number;

  weight_normalized?: number;
}

interface SemResponse {
  rows: number;

  estimates: Estimate[];

  insights: SummaryInsight[];

  chart?: {
    nodes: ChartNode[];
    edges: ChartEdge[];
  };
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
    // Fleet
    new_vehicle_ratio:
      "Tỷ lệ xe mới",

    fuel_efficiency:
      "Hiệu suất nhiên liệu",

    maintenance_cost:
      "Chi phí bảo trì",

    // Operation
    ontime_rate:
      "Tỷ lệ đúng giờ",

    completed_trip_rate:
      "Tỷ lệ hoàn thành chuyến",

    empty_miles:
      "Quãng đường rỗng",

    incident_rate:
      "Tỷ lệ sự cố",

    // Driver
    driver_performance:
      "Hiệu suất tài xế",

    // Customer
    retention_rate:
      "Tỷ lệ giữ chân khách hàng",

    new_contracts:
      "Hợp đồng mới",

    // Finance
    avg_revenue:
      "Doanh thu trung bình",

    net_profit:
      "Lợi nhuận ròng",

    revenue_growth:
      "Tăng trưởng doanh thu",
  };

  const getLabel = (
    value: string
  ) =>
    labelMap[value] ||
    value;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =
    async () => {
      try {
        setLoading(
          true
        );

        const res =
          await semService.analyze();

        setData(res);
      } catch (err) {
        console.error(
          err
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const paths =
    useMemo(() => {
      if (
        !data?.estimates
      ) {
        return [];
      }

      return (
        data.estimates
          .filter(
            (e) =>
              e.op === "~"
          )
          .map(
            (e) => ({
              source:
                e.rval,

              target:
                e.lval,

              sourceLabel:
                getLabel(
                  e.rval
                ),

              targetLabel:
                getLabel(
                  e.lval
                ),

              effect:
                Number(
                  Number(
                    e.Estimate
                  ).toFixed(
                    3
                  )
                ),

              pValue:
                Number(
                  e[
                    "p-value"
                  ] ?? 1
                ),

              zValue:
                Number(
                  e[
                    "z-value"
                  ] ?? 0
                ),
            })
          )
      );
    }, [data]);

  const positiveCount =
    paths.filter(
      (p) =>
        p.effect > 0
    ).length;

  const negativeCount =
    paths.filter(
      (p) =>
        p.effect < 0
    ).length;

  const significantRelations =
    paths.filter(
      (p) =>
        p.pValue < 0.05
    ).length;

  const strongestDrivers =
    [...paths]
      .sort(
        (a, b) =>
          Math.abs(
            b.effect
          ) -
          Math.abs(
            a.effect
          )
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