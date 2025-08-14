import jwt from 'jsonwebtoken';

// 仅用于本地开发 Mock 的密钥（请勿用于生产环境）
const secret = '!&124coddefgg';

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
        // 使用 jsonwebtoken 签发带过期时间的 Token（1 天）
        const token = jwt.sign(
          { user },
          secret,
          { expiresIn: '1d' }
        );
        
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

  // 受保护：获取当前用户信息（需要携带 Authorization: Bearer <token>）
  {
    url: '/api/user',
    method: 'get',
    response: (req) => {
      const authHeader = req.headers?.authorization || '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      if (!token) {
        return {
          code: 401,
          message: '未提供授权令牌'
        };
      }

      try {
        const decoded = jwt.verify(token, secret);
        return {
          code: 200,
          data: decoded.user,
          message: 'ok'
        };
      } catch (err) {
        return {
          code: 401,
          message: '令牌无效或已过期'
        };
      }
    }
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