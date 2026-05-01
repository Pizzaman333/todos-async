import { createSelector } from 'reselect';

export const selectTodosState = (state) => state.todos;

export const selectTodoItems = (state) => selectTodosState(state).items;
export const selectTodoStatus = (state) => selectTodosState(state).status;
export const selectTodoFilter = (state) => selectTodosState(state).filter;
export const selectTodoError = (state) => selectTodosState(state).error;

export const selectFilteredTodos = createSelector(
  [selectTodoItems, selectTodoFilter],
  (items, filter) => {
    if (filter === 'active') {
      return items.filter((todo) => !todo.completed);
    }

    if (filter === 'completed') {
      return items.filter((todo) => todo.completed);
    }

    return items;
  }
);

export const selectTodoCounts = createSelector([selectTodoItems], (items) => ({
  total: items.length,
  active: items.filter((todo) => !todo.completed).length,
  completed: items.filter((todo) => todo.completed).length,
}));
