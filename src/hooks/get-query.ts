import { useQuery } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useGetQuery = <T>({
  resource,
  appendToSql,
}: {
  resource: string;
  appendToSql?: string;
}) => {
  const { showToast } = useGlobal();

  return useQuery<T>({
    queryKey: [resource],
    queryFn: async () => {
      try {
        const res = await sql(`SELECT * FROM ${resource}` + (appendToSql ? ` ${appendToSql}` : ""));
        return res as T;
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, 'error');
        return [] as T;
      }
    },
  });
};

