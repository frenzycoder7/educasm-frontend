import { useMutation } from "@tanstack/react-query";
import { API } from "../apis/API";

export const useGenerateQuestion = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ["generate-question"],
        mutationFn: (variables: { topic: string, age: number, level: number }) =>
            API.fetchQuestion(variables.topic, variables.age, variables.level),
    })

    return { mutate, isPending, error };
}