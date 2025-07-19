
type Ctor<T> = new (...any: any[]) => T;

export type ScopedContainer = {
    resolve: <T>(ctor: Ctor<T>) => T;
}

declare global {
  namespace Express {
    interface Request { scope: ScopedContainer; }
  }
}

type Constructor = new (...any: any[]) => {};


export interface IContainer {
    resolve<T>(ctor: Ctor<T>): T
}


export class DIEngine implements IContainer {
    private singletonMap = new Map<Function, unknown>();
    private transientMap = new Map<Function, Ctor<any>>();
    private scopedContainerMap = new Map<Function, Function>();

    registerScoped<T>(
        ctor: Ctor<T>,
        factory: () => T
    ) {
        this.scopedContainerMap.set(ctor, factory);
    }

    registerTransient<T>(
        ctor: Ctor<T>,
        serviceClass: Constructor
    ) {
        this.transientMap.set(ctor, serviceClass);
    }

    registerSingleton<T>(
        ctor: Ctor<T>,
        serviceClass: () => T
    ) {
        if(this.singletonMap.get(ctor)) {
            return console.warn(`'${ctor.name}' already registered.`);
        }
        this.singletonMap.set(ctor, serviceClass());
    }

    resolve<T>(
        ctor: Ctor<T>
    ) {
        let value = this.singletonMap.get(ctor);
        if(value) {
            return value as T;
        }

        value = this.transientMap.get(ctor);
        if(value) {
            return new (value as Ctor<T>)();
        }

        throw new Error('Unknown service lifetime.');
    }

    createScope() {
        const scopeInstanceMap: Map<Function, Object> = new Map<Function, Object>();
        for(const [ctor, serviceClass] of this.scopedContainerMap) {
            scopeInstanceMap.set(ctor, serviceClass());
        }
        const scopeContainer = {
            resolve: <T>(ctor: Ctor<T>) => {
                return scopeInstanceMap.get(ctor) as T;
            }
        }

        return scopeContainer;
    }

    static scopeMiddleware(di: DIEngine) {
        return (req: any, _res: any, next: any) => {
            req.scope = di.createScope();
            next();
        }
    }
};