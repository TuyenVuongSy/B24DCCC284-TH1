import React, { useState } from 'react';
import { connect } from 'dva'; 
import { Card, Input, List, Button, Checkbox, Typography, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// --- 1. Tự định nghĩa các Interface cần thiết ---
interface TodoItem {
  id: number;
  content: string;
  completed: boolean;
}

interface TodoState {
  list: TodoItem[];
}

// Định nghĩa Dispatch thủ công để tránh lỗi import từ 'umi'
type Dispatch = <T = any>(action: T) => T;

interface TodoListProps {
  dispatch: Dispatch;
  todoList: TodoState;
}
// ------------------------------------------------

const TodoList: React.FC<TodoListProps> = ({ dispatch, todoList }) => {
  // Fallback để tránh lỗi undefined khi state chưa kịp load
  const { list } = todoList || { list: [] };
  
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      dispatch({
        type: 'todoList/add', // Namespace 'todoList' phải khớp với file model
        payload: inputValue,
      });
      setInputValue('');
    }
  };

  const handleDelete = (id: number) => {
    dispatch({
      type: 'todoList/remove',
      payload: id,
    });
  };

  const handleToggle = (id: number) => {
    dispatch({
      type: 'todoList/toggle',
      payload: id,
    });
  };

  return (
    <Card title="Danh sách công việc (Todo List)" style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập công việc cần làm..."
          onPressEnter={handleAdd}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginLeft: 10 }}>
          Thêm
        </Button>
      </div>

      <List
        bordered
        dataSource={list}
        locale={{ emptyText: <Empty description="Chưa có công việc nào" /> }}
        renderItem={(item: TodoItem) => (
          <List.Item
            actions={[
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(item.id)}
              />
            ]}
          >
            <Checkbox 
              checked={item.completed} 
              onChange={() => handleToggle(item.id)}
            >
              <Typography.Text delete={item.completed} style={{ color: item.completed ? '#999' : 'inherit' }}>
                {item.content}
              </Typography.Text>
            </Checkbox>
          </List.Item>
        )}
      />
    </Card>
  );
};

// Kết nối với model
export default connect(({ todoList }: { todoList: TodoState }) => ({
  todoList,
}))(TodoList);