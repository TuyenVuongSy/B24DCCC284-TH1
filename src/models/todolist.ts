// 1. KHÔNG import Reducer từ 'umi' nữa để tránh lỗi
// import { Reducer } from 'umi'; 

// 2. Tự định nghĩa kiểu Reducer thủ công (đơn giản và hiệu quả)
type Reducer<S> = (state: S | undefined, action: { type: string; payload?: any }) => S;

export interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

export interface TodoState {
  list: TodoItem[];
}

export interface TodoModelType {
  namespace: 'todoList';
  state: TodoState;
  reducers: {
    add: Reducer<TodoState>;
    remove: Reducer<TodoState>;
    toggle: Reducer<TodoState>;
  };
}

const TodoModel: TodoModelType = {
  namespace: 'todoList',
  state: {
    list: [],
  },
  reducers: {
    // Gán giá trị mặc định cho state để an toàn
    add(state = { list: [] }, { payload }) {
      const newItem: TodoItem = {
        id: Date.now(),
        content: payload,
        completed: false,
      };
      return { ...state, list: [...state.list, newItem] };
    },
    remove(state = { list: [] }, { payload: id }) {
      return { ...state, list: state.list.filter(item => item.id !== id) };
    },
    toggle(state = { list: [] }, { payload: id }) {
      const newList = state.list.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      return { ...state, list: newList };
    },
  },
};

export default TodoModel;