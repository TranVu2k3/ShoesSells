import React, { useState } from 'react'
import { Menu } from 'antd'
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../../utils';
import { WrapperAccountHeader, WrapperHeader, WrapperTextHeader } from "./style";
import { Col } from "antd";
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';

const AdminPage = () => {
    const user = useSelector((state) => state?.user)
    const navigate = useNavigate()

    const items = [
        getItem('Người dùng', 'users', <UserOutlined />),
        getItem('Sản phẩm', 'products', <AppstoreOutlined />),
        getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'users':
                return (
                    <AdminUser />
                )
            case 'products':
                return (
                    <AdminProduct />
                )
            case 'orders':
                return (
                    <AdminOrder />
                )
            default:
                return <></>
        }
    }

    const handleNavigateHome = () => {
        navigate('/')
    }

    const handleOnCLick = ({ key }) => {
        setKeySelected(key)
    }

    return (
        <div >
            <WrapperHeader>
                <Col span={5}>
                    <WrapperTextHeader onClick={() => handleNavigateHome()}>STORE BÁN GIÀY</WrapperTextHeader>
                </Col>
                <Col span={13} style={{ display: 'flex', }}>

                </Col>
                <Col span={6} style={{ display: 'flex', gap: '20px' }}>
                    <WrapperAccountHeader>
                        <UserOutlined style={{ fontSize: '30px' }} />
                        {user?.access_token ? (<div>{user.name}</div>
                        ) : (
                            <>
                            </>
                        )}
                    </WrapperAccountHeader>
                </Col>
            </WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ overflowX: 'hidden' }}>
                    <Menu
                        mode="inline"
                        style={{
                            width: 256,
                            boxShadow: '1px 1px 2px #ccc',
                            height: '100vh'
                        }}
                        items={items}
                        onClick={handleOnCLick} />
                </div>
                <div style={{ width: '100%', padding: '15px 0 15px 15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>

        </div>
    )
}

export default AdminPage