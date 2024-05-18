import { Image } from "antd";
import React from 'react'
import Slider from 'react-slick';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    };
    return (
        <Slider {...settings}>
            {arrImages.map((image, index) => {
                return (
                    <Image key={index} src={image} alt="slider" preview={false} width="1300px" height="500px" />
                )
            })}
        </Slider>
    )
}

export default SliderComponent