import React from 'react';
import "./filter.css";
import
{ 
    Button,
    Slider,
    Rate,
}
from
"antd"
;


function Filter() {
    const sliderStyle = {
        width: '220px', // Set the desired width here
      };
    
    

    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <div className='Filter'>
            <h1 className='heading'>Select Category</h1>
            <Button>Open</Button>
            <Button>Sale Off</Button>                
            <Button>Pick Up</Button>
            <Button>Preferred</Button>
            <Button>Ordered</Button>                
            <Button>Verified</Button>
            <br />
            <h1 className='heading'>Price</h1>

            <Slider style={sliderStyle} />

            <h1 className='heading'>Rating</h1>
            <Rate />
            <br />            
            <br />           
            <br />


            <div className='flex'>
                <div className='box'>
                    <span class="material-symbols-outlined">cake</span>
                    <p className='item'>cake<nbsp /><nbsp /><nbsp /><nbsp /></p>
                </div>
                <div className='box'>
                    <span class="material-symbols-outlined">restaurant</span>
                    <p className='item'>food </p>
                </div>
                <div className='box'>
                    <span class="material-symbols-outlined">local_bar</span>
                    <p className='item'>drinks </p>
                </div>
                <div className='box'>
                    <span class="material-symbols-outlined">local_pizza</span>
                    <p className='item'>snack </p>
                </div>
                <div className='box'>
                    <span class="material-symbols-outlined">grocery</span>
                    <p className='item'>beverage </p>
                </div>
            </div>
            </div>
        </>
    )
}

export default Filter;