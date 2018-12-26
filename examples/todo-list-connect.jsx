import React from 'react';
import { inject } from 'rematch-inject';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { AddTodo } from '../add-todo';
import { TodoItem } from '../todo-item';
import { TodoStore } from './todo-store';

@connect(({ todo }) => ({ todo }), ({ todo }) => ({ ...todo }))
@connect(TodoStore.withToggled)
export default class TodoList extends React.Component {
	render() {
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
	handleAddTodo(text) {
		this.props.addTodo({ text });
	}

	@autobind
	handleItemToggle(id) {
		this.props.toggleTodo({ id });
	}

	@autobind
	handleItemRemove(id) {
		this.props.removeTodo({ id });
	}
}
