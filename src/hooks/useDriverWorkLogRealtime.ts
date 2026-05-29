import { useEffect } from "react";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import type { DriverWorkLog }
from "../types/driverWorkLog";

interface Props {

  setWorkLogs: React.Dispatch<
    React.SetStateAction<DriverWorkLog[]>
  >;
}

export default function useDriverWorkLogRealtime({
  setWorkLogs,
}: Props) {

  useEffect(() => {

    const socket =
      new SockJS(
        "http://localhost:8080/ws"
      );

    const client = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {

        console.log(
          "WORKLOG WS CONNECTED"
        );

        client.subscribe(
          "/topic/work-log",
          (message) => {

            const log: DriverWorkLog =
              JSON.parse(message.body);

            console.log(
              "REALTIME WORK LOG",
              log
            );

            setWorkLogs((prev) => {

              const existed =
                prev.find(
                  (x) =>
                    x.tripId === log.tripId
                );

              // =====================
              // UPDATE
              // =====================

              if (existed) {

                return prev.map((x) =>

                  x.tripId === log.tripId
                    ? {
                        ...log,
                        realtime: true,
                      }
                    : x
                );
              }

              // =====================
              // INSERT
              // =====================

              return [
                {
                  ...log,
                  realtime: true,
                },
                ...prev,
              ];
            });

            // =====================
            // ALERT
            // =====================

            if (
              log.warningLevel ===
                "WARNING" ||
              log.warningLevel ===
                "DANGEROUS"
            ) {

              alert(
                log.warningMessage
              );
            }
          }
        );
      },
    });

    client.activate();

    return () => {

      client.deactivate();
    };

  }, []);
}