import useTitle from '@/hooks/useTitle'
import {
    useState,
    useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Image,
    Cell,
    CellGroup,
    ActionSheet,
    Dialog,
    Toast,
    Button
} from 'react-vant'
import {
    ServiceO,
    StarO,
    SettingO,
    Upgrade,
    PhoneO,
    ShareO
} from '@react-vant/icons'
import BottomNavigation from '@/components/BottomNavigation';
import useAuthStore from '@/store/useAuthStore';
import styles from './profile.module.css';

const Profile = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const updateUser = useAuthStore(state => state.updateUser);
    
    // 用户信息状态 - 从store获取或使用默认值
    const [userInfo, setUserInfo] = useState({
        nickname: user?.nickname || '哈基米',
        level: user?.level || '3级',
        avatar: user?.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    })
    
    useTitle("我的")
    
    // 当store中的用户信息变化时更新本地状态
    useEffect(() => {
        if (user) {
            setUserInfo({
                nickname: user.nickname || '哈基米',
                level: user.level || '3级',
                avatar: user.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
            });
        }
    }, [user]);

    // 进入本页时禁用页面纵向滚动与回弹，离开时恢复
    useEffect(() => {
        const prevBodyOverflow = document.body.style.overflow;
        const prevBodyPaddingBottom = document.body.style.paddingBottom;
        const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;
        const prevHtmlOverscrollY = document.documentElement.style.overscrollBehaviorY;

        // 禁止滚动与回弹
        document.body.style.overflow = 'hidden';
        document.body.style.paddingBottom = '0px';
        document.documentElement.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehaviorY = 'none';

        // 确保初始定位在顶部
        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        };
        resetScroll();
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(resetScroll);
        }

        return () => {
            document.body.style.overflow = prevBodyOverflow;
            document.body.style.paddingBottom = prevBodyPaddingBottom;
            document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
            document.documentElement.style.overscrollBehaviorY = prevHtmlOverscrollY;
        };
    }, []);
    
    // 控制操作表和对话框显示
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    
    // 编辑用户信息的临时状态
    const [tempUserInfo, setTempUserInfo] = useState({...userInfo});
    
    // 处理头像操作 - 改为跳转到 AI 生成头像页面
    const handleAction = (action) => {
        setShowActionSheet(false);
        if (action.type === 'ai') {
            navigate('/coze');
        }
    }

    // 处理AI生成头像成功回调
    const handleAvatarGenerated = (avatarUrl) => {
        // 更新用户头像
        setUserInfo(prev => ({...prev, avatar: avatarUrl}));
        // 更新store中的用户信息
        updateUser({...user, avatar: avatarUrl});
        // no-op
    };
    
    // 操作选项
    const actions = [
        { name: 'AI生成头像', type: 'ai', color: '#07c160' }
    ]
    
    // 统计数据
    const stats = [
        { title: '足迹', value: '888' },
        { title: '关注', value: '3' },  // 改为"关注"并调整位置
        { title: '收藏', value: '8' }
    ];
    
    // 菜单数据
    const menuData = [
        { icon: <StarO />, title: '好价订阅' },
        { icon: <Upgrade />, title: '升级会员' },

        { icon: <ServiceO />, title: '帮助反馈' },
        { icon: <PhoneO  />, title: '在线客服' },
        { icon: <ShareO  />, title: '分享APP' },
        { icon: <SettingO />, title: '系统设置' }
    ];
    // 处理编辑用户信息
    const handleEditInfo = () => {
        setTempUserInfo({...userInfo});
        setShowEditDialog(true);
    }
    // 保存用户信息
    const handleSaveInfo = async () => {
        const result = await updateUser(tempUserInfo);
        if (result.success) {
            setUserInfo({...tempUserInfo});
            setShowEditDialog(false);
            Toast.success('保存成功');
        } else {
            Toast.fail(result.error || '保存失败');
        }
    }
    
    // 退出登录处理函数 - 极简版本
    const handleLogout = () => {
        localStorage.removeItem('auth-store');
        window.location.href = '/';
    }
    return (
        <div className={styles.container}>
            {/* 用户信息区域 */}
            <div className={styles.userHeader}>
                <div className={styles.userInfo}>
                    <Image 
                        round
                        width="80px"
                        height="80px"
                        src={userInfo.avatar}
                        className={styles.avatar}
                        onClick={() => setShowActionSheet(true)}
                    />
                    <div className={styles.userDetails}>
                        <div className={styles.nickname}>{userInfo.nickname}</div>
                        <div className={styles.levelContainer}>
                            <button className={styles.btnGrade}>我的等级</button>
                            <span className={styles.level}>{userInfo.level}</span>
                        </div>
                    </div>
                </div>
                
                {/* 统计区域 */}
                <div className={styles.statsContainer}>
                    {stats.map((item, index) => (
                        <div key={index} className={styles.statItem}>
                            <div className={styles.statValue}>{item.value}</div>
                            <div className={styles.statTitle}>{item.title}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 菜单区域 */}
            <div className={styles.menuSection}>
                <CellGroup>
                    {menuData.map((item, index) => (
                        <Cell 
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            isLink 
                            center
                        />
                    ))}
                </CellGroup>
            </div>

            {/* 添加独立的退出登录按钮 */}
            <div className={styles.logoutButtonContainer}>
                <Button 
                    type="danger"
                    size="large"
                    block
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    退出登录
                </Button>
            </div>
            
            {/* 头像操作面板 */}
            <ActionSheet
                visible={showActionSheet}
                actions={actions}
                duration={200}
                cancelText='取消'
                onCancel={() => setShowActionSheet(false)}
                onSelect={handleAction}
            />
            
            {/* 编辑用户信息对话框 */}
            <Dialog 
                visible={showEditDialog}
                title="编辑个人信息"
                onCancel={() => setShowEditDialog(false)}
                onConfirm={handleSaveInfo}
                cancelButtonText="取消"
                confirmButtonText="保存"
            >
                <div className={styles.editForm}>
                    <div className={styles.formItem}>
                        <span>昵称：</span>
                        <input 
                            value={tempUserInfo.nickname}
                            onChange={(e) => setTempUserInfo({...tempUserInfo, nickname: e.target.value})}
                            className={styles.input}
                        />
                    </div>
                </div>
            </Dialog>

            {/* 已移除 AI 头像生成器，仅保留头像选择 */}
            
            <BottomNavigation />
        </div>
    )
}

export default Profile