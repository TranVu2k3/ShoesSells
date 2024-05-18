import { Row } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 140px;
    background-color: rgb(26, 148, 255);
    align-items:center;
    gap: 16px;
    flex-wrap: nowrap
`;

export const WrapperTextHeader = styled.span`
    font-size: 18;
    color: #fff;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
`;

export const WrapperAccountHeader = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
    margin-Left: 20px;
`;