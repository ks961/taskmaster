
export interface IReadRepo<T> {
  findAll(): Promise<T[]>;
  findMany(data: Partial<T>): Promise<T[]>,
  findBy(data: Partial<T>): Promise<T | null>;
  findById(id: string, idField: string): Promise<T | null>;
}

export interface IWriteRepo<T> {
  create(d: Partial<T>): Promise<T | never>;
  update(id: string, data: Partial<T>, idField: string): Promise<T | never>;
  delete(id: string, idField: string): Promise<T | never>;
}

export interface ICrudRepo<T> extends IReadRepo<T>, IWriteRepo<T> {};