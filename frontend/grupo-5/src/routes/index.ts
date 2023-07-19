import Admin from 'pages/admin'
import Login from 'pages/login/Login'
import Home from 'pages/Home'
import Product from 'pages/Product'
import Products from 'pages/Products'
import AdminProducts from 'pages/admin/products'
import AddProduct from 'pages/admin/product/add'
import AdminProduct from 'pages/admin/product'
import AdminCategories from 'pages/admin/categories'
import AddCategory from 'pages/admin/category/add'
import AdminCategory from 'pages/admin/category'
import Verification from 'pages/login/Verification'
import Profile from 'pages/user/Profile'
import Bookings from 'pages/user/Bookings'
import AdminUsers from 'pages/admin/users'
import AdminCities from 'pages/admin/cities'
import AddCity from 'pages/admin/city/add'
import AdminCity from 'pages/admin/city'
import Favorites from 'pages/user/Favorites'
import AddBooking from 'pages/AddBooking'
import Booking from 'pages/Booking'
import AdminUser from 'pages/admin/user'
import AdminBookings from 'pages/admin/bookings'
import AdminBooking from 'pages/admin/booking'

export const routes = [
	{
		path: '/',
		Component: Home,
	},
	{
		path: '/login',
		Component: Login,
	},
	{
		path: '/products',
		Component: Products,
	},
	{
		path: '/product/:id',
		Component: Product,
	},
	{
		path: '/verification',
		Component: Verification,
	},
]

export const userRoutes = [
	{
		path: '/profile',
		Component: Profile,
	},
	{
		path: '/favorites',
		Component: Favorites,
	},
	{
		path: '/bookings',
		Component: Bookings,
	},
	{
		path: '/addBooking/:id',
		Component: AddBooking,
	},
	{
		path: '/booking/:id',
		Component: Booking,
	},
]

export const adminRoutes = [
	{
		path: '/admin',
		Component: Admin,
	},
	{
		path: '/admin/products',
		Component: AdminProducts,
	},
	{
		path: '/admin/product/add',
		Component: AddProduct,
	},
	{
		path: '/admin/product/:id',
		Component: AdminProduct,
	},
	{
		path: '/admin/categories',
		Component: AdminCategories,
	},
	{
		path: '/admin/category/:id',
		Component: AdminCategory,
	},
	{
		path: '/admin/category/add',
		Component: AddCategory,
	},
	{
		path: '/admin/users',
		Component: AdminUsers,
	},
	{
		path: '/admin/cities',
		Component: AdminCities,
	},
	{
		path: '/admin/city/add',
		Component: AddCity,
	},
	{
		path: '/admin/city/:id',
		Component: AdminCity,
	},
	{
		path: '/admin/user/:id',
		Component: AdminUser,
	},
	{
		path: '/admin/bookings',
		Component: AdminBookings,
	},
	{
		path: '/admin/booking/:id',
		Component: AdminBooking,
	},
]
