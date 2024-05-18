import { Col, Image, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import { WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextDes, WrapperQualityProduct, WrapperStyleNameProduct } from './style';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import * as message from '../Message/Message'

const ProductDetailsConponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {

        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct
    })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    return (
        <Row style={{ padding: '16px', background: '#fff' }}>
            <Col span={10}>
                <Image src={productDetails?.image} alt='image product' preview={false} style={{ width: '500px' }} />
            </Col>
            <Col span={2}>

            </Col>
            <Col span={12}>
                <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                <div>
                    <WrapperPriceProduct>{productDetails?.price.toLocaleString()} vnđ</WrapperPriceProduct>
                    <WrapperPriceTextDes>{productDetails?.description}</WrapperPriceTextDes>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ marginBottom: '6px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                <MinusOutlined style={{ fontSize: '15px', justifyContent: 'center' }} size="10" />
                            </button>
                            <WrapperInputNumber controls={false} defaultValue={1} max={productDetails?.countInStock} min={1} onChange={onChange} value={numProduct} size='small' />
                            <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ fontSize: '15px', justifyContent: 'center' }} size="10" />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: 'rgb(255,57,69)',
                            height: '48px',
                            width: '220px',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                        onClick={handleAddOrderProduct}
                        textbutton={'Thêm vào giỏ hàng'}
                        styleTextButton={{ color: '#fff' }}
                    ></ButtonComponent>
                    {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng</div>}
                    {/* <ButtonComponent
                        size={40}
                        styleButton={{
                            background: 'rgb(255,57,69)',
                            height: '48px',
                            width: '220px',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                        textbutton={'Thanh toán'}
                        styleTextButton={{ color: '#fff' }}
                    ></ButtonComponent> */}
                </div>
            </Col >
        </Row >
    )
}

export default ProductDetailsConponent