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
import { fetchSetting } from 'apis/settingApi';
import { useNavigate } from 'react-router-dom';

export default function LuckyDraw() {
    const navigate = useNavigate();
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
    const [setting, setSetting] = useState({
        background: '',
        title: '',
        subTitle: '',
        bgColor: '',
        textColor: '',
    });
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
            }, 20);
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
        let p3 = fetchSetting();

        Promise.all([p1, p2, p3])
            .then((values) => {
                if (values[0]?.success && values[1]?.success && values[2]?.success) {
                    if (!values[0]?.data?.length) {
                        enqueueSnackbar(t('noReward'), { variant: 'error' });
                        navigate('/reward');
                        return;
                    }
                    if (!values[1]?.data?.length) {
                        enqueueSnackbar(t('noUser'), { variant: 'error' });
                        navigate('/user');
                        return;
                    }
                    if (values[1].data.length < values[0].data.length) {
                        enqueueSnackbar(t('rewardMoreThanUser'), { variant: 'error' });
                        navigate('/user');
                        return;
                    }
                    setRewardList(values[0]?.data);
                    setUserList(values[1]?.data);
                    setSetting(values[2]?.data);
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
                        backgroundImage: setting?.background ? `url(${setting?.background})` : `url(${background})`,
                    }}
                >
                    <div className='grid-wrapper'>
                        <div className='title-set'>
                            <div className='title'>{setting?.title}</div>
                            <div className='sub-title'>{setting?.subTitle}</div>
                        </div>
                        <div className='top'>
                            <div className='reward'>
                                <div className='reward-set'>
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
                            </div>

                            <div className={`winnings grid-${rewardList[current]?.count}`}>
                                {showUsers.map((user) => (
                                    <div
                                        key={user?.id}
                                        className='winning-item'
                                        style={{
                                            color: setting?.textColor ? `#${setting?.textColor}` : '#fff',
                                            backgroundColor: setting?.bgColor ? `#${setting?.bgColor}` : '#e7ca78',
                                        }}
                                    >
                                        <span>{user?.name}</span>
                                        <span className='ml-10'>{user?.code}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='bottom'>
                            <div className='draw-button'>
                                {step === 0 && (
                                    <div
                                        onClick={() => toggle()}
                                        style={{
                                            color: setting?.textColor ? `#${setting?.textColor}` : '#fff',
                                            background: setting?.bgColor ? `#${setting?.bgColor}` : '#e7ca78',
                                        }}
                                    >
                                        抽獎
                                    </div>
                                )}
                                {step === 1 && (
                                    <div
                                        onClick={() => toggle()}
                                        style={{
                                            color: setting?.textColor ? `#${setting?.textColor}` : '#fff',
                                            background: setting?.bgColor ? `#${setting?.bgColor}` : '#e7ca78',
                                        }}
                                    >
                                        停止
                                    </div>
                                )}
                                {step === 2 && (
                                    <div
                                        onClick={() => next()}
                                        style={{
                                            color: setting?.textColor ? `#${setting?.textColor}` : '#fff',
                                            background: setting?.bgColor ? `#${setting?.bgColor}` : '#e7ca78',
                                        }}
                                    >
                                        下一獎項
                                    </div>
                                )}
                                {step === 3 && (
                                    <div
                                        onClick={() => {}}
                                        style={{
                                            color: setting?.textColor ? `#${setting?.textColor}` : '#fff',
                                            background: setting?.bgColor ? `#${setting?.bgColor}` : '#e7ca78',
                                        }}
                                    >
                                        抽獎結束
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
