import styles from './coze.module.css'
import {
    useRef,
    useState
} from 'react'
import useTitle from '@/hooks/useTitle'
import BottomNavigation from '@/components/BottomNavigation'
import { Button, Toast } from 'react-vant'
import useAuthStore from '@/store/useAuthStore'
const Coze = () => {
    useTitle('AI生成头像')
    const uploadUrl = 'https://api.coze.cn/v1/files/upload';
    const patToken = import.meta.env.VITE_PAT_TOKEN;
    const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
    const workflow_id = '7533136698567098411';

    const uploadImageRef = useRef(null)
    const [imgPreview, setImgPreview] = useState('https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png');
    const [uniform_color, setUniformColor] = useState('红');
    const [uniform_number, setUniformNumber] = useState(10);
    const [position, setPosition] = useState(0);
    const [shooting_hand, setShootingHand] = useState(0);
    const [style, setStyle] = useState('写实');
    const [imgUrl, setImgUrl] = useState('');
    const [status, setStatus] = useState('');
    const [imgError, setImgError] = useState(false);

    const user = useAuthStore(state => state.user);
    const updateUser = useAuthStore(state => state.updateUser);
    const updateImageData = () => {
        const input = uploadImageRef.current;
        // console.log(uploadImageRef.current)
        if (!input.files || input.files.length === 0) { return; }
        const file = input.files[0];
        // console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            // base64格式图片
            setImgPreview(e.target?.result)
            // imgPreview.value = e.target?.result as string; 
        };
    }
    const uploadFile = async () => {
        // 请求体对象
        const formData = new FormData();
        const input = uploadImageRef.current;
        if (!input.files || input.files.length <= 0) return;
        // 二进制文件
        formData.append('file', input.files[0]);

        const res = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${patToken}`, },
            body: formData,
        });

        const ret = await res.json();
        console.log(ret);
        if (ret.code !== 0) { setStatus(ret.msg); return; }

        return ret.data.id;
    }
    const generate = async () => {
        setStatus("图片上传中...");
        const file_id = await uploadFile();
        console.log(file_id);
        if (!file_id) return;
        setStatus("图片上传成功，正在生成...")
        const parameters = {
            // 图片需要id
            picture: JSON.stringify({ file_id }),
            style: style,
            uniform_number: uniform_number, //队服编号 
            uniform_color: uniform_color, // 队服颜色 
            position: position, // 0-守门员，1-前锋，2-后卫 
            shooting_hand: shooting_hand, // 0-左手，1-右手 
        };
        const res = await fetch(workflowUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${patToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workflow_id, parameters, }),
        });
        const ret = await res.json();
        console.log(ret);
        if (ret.code !== 0) { setStatus(ret.msg); return; }
        const data = JSON.parse(ret.data);
        console.log(data);
        setStatus('');
        setImgError(false);
        setImgUrl(data.data);
    }

    const applyAsAvatar = () => {
        if (!imgUrl) {
            Toast.info('请先生成头像');
            return;
        }
        if (!user) {
            Toast.fail('请先登录');
            return;
        }
        const result = updateUser({ avatar: imgUrl });
        if (result && result.success) {
            Toast.success('已更新为头像');
        } else {
            Toast.fail(result?.error || '更新失败');
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
            <div className={styles.input}>
                <div className={styles.fileInput}>
                    <input
                        ref={uploadImageRef}
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        required
                        onChange={updateImageData}
                    />
                </div>
                <img
                    src={imgPreview}
                    alt="preview"
                    className={styles.preview}

                />
                <div className={styles.settings}>
                    <div className={styles.selection}>
                        <label>队服编号</label>
                        <input value={uniform_number} type="number" onChange={(event) => setUniformNumber(event.target.value)} />
                    </div>
                </div>
                <div className={styles.selection}>
                    <label>队服颜色:</label>
                    <select value={uniform_color} onChange={(e) => { setUniformColor(e.target.value) }}>
                        <option value="红">红</option>
                        <option value="蓝">蓝</option>
                        <option value="绿">绿</option>
                    </select>
                </div>
                <div className="settings">
                    <div className="selection">
                        <label>位置：</label>
                        <select value={position} onChange={(e) => { setPosition(e.target.value) }}>
                            <option value="0">守门员</option>
                            <option value="1">前锋</option>
                            <option value="2">后卫</option>
                        </select>
                    </div>
                    <div className={styles.selection}>
                        <label>持杆:</label>
                        <select value={shooting_hand} onChange={(e) => setShootingHand(e.target.value)}>
                            <option value="0">左手</option>
                            <option value="1">右手</option>
                        </select>
                    </div>
                    <div className={styles.selection}>
                        <label>风格:</label>
                        <select value={style} onChange={(e) => setStyle(e.target.value)}>
                            <option value="写实">写实</option>
                            <option value="乐高">乐高</option>
                            <option value="国漫">国漫</option>
                        </select>
                    </div>
                </div>
                <div className={styles.generate}>
                    <Button type="primary" block onClick={generate}>生成</Button>
                </div>
            </div>
            <div className={styles.output}>
                <div className={styles.generated}>
                    {imgUrl && !imgError && (
                        <img src={imgUrl} alt="generated" onError={() => setImgError(true)} />
                    )}
                    {imgUrl && imgError && (
                        <a href={imgUrl} target="_blank" rel="noreferrer">在新标签页打开图片</a>
                    )}
                    {imgUrl && !imgError && (
                        <div className={styles.actions}>
                            <Button type="primary" block onClick={applyAsAvatar}>选作为头像</Button>
                        </div>
                    )}
                    {status && <div className={styles.status}>{status}</div>}
                </div>
            </div>
            </div>
            <BottomNavigation />

        </div>
    )
}
export default Coze