/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { APIEndpoints } from "./endpoints";
import { IExploreContent } from "./response_interfaces/explore-data.interface";
import { IQuestion } from "./response_interfaces/question-interface";
export class API {
    static async fetchExploreContent(query: string, age: number, followup: string | null): Promise<IExploreContent> {
        const body: any = {
            query,
            age,
        };
        if (followup) {
            body.followup = followup;
        }
        const response = await axios.post(APIEndpoints.EXPLORE, body);
        return response.data as IExploreContent;
    }


    static async fetchQuestion(topic: string, age: number, level: number): Promise<IQuestion> {
        const response = await axios.post(APIEndpoints.QUESTION, {
            topic,
            age,
            level
        });
        if (response.status !== 201) {
            throw new Error(response.data.message);
        }
        return response.data as IQuestion;
    }
}