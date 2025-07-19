

export interface IChatAI {
    ask<R>(prompt: string): Promise<R>;
}