import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperPriceProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 20px;  
`

export const WrapperPriceTextDes = styled.div`
    font-size: 16px;
    line-height: 40px;
    margin-right: 8px;
    padding: 10px;
    margin-top: 20px;  
`
export const WrapperQualityProduct = styled.h1`
    display: flex;
    gap: 4px;
    align-items: center;  
    width: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;

`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm{
        width: 40px;
        border-top: none;
        border-bottom: none;
        &.ant-input-number.handler-wrap{
            display: none;
        }
    }
}
`
