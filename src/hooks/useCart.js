import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * 购物车 Hook - 管理购物车状态和操作
 * @returns {Object} - 购物车状态和操作方法
 */
const useCart = () => {
  const [cartItems, setCartItems, clearCart] = useLocalStorage('shopping-cart', []);

  // 添加商品到购物车
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 如果商品已存在，增加数量
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 如果是新商品，添加到购物车
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // 更新商品数量
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 检查商品是否在购物车中
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // 获取商品在购物车中的数量（仅内部可能用到，保留简单实现）
  const getItemQuantity = (productId) => cartItems.find(item => item.id === productId)?.quantity || 0;

  // 计算购物车统计信息
  const cartStats = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const uniqueItems = cartItems.length;

    return {
      totalItems,
      totalPrice,
      uniqueItems,
      isEmpty: cartItems.length === 0
    };
  }, [cartItems]);

  return {
    // 状态
    cartItems,
    cartStats,
    
    // 操作方法
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };
};

export default useCart;