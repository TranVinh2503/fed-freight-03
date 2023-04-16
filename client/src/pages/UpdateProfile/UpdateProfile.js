import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images/images';
import { useContext, useEffect } from 'react';
import { AppContext } from '~/Context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { string } from 'yup';

const cx = classNames.bind(styles);

function UpdateProfile() {
    const { user } = useContext(AppContext);
    const [userName, setUserName] = useState(user?.user);
    const [gmail, setGmail] = useState(user?.gmail);

    const [selectedFile, setSelectedFile] = useState();
    const [previewUrl, setPreviewUrl] = useState(null);

    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState();

    useEffect(() => {
        const handleFunction = async () => {
            if (user?.avatarUrl) {
                try {
                    const url = `http://localhost:8000/avatarUser/${user?.avatarUrl}`;
                    const blobResponse = await fetch(url);
                    const blob = await blobResponse.blob();
                    setPreviewUrl(URL.createObjectURL(blob));
                } catch (error) {
                    console.log(error);
                }
            }
        };
        handleFunction();
        return () => {
            console.log('clean up');
        };
    }, [user?.avatarUrl]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        console.log(file);

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        

        const formData = new FormData();
        console.log(selectedFile);
        formData.append('avatar', selectedFile);
        formData.append('userName', user?.userName);
        formData.append('userId', user?.id);
        formData.append('role', user?.userType);
        formData.append('fullName', fullName);
        formData.append('phone', phone.toString());
        try {
           
            const response = await axios.post('http://localhost:8000/updateInfo', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access-token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const blobResponse = await fetch(response.data.url);
            const blob = await blobResponse.blob();
            setPreviewUrl(URL.createObjectURL(blob));
            alert("Updated")
        } catch (error) {
            console.error(error);
        }
    };
    const handleFullNameChange = (firstName, lastName) => {
        if(user.fullName) {
            setFullName(user?.fullName);
        } else {
            const fullName = `${lastName} ${firstName}`;
            setFullName(fullName);
        }
    };
    useEffect(() => {
        if (user?.fullName && user?.phone) {
            console.log(user?.fullName);
            setFullName(user?.fullName);
            setPhone(user?.phone);
            
            const tmp = user?.fullName
            const nameArray = tmp.split(' ');
            console.log(nameArray);

            const firstName = nameArray[2];
            const lastName = nameArray[0];

            setFirstName(firstName);
            setLastName(lastName);
        }
    },[firstName,lastName,fullName,phone]);

    const isContributor = () => {
        if (user?.role === 'contributor') {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('content')}>
                    <div className={cx('column1')}>
                        <div className={cx('name')}>{fullName}</div>
                        <div className={cx('nick-name')}>{userName}</div>
                        {isContributor ? (
                            <div className={cx('role')}>Người phân phối</div>
                        ) : (
                            <div className={cx('role')}>Khách hàng</div>
                        )}
                        <form>
                            {previewUrl && <img className={cx('avatar')} src={previewUrl} alt="Avatar Preview" />}
                            <input type="file" id="avatar" onChange={handleFileSelect} />
                            <label htmlFor="avatar">Thay đổi ảnh</label>
                        </form>
                    </div>
                    <div className={cx('column2')}>
                        <div className={cx('heading')}>Thông tin cá nhân</div>
                        <form className={cx('input-form')}>
                            <div>
                                <label className={cx('title')}>Họ</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value.trim());
                                        handleFullNameChange(firstName, e.target.value);
                                    }}
                                ></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Tên</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value.trim());
                                        handleFullNameChange(e.target.value, lastName);
                                    }}
                                ></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Tên hiển thị</label>
                                <input
                                    type="text"
                                    className={cx('input')}
                                    defaultValue={user?.userName}
                                    readOnly
                                ></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Số điện thoại</label>
                                <input
                                    defaultValue={user?.phone}
                                    type="text"
                                    className={cx('input')}
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setPhone(e.target.value);
                                    }}
                                ></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Ngày sinh</label>
                                <input type="text" className={cx('input')}></input>
                            </div>
                            <div>
                                <label className={cx('title')}>Email</label>
                                <input type="text" className={cx('input')} defaultValue={user?.mail} readOnly></input>
                            </div>
                        </form>
                        <Button onClick={handleSubmit} update>
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
