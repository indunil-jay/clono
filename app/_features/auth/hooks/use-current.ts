"use client";
import { client } from "@/app/_lib/honojs/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

// type ResponseType = InferResponseType<
//   (typeof client.api.auth)["current"]["$get"],
//   200
// >;
// type RequestType = InferRequestType<
//   (typeof client.api.auth)["current"]["$get"]
// >;

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current-session"],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch current session");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
