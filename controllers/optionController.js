import productDetails from '../json/productDetails.json'

const getCategories = (req, res) => {
    res.status(200).json({
        success: true,
        categories: productDetails.categories
    });
};

export {
    getCategories
};