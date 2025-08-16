// 简化的JWT工具
export const generateToken = (payload) => {
  // 简单的token生成 
  const data = btoa(JSON.stringify({
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
  }));
  return `jwt.${data}.signature`;
};

export const decodeToken = (token) => {
  try {
    if (!token || !token.includes('.')) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    return null;
  }
};

export const isTokenValid = (token) => {
  const payload = decodeToken(token);
  if (!payload) return false;
  return Date.now() < payload.exp;
};