import classNames from 'classnames/bind';
import styles from './Contributor.module.scss';
import Button from '../Button';
import icons from '~/assets/icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import background from '../../assets/images/myDieu.jpg';
import { AppContext } from '~/Context/AppContext';

const cx = classNames.bind(styles);

function Contributor({ idContributor, stars, quantity, name,avatarURl }) {
    const {user} = useContext(AppContext)
    const [avatar,setAvatar] = useState()
    const list = [];
    for (let i = 1; i <= stars; i++) {
        list.push(<img src={icons.star} alt="" className={cx('icon')}></img>);
    }

    while (list.length < 5) {
        list.push(<img src={icons.uncolorStar} alt="" className={cx('icon')}></img>);
    }


    const handleSelect = async () => {
        const conversation = {
            senderId: user?.id,
            receiverId: idContributor,
        };
        try {
            const res = await axios.post('http://localhost:8000/conversation', conversation);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(()=>{
       const fetchAvatar = async ()=>{
        console.log(avatarURl);

        const url = `http://localhost:8000/avatarUser/${avatarURl}`

        try{
            const blobResponse = await fetch(url);
            const blob = await blobResponse.blob();
            setAvatar(URL.createObjectURL(blob));

        }catch(error){
            console.log(error);

        }

       }
       fetchAvatar()
       return ()=>{
        console.log('clean up');
       }
    },[avatarURl])
    return (
        <div className={cx('wrapper')} style={{ backgroundImage: `url(${avatar})` }}>
            <div className={cx('detail')}>
                <div className={cx('info')}>
                    <div className={cx('rate')}>
                        <div className={cx('stars')}>{list}</div>
                        <div className={cx('votes')}>{quantity} đánh giá</div>
                    </div>
                    <div className={cx('name')}>{name}</div>
                </div>
                <Tippy
                    placement="top"
                    interactive
                    render={(attrs, index) => (
                        <PopperWrapper>
                            <Button option to="/chat" onClick={handleSelect}>
                                Nhắn tin
                            </Button>
                            <Button option to="/" onClick={handleSelect}>
                                Đặt Giao hàng
                            </Button>
                        </PopperWrapper>
                    )}
                >
                    <div className={cx('action')}>
                        <Button contact>Liên Lạc</Button>
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default Contributor;
