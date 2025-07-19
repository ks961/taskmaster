import { Model } from "mongoose";
import { ICrudRepo, IWriteRepo } from "../interfaces/ICommonRepo";
import { HttpClientError } from "../../libs/http-response-codes";
import { ClientError } from "../../errors/error-classes/client-error";

type ArrayOperators = "$push" | "$addToSet" | "$pull" | "$pullAll" | "$pop";

export class MongoRepository<T> implements ICrudRepo<T> {

    constructor(
        private readonly model: Model<T>
    ){};

    async findAll(): Promise<T[]> {
        return await this.model.find({}).lean() as T[];
    }
    
    async findMany(data: Partial<T>): Promise<T[]> {
        return await this.model.find(data).lean() as T[];
    }

    async findBy(data: Partial<T>): Promise<T | null> {
        return await this.model.findOne(data).lean() as (T | null);
    }

    async findById(id: string, idField: string): Promise<T | null> {
        return await this.model.findOne({ [idField]: id } as Record<string, any>).lean() as (T | null);
    }

    async create(data: T) {
        return await this.model.create(data) as (T | never);
    }

    async update(id: string, data: Partial<T>, idField: string): Promise<T | never> {
        const updated = await this.model
            .findOneAndUpdate<T>(
                { [idField]: id } as Record<string, any>, 
                data, { new: true }
            ).lean();

        if (!updated) {
            throw new ClientError(
                `User with Id '${id}' not found.`, 
                HttpClientError.NotFound
            );
        }

        return updated as (T | never);
    }

    async delete(id: string, idField: string): Promise<T | never> {
        const deleted = await this.model
            .findOneAndDelete(
                { [idField]: id } as Record<string, any>
            ).lean();

        if (!deleted) {
            throw new ClientError(
                `User with Id '${id}' not found.`, 
                HttpClientError.NotFound
            );
        }

        return deleted as (T | never);
    }

    getModel(): Readonly<Model<T>> {
        return this.model;
    }

    async updateArray<F>(
        filter: Partial<T>,
        field: string,
        data: F | F[] | number,
        cmd: ArrayOperators
    ) {
        let update: any;

        switch (cmd) {
            case "$push":
            case "$addToSet":
            update = {
                [cmd]: {
                [field]: Array.isArray(data)
                    ? { $each: data }
                    : data // single value
                }
            };
            break;

            case "$pull":
            case "$pullAll":
            update = {
                [cmd]: {
                [field]: data
                }
            };
            break;

            case "$pop":
            update = {
                [cmd]: {
                [field]: data
                }
            };
            break;

            default:
            throw new Error(`Unsupported array operator: ${cmd}`);
        }

        return await this.model.updateOne(filter, update);
    }

    async textSearch(
        searchText: string,
        extraFilter: Partial<T> = {}
    ) {
        const filter = {
            $text: { $search: searchText },
            ...extraFilter
        };

        const sort = {
            score: { $meta: "textScore" }
        };

        return await this.model.find(filter).sort(sort);
    }

}