import {Model, ModelEffects, Action} from '@rematch/core';

export type ModelEffect<S> = (
    this: { [key: string]: (payload?: any, meta?: any) => Action<any, any> },
    payload: any,
    rootState: S,
) => void;

export interface IModelClass<T> {
    name: string;
    state?: any;
    prototype?: any;
    new(): T;
}

export interface IModelCreator {
    (ModelClass: IModelClass<any>): Model<typeof ModelClass['state']>;
    <T>(ModelClass: IModelClass<any>): Model<T>;
    <K, T extends IModelClass<K>>(ModelClass: T): Model<T['prototype']['state']>;
}

const WrapReducer = (fn: Function, self: any) => function(this: any, ...args: any[]) {
    if (!self.isCopyReducers) {
        Object.assign(self, this as any);
        self.isCopyReducers = true;
    }
    return fn.apply(self, args);
};

const WrapEffect = (fn: Function, self: any) => function(this: any, ...args: any[]): ModelEffect<any> {
    if (!self.isCopyOthers) {
        Object.assign(self, this);
        self.isCopyOthers = true;
    }
    return fn.apply(self, args);
};

export const model: IModelCreator = (ModelClass: IModelClass<any>): Model => {
    const instance = new ModelClass();
    const { state } = instance;

    const effects: ModelEffects<any> = {};

    const rematchModel: Model = {
        name: instance.name || ModelClass.name,
        state,
        reducers: {},
        effects,
    };

    for (const key of Object.getOwnPropertyNames(ModelClass.prototype)) {
        if (key !== 'constructor') {
            const fn = instance[key];
            const type = fn.rematch;
            switch (type) {
                case 'reducer':
                    rematchModel.reducers[key] = WrapReducer(fn, instance);
                    break;
                case 'effect':
                    effects[key] = WrapEffect(fn, instance);
                    break;
            }
        }
    }
    rematchModel.effects = effects;

    return rematchModel;
};

export const effect = (_target: any, _name: string, descriptor: any) => {
    const origin = descriptor.value;
    descriptor.value = function(payload: any, rootState: any) {
        this.state = rootState[this.name];
        return origin.call(this, payload, rootState);
    };
    descriptor.value.rematch = 'effect';
    return descriptor;
};

export const reducer = (_target: any, _name: string, descriptor: any) => {
    const origin = descriptor.value;
    descriptor.value = function(state: any, payload: any) {
        this.state = state;
        const newState = origin.call(this, payload, state);
        this.state = newState;
        return newState;
    };
    descriptor.value.rematch = 'reducer';
    return descriptor;
};
