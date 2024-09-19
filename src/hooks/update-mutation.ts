import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useUpdateMutation = ({
  resource,
  invalidateKeys,
}: {
  resource: string;
  invalidateKeys?: string[];
}) => {
  const { showToast } = useGlobal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, any>;
    }) => {
      try {
        const res = await sql(
          `UPDATE ${resource} SET ${Object.entries(data)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(", ")} WHERE id = '${id}'`
        );
        showToast("Record successfully updated!", "success");
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
