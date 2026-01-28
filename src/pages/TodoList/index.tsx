// File: src/pages/TodoList/index.tsx

import React, { useState } from 'react';
import { connect } from 'umi'; 
import { Card, Input, List, Button, Checkbox, Typography, Empty, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// Import Interface từ Model
import { TodoState } from '@/models/todolist';

// Định nghĩa lại Dispatch type thủ công
type Dispatch = <T = any>(action: T) => T;

interface TodoListProps {
  dispatch: Dispatch;
  todoList: TodoState;
}

const TodoList: React.FC<TodoListProps> = ({ dispatch, todoList }) => {
  // Fallback an toàn
  const { list } = todoList || { list: [] };
  const [inputValue, setInputValue] = useState('');

  // THÊM MỚI
  const handleAdd = () => {
    if (!inputValue.trim()) {
      message.warning('Vui lòng nhập nội dung công việc!');
      return;
    }
    dispatch({
      type: 'todoList/add',
      payload: inputValue,
    });
    setInputValue('');
    message.success('Đã thêm công việc mới');
  };

  // XÓA
  const handleDelete = (id: number) => {
    dispatch({
      type: 'todoList/remove',
      payload: id,
    });
    message.success('Đã xóa công việc');
  };

  // ĐỔI TRẠNG THÁI (Hoàn thành/Chưa hoàn thành)
  const handleToggle = (id: number) => {
    dispatch({
      type: 'todoList/toggle',
      payload: id,
    });
  };

  // SỬA (MỚI)
  const handleEdit = (id: number, newContent: string) => {
    if (!newContent.trim()) return; // Không cho phép sửa thành rỗng
    dispatch({
      type: 'todoList/update',
      payload: { id, content: newContent },
    });
    message.success('Đã cập nhật nội dung');
  };

  return (
    <Card title="Danh sách công việc (LocalStorage)" style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập công việc cần làm..."
          onPressEnter={handleAdd}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm
        </Button>
      </div>

      <List
        bordered
        dataSource={list}
        locale={{ emptyText: <Empty description="Chưa có công việc nào. Hãy thêm mới!" /> }}
        renderItem={(item: any) => (
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
            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Checkbox 
                checked={item.completed} 
                onChange={() => handleToggle(item.id)}
                style={{ marginRight: 12 }}
              />
              
              {/* Tích hợp tính năng Edit của Ant Design */}
              <Typography.Text 
                delete={item.completed} 
                style={{ flex: 1, color: item.completed ? '#999' : 'inherit', cursor: 'pointer' }}
                editable={{
                  tooltip: 'Nhấn để sửa',
                  onChange: (val) => handleEdit(item.id, val),
                }}
              >
                {item.content}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default connect(({ todoList }: { todoList: TodoState }) => ({
  todoList,
}))(TodoList);