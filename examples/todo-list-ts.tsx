/* tslint:disable */
import * as React from 'react';
import { inject, Injected } from 'rematch-inject';
import { autobind } from 'core-decorators';

import { AddTodo } from '../add-todo';
import { TodoItem } from '../todo-item';
import { TodoStore } from './todo-store-ts';

export type TodoListProps = {} &
    Injected<TodoStore> &
    Injected<typeof TodoStore.withToggled>;

@inject('todo')
@inject(TodoStore.withToggled)
export default class TodoList extends React.Component<TodoListProps> {
    public render() {
        const { todo } = this.props;
        const itemsList = Object.keys(todo).map(k => todo[k]);

        return (
            <div>
                <AddTodo onAdd={ this.handleAddTodo } />
                { itemsList.map(item => (
                    <TodoItem
                        { ...item }
                        key={ item.id }
                        onToggle={ this.handleItemToggle }
                        onRemove={ this.handleItemRemove }
                    />
                )) }
            </div>
        );
    }

    @autobind
    public handleAddTodo(text: string) {
        this.props.addTodo({ text });
    }

    @autobind
    public handleItemToggle(id: string) {
        this.props.toggleTodo({ id });
    }

    @autobind
    public handleItemRemove(id: string) {
        this.props.removeTodo({ id });
    }
}
