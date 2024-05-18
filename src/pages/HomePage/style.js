import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    border-bottom: 1px solid gray;
    height: 44px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &: hover{
        color: '#fff';
        background: rgb(13, 92, 182);
        span{
            color: '#fff';
        }
    }
    width: 100%
    text-align: center;
`
export const WrapperProducts = styled.div`
    marginTop: 20px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`
