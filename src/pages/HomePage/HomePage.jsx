import React, { useEffect, useRef, useState } from 'react'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.jpg";
import banner3 from "../../assets/images/banner3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce'

export const HomePage = () => {
  const navigate = useNavigate()
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [limit, setLimit] = useState(6)

  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleNavigateProduct = () => {
    navigate('/product')
  }

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { data: products } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3, retryDelay: 1000, keepPreviousData: true
  })

  return (
    <div style={{ padding: '0 120px', background: '#fff' }}>
      <WrapperTypeProduct>
        <div style={{ cursor: "pointer" }} onClick={() => handleNavigateHome()}>Trang chủ</div>
        <div style={{ cursor: "pointer" }} onClick={() => handleNavigateProduct()}>Sản phẩm</div>
      </WrapperTypeProduct>
      <div id="container" style={{ height: '1500px', width: '100%', width: '100%' }}>
        <SliderComponent arrImages={[banner1, banner2, banner3]} />
        <WrapperProducts>
          {products?.data?.map((product) => {
            return (
              <CardComponent
                key={product._id}
                image={product.image}
                name={product.name}
                description={product.description}
                type={product.type}
                price={product.price}
                id={product._id}
              />
            )
          })}
        </WrapperProducts>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <WrapperButtonMore textbutton={"Xem thêm"} type="outline" styleButton={{
            border: '1px solid rgb(11,116,229)', color: 'rgp(11,116, 229)',
            width: '240px', height: '38px', boderRadius: '4px'
          }}
            onClick={() => setLimit((prev) => prev + 6)}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage