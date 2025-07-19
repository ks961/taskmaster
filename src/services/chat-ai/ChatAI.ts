import { IChatAI } from "./interface";


export class ChatAI<R> {

    constructor(
        private readonly chatAI: IChatAI
    ){};

    async ask(prompt: string): Promise<R> {
        return await this.chatAI.ask(prompt);
    }
}