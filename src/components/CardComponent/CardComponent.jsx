import React from 'react'
import { InfoText, StyleNameProduct, WrapperCardStyle, WrapperPriceText, WrapperReportText } from './style'
import { useNavigate } from 'react-router-dom'

const CardComponent = (props) => {
    const { name, image, price, type, description, countInStock, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable={{ width: "200px", height: "200px" }}
            style={{ width: 239 }}
            bordered={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <InfoText>
                <StyleNameProduct>{name}</StyleNameProduct>
                <WrapperReportText>
                    <span style={{ marginRight: '4px' }}>
                        {/* <span></span><StarFilled style={{ fontSize: '12px', color: 'yellow' }} /> */}
                    </span>
                    <span></span>
                </WrapperReportText>
                <WrapperPriceText>{price.toLocaleString()} vnđ</WrapperPriceText>
            </InfoText>
        </WrapperCardStyle >
    )
}

export default CardComponent