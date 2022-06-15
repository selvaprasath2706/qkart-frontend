import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Adventures.css";
import ProductCard from "./ProductCard";
import { useParams   } from "react-router-dom";

import Cart, { generateCartItemsFrom } from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Adventures = () => {
  let {adventureId}=useParams()
  const [items, setItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  // NOTE - Needs to be state as timer value is to be persisted across renders
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);  
  const [allproducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

   const performAPICall1 = async () => {

    setLoading(true);

    try {
      const response = await axios.get(`${config.endpoint}/products/adventure/${adventureId}`);
      const response1 = await axios.get(`${config.endpoint}/products`);

      setAllProducts(response1.data)
      console.log("dataaa sasa",response1.data)
      console.log(allproducts)
      setLoading(false);
      console.log(response.data.products)
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      return response1.data;
    } catch (e) {
      setLoading(false);
      console.log("err",e)
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }

  };

  const performAPICall = async () => {

    setLoading(true);

    try {
      const response = await axios.get(`${config.endpoint}/products/adventure/${adventureId}`);
      const response1 = await axios.get(`${config.endpoint}/products`);

      setAllProducts(response1.data)
      console.log("dataaa sasa",response1.data)
      console.log(allproducts)
      setLoading(false);
      console.log(response.data.products)
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      return response.data.products;
    } catch (e) {
      setLoading(false);
      console.log("err",e)
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  // const performSearch = async (text) => {

  //   try {
  //     const response = await axios.get(
  //       `${config.endpoint}/products/search?value=${text}`
  //     );
  //     setFilteredProducts(response.data);
  //     return response.data;
  //   } catch (e) {
  //     if (e.response) {
  //       if (e.response.status === 404) {
  //         setFilteredProducts([]);
  //       }

  //       if (e.response.status === 500) {
  //         enqueueSnackbar(e.response.data.message, { variant: "error" });
  //         setFilteredProducts(products);
  //       }
  //     } else {
  //       enqueueSnackbar(
  //         "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
  //         {
  //           variant: "error",
  //         }
  //       );
  //     }
  //   }

  // };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    const value = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      search(value);
    }, 500);

    setDebounceTimeout(timeout);

  };


  const search = (text) => {
    console.log(text)
    setFilteredProducts(products.filter(
     (product) =>
       product.name.toUpperCase().includes(text.toUpperCase()) ||
       product.category.toUpperCase().includes(text.toUpperCase())
   ))
   };
  // useEffect(() => {
  //   performAPICall();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
  
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
  
    } catch (e) {
      console.log("hi")
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const updateCartItems = (cartData, products) => {
    console.log("cartData",allproducts);
    const cartItems = generateCartItemsFrom(cartData, allproducts);
    setItems(cartItems);
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {

    if (items) {
      return items.findIndex((item) => item.productId === productId) !== -1;
    }

  };
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if(!token) {
      enqueueSnackbar(
        "Login to add an item to the Cart",
        { variant: "warning" }
      );
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      // console.log(productId,qty)
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId:productId, quantity:qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
// console.log(response.data, products)
      updateCartItems(response.data, products);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }

  };



  const updateToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if(!token) {
      enqueueSnackbar(
        "Login to add an item to the Cart",
        { variant: "warning" }
      );
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }
    
    try {
      console.log(productId,qty)
      const response = await axios.put(
        `${config.endpoint}/cart`,
        { productId:productId, quantity:qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log(response.data, products)
      updateCartItems(response.data, products);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }

  };


  // FIXME - On page load, two "GET /cart" requests are made
  // NOTE - Not checking direclty for page load, but products change instead
  // useEffect( () => {
  // fetchCart(token)
  // .then((cartData) => generateCartItemsFrom(cartData, products))
  // .then((cartItems) => setItems(cartItems));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [products]);

  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await performAPICall();
      console.log("producrs data",productsData)
      const allprdts = await performAPICall1();
      const cartData = await fetchCart(token);
      console.log("products data",allprdts)
      const cartDetails = await generateCartItemsFrom(cartData, allprdts);

      setItems(cartDetails);
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
        
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
    
        onChange={(e) => debounceSearch(e, debounceTimeout)}
    
      />
      <Grid container>
        <Grid
          item
          xs={12}
      
          md={token && products.length ? 9 : 12}
      
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                  
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          items,
                          products,
                          product._id,
                          1,
                          {
                            preventDuplicate: true,
                          }
                        );
                      }}
                  
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No products found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              hasCheckoutButton
              products={products}
              items={items}
              handleQuantity={updateToCart}
            />
          </Grid>
        ) : null}
      </Grid>
      
      <Footer />
    </div>
  );
};

export default Adventures;




































// import { Search, SentimentDissatisfied } from "@mui/icons-material";
// import {
//   CircularProgress,
//   Grid,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useEffect, useState } from "react";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Products";

// import ProductCard from "./ProductCard";
// import Cart, { generateCartItemsFrom } from "./Cart";
// import { useParams   } from "react-router-dom";
// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  * 
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */
// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  * 
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} productId - Unique ID for the product
//  */

// const Adventures = () => {
//   let {adventureId}=useParams()
//   console.log(adventureId)
  
//   const [items, setItems] = useState([]);
//   const { enqueueSnackbar } = useSnackbar();
//   // NOTE - Needs to be state as timer value is to be persisted across renders
//   const [debounceTimeout, setDebounceTimeout] = useState(0);
//   const [isLoading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const token = localStorage.getItem("token");

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
//   /**
//    * Make API call to get the products list and store it to display the products
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on all available products
//    *
//    * API endpoint - "GET /products"
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "name": "iPhone XR",
//    *          "category": "Phones",
//    *          "cost": 100,
//    *          "rating": 4,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "v4sLtEcMpzabRyfx"
//    *      },
//    *      {
//    *          "name": "Basketball",
//    *          "category": "Sports",
//    *          "cost": 100,
//    *          "rating": 5,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "upLK9JbQ4rMhTwt4"
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 500
//    * {
//    *      "success": false,
//    *      "message": "Something went wrong. Check the backend console for more details"
//    * }
//    */
//   const performAPICall = async () => {

//     setLoading(true);

//     try {
//       const response = await axios.get(`${config.endpoint}/products`);

//       setLoading(false);

//       setProducts(response.data);
//       setFilteredProducts(response.data);
//       return response.data;
//     } catch (e) {
//       setLoading(false);

//       if (e.response && e.response.status === 500) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//         return null;
//       } else {
//         enqueueSnackbar(
//           "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//     }

//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
//   /**
//    * Definition for search handler
//    * This is the function that is called on adding new search keys
//    *
//    * @param {string} text
//    *    Text user types in the search bar. To filter the displayed products based on this text.
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on filtered set of products
//    *
//    * API endpoint - "GET /products/search?value=<search-query>"
//    *
//    */
//   const performSearch = async (text) => {

//     try {
//       const response = await axios.get(
//         `${config.endpoint}/products/search?value=${text}`
//       );
//       setFilteredProducts(response.data);
//       return response.data;
//     } catch (e) {
//       if (e.response) {
//         if (e.response.status === 404) {
//           setFilteredProducts([]);
//         }

//         if (e.response.status === 500) {
//           enqueueSnackbar(e.response.data.message, { variant: "error" });
//           setFilteredProducts(products);
//         }
//       } else {
//         enqueueSnackbar(
//           "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//     }

//   };

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
//   /**
//    * Definition for debounce handler
//    * With debounce, this is the function to be called whenever the user types text in the searchbar field
//    *
//    * @param {{ target: { value: string } }} event
//    *    JS event object emitted from the search input field
//    *
//    * @param {NodeJS.Timeout} debounceTimeout
//    *    Timer id set for the previous debounce call
//    *
//    */
//   const debounceSearch = (event, debounceTimeout) => {

//     const value = event.target.value;

//     if (debounceTimeout) {
//       clearTimeout(debounceTimeout);
//     }

//     const timeout = setTimeout(() => {
//       performSearch(value);
//     }, 500);

//     setDebounceTimeout(timeout);

//   };

//   // useEffect(() => {
//   //   performAPICall();
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, []);
//   /**
//    * Perform the API call to fetch the user's cart and return the response
//    *
//    * @param {string} token - Authentication token returned on login
//    *
//    * @returns { Array.<{ productId: string, qty: number }> | null }
//    *    The response JSON object
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 401
//    * {
//    *      "success": false,
//    *      "message": "Protected route, Oauth2 Bearer token not found"
//    * }
//    */
//   const fetchCart = async (token) => {
//     if (!token) return;

//     try {
//       // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
  
//       const response = await axios.get(`${config.endpoint}/cart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
  
//     } catch (e) {
//       if (e.response && e.response.status === 400) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//       return null;
//     }
//   };

//   const updateCartItems = (cartData, products) => {
//     const cartItems = generateCartItemsFrom(cartData, products);
//     setItems(cartItems);
//   };

//   // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
//   /**
//    * Return if a product already is present in the cart
//    *
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { String } productId
//    *    Id of a product to be checked
//    *
//    * @returns { Boolean }
//    *    Whether a product of given "productId" exists in the "items" array
//    *
//    */
//   const isItemInCart = (items, productId) => {

//     if (items) {
//       return items.findIndex((item) => item.productId === productId) !== -1;
//     }

//   };
//   /**
//    * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
//    *
//    * @param {string} token
//    *    Authentication token returned on login
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { Array.<Product> } products
//    *    Array of objects with complete data on all available products
//    * @param {string} productId
//    *    ID of the product that is to be added or updated in cart
//    * @param {number} qty
//    *    How many of the product should be in the cart
//    * @param {boolean} options
//    *    If this function was triggered from the product card's "Add to Cart" button
//    *
//    * Example for successful response from backend:
//    * HTTP 200 - Updated list of cart items
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 404 - On invalid productId
//    * {
//    *      "success": false,
//    *      "message": "Product doesn't exist"
//    * }
//    */
//   const addToCart = async (
//     token,
//     items,
//     products,
//     productId,
//     qty,
//     options = { preventDuplicate: false }
//   ) => {

//     if(!token) {
//       enqueueSnackbar(
//         "Login to add an item to the Cart",
//         { variant: "warning" }
//       );
//       return;
//     }

//     if (options.preventDuplicate && isItemInCart(items, productId)) {
//       enqueueSnackbar(
//         "Item already in cart. Use the cart sidebar to update quantity or remove item.",
//         {
//           variant: "warning",
//         }
//       );
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${config.endpoint}/cart`,
//         { productId, qty },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       updateCartItems(response.data, products);
//     } catch (e) {
//       if (e.response) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//     }

//   };

//   // FIXME - On page load, two "GET /cart" requests are made
//   // NOTE - Not checking direclty for page load, but products change instead
//   // useEffect( () => {
//   // fetchCart(token)
//   // .then((cartData) => generateCartItemsFrom(cartData, products))
//   // .then((cartItems) => setItems(cartItems));
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [products]);

//   useEffect(() => {
//     const onLoadHandler = async () => {
//       const productsData = await performAPICall();
//       const cartData = await fetchCart(token);
//       const cartDetails = await generateCartItemsFrom(cartData, productsData);
//       setItems(cartDetails);
//       console.log(productsData)
//       // console.log(adventureId)
//     };
//     onLoadHandler();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div>
//       <Header>
//         {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

//         <TextField
//           className="search-desktop"
//           size="small"
//           InputProps={{
//             className: "search",
//             endAdornment: (
//               <InputAdornment position="end">
//                 <Search color="primary" />
//               </InputAdornment>
//             ),
//           }}
//           placeholder="Search for items/categories"
//           name="search"
//           onChange={(e) => debounceSearch(e, debounceTimeout)}
//         />
        
//       </Header>

//       {/* Search view for mobiles */}
//       <TextField
//         className="search-mobile"
//         size="small"
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Search color="primary" />
//             </InputAdornment>
//           ),
//         }}
//         placeholder="Search for items/categories"
//         name="search"
    
//         onChange={(e) => debounceSearch(e, debounceTimeout)}
    
//       />
//       <Grid container>
//         <Grid
//           item
//           xs={12}
      
//           md={token && products.length ? 9 : 12}
      
//           className="product-grid"
//         >
//           <Box className="hero">
//             <p className="hero-heading">
//               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
//               to your door step
//             </p>
//           </Box>

//           {isLoading ? (
//             <Box className="loading">
//               <CircularProgress />
//               <h4>Loading Products...</h4>
//             </Box>
//           ) : (
//             <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
//               {filteredProducts.length ? (
//                 filteredProducts.map((product) => (
//                   <Grid item xs={6} md={3} key={product._id}>
//                     <ProductCard
//                       product={product}
                  
//                       handleAddToCart={async () => {
//                         await addToCart(
//                           token,
//                           items,
//                           products,
//                           product._id,
//                           1,
//                           {
//                             preventDuplicate: true,
//                           }
//                         );
//                       }}
                  
//                     />
//                   </Grid>
//                 ))
//               ) : (
//                 <Box className="loading">
//                   <SentimentDissatisfied color="action" />
//                   <h4 style={{ color: "#636363" }}>No products found</h4>
//                 </Box>
//               )}
//             </Grid>
//           )}
//         </Grid>
//         {token ? (
//           <Grid item xs={12} md={3} bgcolor="#E9F5E1">
//             <Cart
//               hasCheckoutButton
//               products={products}
//               items={items}
//               handleQuantity={addToCart}
//             />
//           </Grid>
//         ) : null}
//       </Grid>
      
//       <Footer />
//     </div>
//   );
// };

// export default Adventures;
