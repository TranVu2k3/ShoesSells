import React, { useState, useEffect } from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { WrapperTypeProduct } from './style'
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce'
import { useSelector } from 'react-redux'

const ProductPage = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const handleNavigateHome = () => {
        navigate('/')
    }
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [product, setProduct] = useState([])

    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 6,
        total: 1,
    })

    const fetchProductAll = async (page, limit) => {
        const res = await ProductService.getAllProduct(page, limit)
        setProduct(res?.data)
        setPanigate({ ...panigate, total: res?.totalPage })
        return res
    }

    useEffect(() => {
        if (state) {
            fetchProductAll(panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const { data: products } = useQuery({
        queryKey: ['products', searchDebounce],
        queryFn: fetchProductAll,
        retry: 3, retryDelay: 1000, keepPreviousData: true
    })

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    return (
        <div style={{ padding: '0 110px' }}>
            <WrapperTypeProduct>
                <h5><span style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => handleNavigateHome()}>Trang chủ</span> - Sản phẩm</h5>
            </WrapperTypeProduct>
            <Row style={{ flexWrap: 'nowrap', paddingTop: '20px' }}>
                <WrapperNavbar span={4}>
                    <NavBarComponent />
                </WrapperNavbar>
                <Col span={20}>
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (
                                <CardComponent
                                    key={product._id}
                                    image={product.image}
                                    name={product.name}
                                    description={product.description}
                                    countInStock={product.countInStock}
                                    type={product.type}
                                    price={product.price}
                                    id={product._id}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <Pagination defaultCurrent={panigate.page + 1} total={panigate?.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                </Col>
            </Row>
        </div>
    )
}

export default ProductPage