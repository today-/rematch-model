import { effect, model, reducer } from '../src';

export interface ITodoItemRecord {
    id: string;
    text: string;
    completed: boolean;
}

export interface ITodoState {
    [id: string]: ITodoItemRecord;
}

export type TodoArgument = Partial<ITodoItemRecord>;

export class TodoStore {
    public name: 'todo' = 'todo';

    public state: ITodoState = {};

    @effect
    public addTodo({ text }: TodoArgument) {
        this.ADD_TODO({
            id: Math.random().toString().substring(2),
            text,
        });
    }

    @effect
    public toggleTodo({ id }: TodoArgument) {
        this.TOGGLE_TODO({ id });
    }

    @effect
    public removeTodo({ id }: TodoArgument) {
        this.REMOVE_TODO({ id });
    }

    @reducer
    private ADD_TODO({ id, text }: TodoArgument) {
        this.state[id] = { id, text, completed: false };
    }

    @reducer
    private TOGGLE_TODO({ id }: TodoArgument) {
        this.state[id].completed = !this.state[id].completed;
    }

    @reducer
    private REMOVE_TODO({ id }: TodoArgument) {
        delete this.state[id];
    }

    public static withToggled({ todo }: { todo: ITodoState }) {
        return {
            toggled: Object.keys(todo).filter(f => todo[f].completed),
        };
    }
}

export default model(TodoStore);
