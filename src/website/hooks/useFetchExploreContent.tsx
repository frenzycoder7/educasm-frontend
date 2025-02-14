import { useMutation } from "@tanstack/react-query";
import { API } from "../apis/API";

export const useFetchExploreContent = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ["explore-content"],
        mutationFn: (variables: { query: string, age: number }) =>
            API.fetchExploreContent(variables.query, variables.age),
    })

    return { mutate, isPending, error };
}