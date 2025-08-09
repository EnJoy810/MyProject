import { generateToken } from '../src/utils/jwt.js';

// 简化的mock数据
const users = {
  'admin': { id: 1, username: 'admin', nickname: '管理员', role: 'admin' },
  'user': { id: 2, username: 'user', nickname: '普通用户', role: 'user' }
};

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body;
      
      if (users[username] && password === '123456') {
        const user = users[username];
        const token = generateToken({ userId: user.id, username });
        
        return {
          code: 200,
          data: { user, token },
          message: '登录成功'
        };
      }
      
      return {
        code: 401,
        message: '用户名或密码错误'
      };
    }
  },

  // 退出登录
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => ({
      code: 200,
      message: '退出成功'
    })
  },

  // 获取商品列表
  {
    url: '/api/products',
    method: 'get',
    response: () => ({
      code: 200,
      data: [
        { id: 1, title: 'iPhone 15 Pro', price: 9999, rating: 4.8 },
        { id: 2, title: 'MacBook Pro M3', price: 12999, rating: 4.9 },
        { id: 3, title: 'AirPods Pro 2', price: 1899, rating: 4.7 }
      ],
      message: '获取成功'
    })
  }
];