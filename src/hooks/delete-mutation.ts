import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useDeleteMutation = ({
  resource,
  invalidateKeys,
}: {
  resource: string;
  invalidateKeys?: string[];
}) => {
  const { showToast } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const res = await sql(`DELETE FROM ${resource} WHERE id = '${id}'`);
        showToast("Record successfully deleted!", "success");
        return res;
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, "error");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
  });
};
