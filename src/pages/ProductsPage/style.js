import { Col } from "antd";
import styled from "styled-components";

export const WrapperProducts = styled.div`
    marginTop: 20px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`

export const WrapperNavbar = styled(Col)`
    background: rgb(220,220,220);    
    margin-right: 10px;
    padding: 10px;
    border-radius: 6px;
    height: fit-content;
`

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    border-bottom: 1px solid gray;
    height: 44px;
`