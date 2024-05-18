import Card from "antd/es/card/Card";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px;
    },
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56, 56, 61);
`
export const WrapperReportText = styled.div`
    font-size: 10px;
    font-weight: 400;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    gap: 2px;
`

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weght: 500;
`
export const InfoText = styled.div`
    text-align: center;
`

