import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useSqlMutation = ({
  query,
  invalidateKeys,
}: {
  query?: string;
  invalidateKeys?: string[];
}) => {
  const { showToast } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dynamicQuery?: string) => {
      
      try {
        const queryToUse: any = dynamicQuery || query;
        const res = await sql(queryToUse);
        return res;
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, "error");
      }
    },

    onSettled: () => {
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
};
