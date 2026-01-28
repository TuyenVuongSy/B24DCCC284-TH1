import React, { useState } from 'react';
import { connect, Dispatch } from 'umi'; // 1. Bỏ TodoState ở đây (vì nó không thuộc umi)
import { Card, Input, List, Button, Checkbox, Typography, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// 2. Import TodoState từ đúng file Model của bạn
import { TodoState } from '@/models/todolist';

interface TodoListProps {
  dispatch: Dispatch;
  todoList: TodoState;
}

const TodoList: React.FC<TodoListProps> = ({ dispatch, todoList }) => {
  // 3. Thêm { list: [] } để tránh lỗi màn hình trắng nếu dữ liệu chưa kịp tải
  const { list } = todoList || { list: [] };
  
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      dispatch({
        type: 'todoList/add',
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
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)} />
            ]}
          >
            <Checkbox checked={item.completed} onChange={() => handleToggle(item.id)}>
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

export default connect(({ todoList }: { todoList: TodoState }) => ({
  todoList,
}))(TodoList);