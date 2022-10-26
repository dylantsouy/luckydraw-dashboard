import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.scss';
import background from 'assets/images/background.png';
import { fetchRewardList } from 'apis/rewardApi';
import { useTranslation } from 'langs/useTranslation';
import { useSnackbar } from 'notistack';
import 'react-medium-image-zoom/dist/styles.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { fetchUserList } from 'apis/userApi';
import Loading from 'components/common/Loading';

export default function LuckyDraw() {
    const [backgroundImage, setBackgroundImage] = useState('');
    const { t } = useTranslation('common');
    const goingRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [rewardList, setRewardList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [current, setCurrent] = useState(0);
    const [step, setStep] = useState(0); //
    const [winners, setWinners] = useState([]);
    const [result, setResult] = useState({});
    const [showUsers, setShowUsers] = useState([]);

    const randomCountUser = (users, count) => {
        let list = [...users];
        let shows = [];
        for (let index = 0; index < count; index++) {
            const random = Math.floor(Math.random() * list.length);
            shows.push(list[random]);
            list[random] = list[list.length - 1];
            list.length--;
        }
        return shows;
    };
    const next = () => {
        setCurrent((prev) => prev + 1);
        setShowUsers([]);
        setStep(0);
    };
    const toggle = () => {
        if (!goingRef.current) {
            const winnerIds = winners.map((w) => w.id);
            let others = winnerIds.length ? userList.filter((u) => !winnerIds.includes(u.id)) : userList;
            goingRef.current = setInterval(() => {
                setShowUsers(randomCountUser(others, rewardList[current]?.count));
            }, 200);
            setStep(1);
        } else {
            clearInterval(goingRef.current);
            goingRef.current = false;
            setWinners((prev) => [...prev, ...showUsers]);
            setShowUsers(showUsers);
            console.log('winners', winners);
            if (current === rewardList?.length - 1) {
                setStep(3);
            } else {
                setStep(2);
            }
        }
    };

    useEffect(() => {
        let p1 = fetchRewardList();
        let p2 = fetchUserList();

        Promise.all([p1, p2])
            .then((values) => {
                if (values[0]?.success && values[1]?.success) {
                    setRewardList(values[0]?.data);
                    setUserList(values[1]?.data);
                    setLoading(false);
                }
            })
            .catch(() => {
                enqueueSnackbar(t('getDataFailed'), { variant: 'error' });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enqueueSnackbar]);

    return (
        <div className='luckydraw-wrapper'>
            {loading ? (
                <Loading />
            ) : (
                <div
                    className='content'
                    style={{
                        backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${background})`,
                    }}
                >
                    <div className='grid-wrapper'>
                        <div className='top'>
                            <div className='reward'>
                                <div className='reward-name'>{rewardList[current]?.name}</div>
                                <div className='reward-count'>數量:{rewardList[current]?.count}</div>
                                <div className='reward-img'>
                                    <LazyLoadImage
                                        className='reward-image'
                                        src={rewardList[current]?.url}
                                        alt='reward-image'
                                        effect='blur'
                                    />
                                </div>
                            </div>

                            <div className={`winnings grid-${rewardList[current]?.count}`}>
                                {showUsers.map((user) => (
                                    <div key={user?.id} className='winning-item'>
                                        <span>{user?.name}</span>
                                        <span className='ml-10'>{user?.code}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='draw-button'>
                                {step === 0 && <div onClick={() => toggle()}>抽獎</div>}
                                {step === 1 && <div onClick={() => toggle()}>停止</div>}
                                {step === 2 && <div onClick={() => next()}>下一獎項</div>}
                                {step === 3 && <div onClick={() => {}}>抽獎結束</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
