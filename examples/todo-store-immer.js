import { effect, model, reducer } from '../src';

@model
export default class TodoStore {
	name = 'todo';

	state = {};

	@effect
	addTodo({ text }) {
		this.ADD_TODO({
			id: Math.random().toString().substring(2),
			text,
		});
	}

	@effect
	toggleTodo({ id }) {
		this.TOGGLE_TODO({ id });
	}

	@effect
	removeTodo({ id }) {
		this.REMOVE_TODO({ id });
	}

	@reducer
	ADD_TODO({ id, text }) {
		this.state[id] = { id, text, completed: false };
	}

	@reducer
	TOGGLE_TODO({ id }) {
		this.state[id].completed = !this.state[id].completed;
	}

	@reducer
	REMOVE_TODO({ id }) {
		delete this.state[id];
	}

	static withToggled({ todo }) {
		return {
			toggled: Object.keys(todo).filter(f => todo[f].completed),
		};
	}
}
