import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="194"
        image={product.image}
        alt={product.name}
      />
     
      <CardContent >
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
          {product.name}
          </Typography>
          <Typography variant="h5" color="black"  sx={{fontWeight: 'bold'}}>
          ₹{product.cost}
          </Typography>
          <Rating  name="read-only" readOnly value={product.rating} />
                <CardActions>
                <Button fullWidth startIcon={<AddShoppingCartOutlined/>}  variant="contained" color="success" 
                onClick={(e)=>{
                    e.preventDefault();
                    handleAddToCart()
                  }}>ADD TO CART
                  </Button>
                </CardActions>
                  </CardContent>
    </Card>
  );
};

export default ProductCard;
