import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Alert, Space, Typography } from 'antd';
import { ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';

const DuDoanSo = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'info' | 'error' | 'warning', content: string } | null>(null);
  const [count, setCount] = useState<number>(0);

  // Hàm tạo số ngẫu nhiên từ 1 đến 100
  const generateNumber = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(random);
    setGuess('');
    setMessage({ type: 'info', content: 'Máy tính đã chọn một số từ 1 đến 100. Mời bạn đoán!' });
    setCount(0);
  };

  useEffect(() => {
    generateNumber();
  }, []);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) {
      setMessage({ type: 'error', content: 'Vui lòng nhập một số hợp lệ!' });
      return;
    }

    setCount(count + 1);

    if (num === targetNumber) {
      setMessage({ type: 'success', content: `Chính xác! Số bí mật là ${targetNumber}. Bạn đoán trúng sau ${count + 1} lần.` });
    } else if (num > targetNumber) {
      setMessage({ type: 'warning', content: 'Số bạn đoán LỚN hơn số bí mật.' });
    } else {
      setMessage({ type: 'warning', content: 'Số bạn đoán NHỎ hơn số bí mật.' });
    }
  };

  return (
    <Card title="Game: Dự đoán số ngẫu nhiên" style={{ maxWidth: 500, margin: '20px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert 
          message={message?.content} 
          type={message?.type as any} 
          showIcon 
        />
        
        <Space>
          <Input 
            type="number" 
            value={guess} 
            onChange={(e) => setGuess(e.target.value)} 
            placeholder="Nhập số dự đoán..." 
            onPressEnter={handleGuess}
            disabled={message?.type === 'success'}
          />
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={handleGuess} disabled={message?.type === 'success'}>
            Đoán
          </Button>
          <Button icon={<ReloadOutlined />} onClick={generateNumber}>
            Chơi lại
          </Button>
        </Space>
        
        <Typography.Text type="secondary">Số lần đoán: {count}</Typography.Text>
      </Space>
    </Card>
  );
};

export default DuDoanSo;