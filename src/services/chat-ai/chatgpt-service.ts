import OpenAI from "openai";
import { IChatAI } from "./interface";

export type GPTResponse = { description: string };

export class ChatGPTService implements IChatAI {
    private openai: OpenAI;
    constructor(
        apiKey: string
    ) {
        this.openai = new OpenAI({apiKey});
    }
    
    async ask<R>(prompt: string): Promise<R> {

        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Generate a description as valid JSON with key: description."
                },
                {
                    role: "user",
                    content: `Prompt: ${prompt}`
                }
            ]
        });

        const answer = response.choices[0].message.content;
        if(!answer) {
            throw new Error("Failed to generate response");
        }

        return JSON.parse(answer);
    }

}