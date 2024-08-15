import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// Function to render stars based on rating
const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <>
            {Array(fullStars).fill(<StarIcon style={{ color: '#FFD700' }} />)}
            {halfStar && <StarHalfIcon style={{ color: '#FFD700' }} />}
            {Array(emptyStars).fill(<StarOutlineIcon style={{ color: '#FFD700' }} />)}
        </>
    );
}

const ProductListingComponent = styled.div`
.products__search__section{
 display: grid;
 place-items: center;
}
 .search__div{
  width: 97%;
  padding: 10px; 
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
  button{
   background: blue;
   border: none;
   padding: 10px;
   color: #fff;
   width: 90px;
   font-weight: 550;
   font-size: 16px;
   border-radius: 6px;
  }
 }
  .search{
   width: 100%;
   display: flex;
   align-items: center;
   border: 1px solid #999;
   border-radius: 20px;
   padding: 10px;
   input{
    width: 100%;
    border: none;
    outline: none;
    font-size: 18px;
   }
  }
.products__section{
 display: flex;
 width: 100%;
}
 .product__filter__section{
  width: 30%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2{
   display: flex;
   align-items: center;
   color: blue;
  }
   button{
    background: blue;
    color: #fff;
    border: none;
    cursor: pointer;
    width: 110px;
    height: 50px;
    border-radius: 6px;
    margin-top: 20px;
    font-size: 16px;
   }
    label{
     text-transform: Capitalize;
     font-size: 18px;
    }
 }
  .product__lists{
   width: 100%;
  }
   .product__list{
   display: ${props => props.displayProducts === "grid" ? 'grid' : 'flex'};
   width: auto;
   justify-content: start;
   flex-wrap: wrap;
   padding: 10px;
   gap: 20px;
   }
   .product-item{
    flex-direction: column;
    gap: 10px;
    width: ${props => props.displayProducts === "grid" ? '95%' : '25%'};
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    h2{
     font-size: 20px;
    }
    p{
      line-height: 1.2;
     }
    img{
    width: ${props => props.displayProducts === "grid" ? '' : '100%'};
     height: 200px;
     object-fit: contain;
    }
   }
    .product__header{
     display: flex;
     justify-content: space-evenly;
     align-items: center;
     margin-bottom: -20px;
    }
     select{
      width: 80px;
      height: 30px;
      margin-left: 10px;
      border-radius: 6px;
      cursor: pointer;
     }
      @media (max-width: 990px) {
   .product-item{
    width: ${props => props.displayProducts === "grid" ? '' : '40%'};
       }
      }
     @media (max-width: 650px) {
      .product-item{
       width: ${props => props.displayProducts === "grid" ? '' : '100%'};
       }
      }
`
const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [displayProducts, setDisplayProducts] = useState('flex');
    const [selectedCategories, setSelectedCategories] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                setProducts(response.data);
                setLoading(false);
                console.log(response.data);

            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    const sortProducts = (option) => {
        let sortedProducts = [...products];
        if (option === 'Reviews') {
            sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        } else if (option === 'Alphabetically') {
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (option === 'Price high to low') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (option === 'Price low to high') {
            sortedProducts.sort((a, b) => a.price - b.price);
        }
        setProducts(sortedProducts);
    };
    const handleSortChange = (event) => {
        const selectedOption = event.target.value;
        setSortOption(selectedOption);
        sortProducts(selectedOption);
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;
   

    const uniqueCategories = [...new Set(products.map(product => product.category))];
    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.includes(product.category))
    );
    return (
        <ProductListingComponent displayProducts={displayProducts}>
            <div className='products__search__section'>
                <div className='search__div'>
                    <div className='search'>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button>Search</button>
                </div>
            </div>
            <div className='products__section'>
                <div className='product__filter__section'>
                    <h2><FilterAltIcon fontSize='large' /> Filter</h2>
                    <div>
                        {uniqueCategories.map((category, index) => (
                            <div key={index} style={{marginTop: '10px'}}>
                                <input
                                    type='checkbox'
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                <label>{category}</label>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setSelectedCategories([])}>Clear Filters</button>
                </div>
                <div className='product__lists'>
                    <div className='product__header'>
                        <h2>Products({filteredProducts.length})</h2>
                        <div>
                            Sort by
                            <select value={sortOption} onChange={handleSortChange}>
                                <option value="">Select</option>
                                <option value="Reviews">Reviews</option>
                                <option value="Alphabetically">Alphabetically</option>
                                <option value="Price high to low">Price high to low</option>
                                <option value="Price low to high">Price low to high</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <GridViewIcon style={{ cursor: 'pointer', color: displayProducts === 'flex' ? 'blue' : 'black' }} onClick={() => setDisplayProducts('flex')} />
                            <FormatListBulletedIcon style={{ cursor: 'pointer', color: displayProducts === "grid" ? 'blue' : 'black' }} onClick={() => setDisplayProducts('grid')} />
                        </div>
                    </div>
                    <div className="product__list">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-item">
                                <img src={product.image} alt={product.title} />
                                <h2>{product.title}</h2>
                                <p><b>Price: </b>${product.price}</p>
                                <p><b>Stock: </b>{product.rating.count}</p>
                                <div style={{ display: 'flex', justifyContent: 'start' }}>
                                    {renderRating(product.rating.rate)}
                                </div>
                                <p style={{ color: "#555" }}><span style={{ fontWeight: '600' }}>Description: </span>{product.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProductListingComponent>
    );
};

export default ProductListing;
