import React, { useState } from 'react';
import { 
  Dialog, 
  Field, 
  Button, 
  Loading, 
  Toast, 
  Image,
  Grid,
  GridItem
} from 'react-vant';
import { generateAvatarWithCoze, continueCozeConversation, saveAvatarImage } from '@/api/cozeApi';
import styles from './style.module.css';

const AvatarGenerator = ({ show, onClose, onAvatarGenerated, userInfo }) => {
  const [step, setStep] = useState(1); // 1: 输入描述, 2: 生成中, 3: 选择头像
  const [loading, setLoading] = useState(false);
  const [generatedAvatars, setGeneratedAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [avatarDescription, setAvatarDescription] = useState('');

  // 生成头像
  const handleGenerateAvatar = async () => {
    if (!avatarDescription.trim()) {
      Toast.info('请输入头像描述');
      return;
    }

    setLoading(true);
    setStep(2);

    try {
      Toast.info('正在为您生成个性化头像...');
      
      const result = await generateAvatarWithCoze({
        description: avatarDescription,
        user_id: userInfo?.id || '123456789'
      });

      if (result.success) {
        setGeneratedAvatars(result.images || []);
        setConversationId(result.conversationId);
        
        if (result.images.length > 0) {
          setStep(3);
          Toast.success(`成功生成${result.images.length}个头像！`);
        } else {
          Toast.info('正在生成头像，请稍候...');
          setTimeout(() => {
            setStep(1);
            Toast.info('生成时间较长，请稍后重试');
          }, 30000);
        }
      } else {
        Toast.fail(result.error || '生成失败，请重试');
        setStep(1);
      }
    } catch (error) {
      console.error('生成头像错误:', error);
      Toast.fail('网络连接异常，请检查网络后重试');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // 重新生成
  const handleRegenerate = async () => {
    if (!conversationId) {
      Toast.info('请先完成首次生成');
      return;
    }

    setLoading(true);
    
    try {
      Toast.info('正在重新生成头像...');
      const result = await continueCozeConversation(
        conversationId,
        `根据以下描述重新生成头像：${avatarDescription}`,
        userInfo?.id || '123456789'
      );

      if (result.success) {
        setGeneratedAvatars(result.images || []);
        Toast.success('重新生成成功！');
      } else {
        Toast.fail(result.error || '重新生成失败');
      }
    } catch (error) {
      Toast.fail('重新生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 选择头像
  const handleSelectAvatar = async (imageUrl) => {
    if (!imageUrl) return;

    setLoading(true);
    
    try {
      // 保存头像到服务器
      const savedUrl = await saveAvatarImage(imageUrl, userInfo?.id);
      
      // 回调给父组件
      onAvatarGenerated(savedUrl);
      
      Toast.success('头像设置成功！');
      handleClose();
    } catch (error) {
      Toast.fail('保存头像失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 关闭对话框
  const handleClose = () => {
    setStep(1);
    setGeneratedAvatars([]);
    setSelectedAvatar(null);
    setConversationId(null);
    setAvatarDescription('');
    onClose();
  };

  // 渲染描述输入步骤
  const renderDescriptionStep = () => (
    <div className={styles.descriptionForm}>
      <div className={styles.formSection}>
        <Field
          label="头像描述"
          placeholder="请详细描述您想要的头像，例如：'一个蓝眼睛、棕色头发的卡通人物，穿着红色外套，背景是星空'"
          value={avatarDescription}
          onChange={(value) => setAvatarDescription(value)}
          rows={4}
          type="textarea"
        />
        <p className={styles.tipText}>💡 提示：描述越详细，生成的头像越符合您的预期</p>
      </div>

      <div className={styles.buttonGroup}>
        <Button block type="primary" onClick={handleGenerateAvatar} loading={loading}>
          🎨 开始生成头像
        </Button>
      </div>
    </div>
  );

  // 渲染生成中步骤
  const renderGeneratingStep = () => (
    <div className={styles.generatingContainer}>
      <Loading size="48px" className={styles.loadingIcon} />
      <h3>AI正在为你创作专属头像...</h3>
      <p className={styles.generatingText}>
        根据你的描述，我们正在生成多个风格的头像供你选择
      </p>
      <div className={styles.tips}>
        <p>💡 小提示：生成过程约需要30-60秒</p>
      </div>
    </div>
  );

  // 渲染头像选择步骤
  const renderSelectionStep = () => (
    <div className={styles.selectionContainer}>
      <h3>选择你喜欢的头像</h3>
      
      {generatedAvatars.length > 0 ? (
        <>
          <Grid columns={2} gutter={10} className={styles.avatarGrid}>
            {generatedAvatars.map((imageUrl, index) => (
              <GridItem key={index}>
                <div 
                  className={`${styles.avatarOption} ${selectedAvatar === imageUrl ? styles.selected : ''}`}
                  onClick={() => setSelectedAvatar(imageUrl)}
                >
                  <Image
                    src={imageUrl}
                    fit="cover"
                    width="100%"
                    height="120px"
                    radius="8px"
                    lazyLoad
                  />
                  <div className={styles.avatarIndex}>#{index + 1}</div>
                </div>
              </GridItem>
            ))}
          </Grid>
          
          <div className={styles.buttonGroup}>
            <Button 
              type="primary" 
              block 
              disabled={!selectedAvatar || loading}
              loading={loading}
              onClick={() => handleSelectAvatar(selectedAvatar)}
            >
              ✨ 使用这个头像
            </Button>
            
            <Button 
              block 
              className={styles.regenerateBtn}
              onClick={handleRegenerate}
              disabled={loading}
            >
              🔄 重新生成
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.noAvatars}>
          <p>😅 似乎没有生成成功，请重试</p>
          <Button onClick={handleGenerateAvatar}>重新生成</Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog
      visible={show}
      title="🎨 AI生成头像"
      showCancelButton={step !== 2}
      showConfirmButton={false}
      onCancel={handleClose}
      onClose={handleClose}
      className={styles.avatarDialog}
      closeOnClickOverlay={step !== 2}
    >
      <div className={styles.dialogContent}>
        {step === 1 && renderDescriptionStep()}
        {step === 2 && renderGeneratingStep()}
        {step === 3 && renderSelectionStep()}
      </div>
    </Dialog>
  );
};

export default AvatarGenerator;