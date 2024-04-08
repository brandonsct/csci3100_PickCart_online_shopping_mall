import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    img, 
    Button,
} from "antd";

const ProductDetails = (product) => {
    console.log("product>>", product)
    return (
       
        <Card 
        size={"small"}
        title={product.product.productName}
        cover={
            <img
                style={{ width: "200px", height: "auto" }}
                src={product.product.imgSrc}
                alt={product.product.productName}
            />
        }
        >
            <p>$ {product.product.price}</p>
            <p>Description: {product.product.productName}</p>

            <p class="text-stone-500 text-xs">
                Product ID: {product.product.productId}
            </p>
        </Card>
    )
}

export default ProductDetails