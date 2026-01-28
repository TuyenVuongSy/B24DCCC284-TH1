// File: src/models/todolist.ts

// Định nghĩa kiểu Reducer thủ công để tránh lỗi import từ 'umi'
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
    update: Reducer<TodoState>; // Thêm action update
    toggle: Reducer<TodoState>;
  };
}

// Khóa để lưu trong LocalStorage
const LOCAL_STORAGE_KEY = 'todo_app_data';

// Hàm helper lấy dữ liệu
const loadData = (): TodoItem[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const TodoModel: TodoModelType = {
  namespace: 'todoList',
  state: {
    list: loadData(), // 1. Load từ LocalStorage khi khởi chạy
  },
  reducers: {
    add(state = { list: [] }, { payload }) {
      const newItem: TodoItem = {
        id: Date.now(),
        content: payload,
        completed: false,
      };
      const newList = [newItem, ...state.list]; // Thêm vào đầu danh sách
      
      // 2. Lưu vào LocalStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      
      return { ...state, list: newList };
    },

    remove(state = { list: [] }, { payload: id }) {
      const newList = state.list.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return { ...state, list: newList };
    },

    // 3. Thêm logic Chỉnh sửa (Edit)
    update(state = { list: [] }, { payload }) {
      const { id, content } = payload;
      const newList = state.list.map(item => 
        item.id === id ? { ...item, content } : item
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return { ...state, list: newList };
    },

    toggle(state = { list: [] }, { payload: id }) {
      const newList = state.list.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return { ...state, list: newList };
    },
  },
};

export default TodoModel;