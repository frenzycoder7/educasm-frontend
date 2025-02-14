import { useMutation } from "@tanstack/react-query";
import { API } from "../apis/API";
import toast from "react-hot-toast";

export const useGenerateQuestion = () => {
    const { mutate, isPending, error } = useMutation({
        mutationKey: ["generate-question"],
        mutationFn: (variables: { topic: string, age: number, level: number }) =>
            API.fetchQuestion(variables.topic, variables.age, variables.level),
        retry: 3,
        retryDelay: 1000,
        onError: (error) => {
            toast.error(error.message);
        }
    })

    return { mutate, isPending, error };
}