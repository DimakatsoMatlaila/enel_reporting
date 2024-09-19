import { useQuery } from "@tanstack/react-query";
import { sql } from ".";
import { useGlobal } from "./global-provider";

export const useSqlQuery = <T>({
    query,
    queryKey
}: {
    query: string;
    queryKey: string;
}) => {
    const { showToast } = useGlobal();

    return useQuery<T>({
        queryKey: [queryKey],
        queryFn: async () => {
            try {
                const res = await sql(query);
                return res as T;
            } catch (err) {
                showToast(`Error: ${(err as Error).message}`, 'error');
                return [] as T;
            }
        },
    });
}