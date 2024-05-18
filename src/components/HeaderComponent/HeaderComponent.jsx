import { Badge, Col, Popover } from "antd";
import React, { useState } from 'react'
import { WrapperAccountHeader, WrapperContentPopup, WrapperHeader, WrappeTextHeaderSmall } from "./style";
import { WrapperTextHeader } from "./style";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButttonInputSearch from "../ButtonInputSearch/ButttonInputSearch";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { resetUser } from '../../redux/slides/userSlide';
import * as UserService from '../../services/UserService'
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [search, setSearch] = useState('')
  const order = useSelector((state) => state.order)

  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleNavigateOrder = () => {
    navigate('/order')
  }
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleLogout = async () => {
    await UserService.logoutUser()
    dispatch(resetUser())
  }
  const handleClickNavigate = (type) => {
    if (type === 'admin') {
      navigate('/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
  }

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div>
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader onClick={() => handleNavigateHome()}>STORE BÁN GIÀY</WrapperTextHeader>
        </Col>
        <Col span={13} style={{ display: 'flex', }}>
          <ButttonInputSearch
            style={{ width: '500px' }}
            size="large"
            textbutton="Tìm kiếm"
            placeholder="input search text"
            onChange={onSearch}
          />
        </Col>
        <Col span={6} style={{ display: 'flex', gap: '20px' }}>
          <WrapperAccountHeader>
            <UserOutlined style={{ fontSize: '30px' }} />
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" >
                  <div style={{ cursor: 'pointer', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                <WrappeTextHeaderSmall>Đăng nhập/Đăng ký</WrappeTextHeaderSmall>
                <div>
                  <WrappeTextHeaderSmall>Tài khoản</WrappeTextHeaderSmall>
                  <CaretDownOutlined />
                </div>
              </div>
            )}
          </WrapperAccountHeader>
          <div>
            <Badge count={order?.orderItems?.length} size="small">
              <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff', marginLeft: '20px' }} />
            </Badge>
            <WrappeTextHeaderSmall onClick={handleNavigateOrder} style={{ cursor: 'pointer' }}>Giỏ hàng</WrappeTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent