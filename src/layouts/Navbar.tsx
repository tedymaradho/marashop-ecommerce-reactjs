import { ChangeEvent, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BiSearchAlt } from 'react-icons/bi';
import { FaShoppingCart, FaUserAlt } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RxAvatar } from 'react-icons/rx';
import { AiFillSetting, AiFillHome } from 'react-icons/ai';
import Footer from './Footer';
import { Select, SelectChangeEvent, MenuItem, Badge } from '@mui/material/';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  sumQtyAtom,
  cartItemsAtom,
  currentUserAtom,
  sumSubTotalAtom,
} from '../recoils';
import axios from 'axios';

const Navbar = () => {
  const [categoryMany, setCategoryMany] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [cartDropdownOpen, setCartDropdownOpen] = useState<boolean>(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState<boolean>(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState<boolean>(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState<boolean>(false);
  const [sumQty, setSumQty] = useRecoilState(sumQtyAtom);
  const [cartItems, setCartItems] = useRecoilState(cartItemsAtom);
  const { curUserId, curUserName } = useRecoilValue(currentUserAtom);
  const setSumSubTotal = useSetRecoilState(sumSubTotalAtom);

  const navigate = useNavigate();

  const options = [
    { value: 'dress', label: 'Dress' },
    { value: 'shirt', label: 'Shirt' },
    { value: 'pants', label: 'Pants' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'bag', label: 'Bag' },
    { value: 'hat', label: 'Hat' },
    { value: 'jacket', label: 'Jacket' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'slippers', label: 'Slippers' },
  ];

  useEffect(() => {
    if (categoryMany.length > 0) {
      navigate(`Category=${categoryMany}`);
    } else {
      navigate('/');
    }
  }, [categoryMany]);

  useEffect(() => {
    if (searchText.length > 0) {
      navigate(`ProductName[regex]=${searchText}options`);
    } else {
      navigate('/');
    }
  }, [searchText]);

  useEffect(() => {
    const fetchDataCart = async () => {
      try {
        const resCount = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart/stats/${curUserId}`
        );
        if (resCount.data.data.length > 0) {
          setSumQty(resCount.data.data[0].sumQty);
          setSumSubTotal(resCount.data.data[0].sumSubTotal);
        }

        const resItems = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart?IdUser=${curUserId}`
        );

        resItems.data.results > 0 && setCartItems(resItems.data.data.cartItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataCart();
  }, [sumQty]);

  const categoryChangeHandler = (
    event: SelectChangeEvent<typeof categoryMany>
  ) => {
    const {
      target: { value },
    } = event;

    setCategoryMany(typeof value === 'string' ? value.split(',') : value);
  };

  const searchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <div className="navbar__container">
        <div className="navbar">
          <Link to="/" className="navbar__logo--box">
            <img
              className="navbar__logo--img"
              src="https://firebasestorage.googleapis.com/v0/b/maradho-8c79e.appspot.com/o/logo%2FLOGO%20MARADHO.webp?alt=media&token=1e4f07ad-c9c8-4ac3-99f1-13bc6320947e"
              alt="logo"
            />
            <h1 className="navbar__logo--name">MaraShop</h1>
          </Link>
          <div className="navbar__search">
            <div className="navbar__search--box">
              <input
                className="navbar__search--input"
                type="text"
                placeholder="Search by product name..."
                onChange={searchChangeHandler}
                value={searchText}
              />
              <BiSearchAlt className="icon__search" />
            </div>

            <Select
              multiple
              displayEmpty
              value={categoryMany}
              onChange={categoryChangeHandler}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>Category</p>;
                }

                return selected.join(',');
              }}
              sx={{ fontSize: '1.5rem', color: 'gray' }}
            >
              {options.map((opt) => (
                <MenuItem
                  sx={{ fontSize: '1.5rem' }}
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="navbar__link">
            <Link to="/">
              <AiFillHome className="icon__home" />
            </Link>
            <Badge
              onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              onMouseEnter={() => {
                setCartDropdownOpen(true);
                setNotifDropdownOpen(false);
                setAvatarDropdownOpen(false);
                setMenuDropdownOpen(false);
              }}
              badgeContent={sumQty}
              color="error"
              className="icon__badge"
            >
              <FaShoppingCart
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                onMouseEnter={() => {
                  setCartDropdownOpen(true);
                  setNotifDropdownOpen(false);
                  setAvatarDropdownOpen(false);
                  setMenuDropdownOpen(false);
                }}
                className="icon__cart"
              />
            </Badge>
            <Badge
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              onMouseEnter={() => {
                setNotifDropdownOpen(true);
                setCartDropdownOpen(false);
                setAvatarDropdownOpen(false);
                setMenuDropdownOpen(false);
              }}
              badgeContent={0}
              color="error"
              className="icon__badge"
            >
              <IoMdNotifications
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                onMouseEnter={() => {
                  setNotifDropdownOpen(true);
                  setCartDropdownOpen(false);
                  setAvatarDropdownOpen(false);
                  setMenuDropdownOpen(false);
                }}
                className="icon__notif"
              />
            </Badge>
            <FaUserAlt
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              onMouseEnter={() => {
                setAvatarDropdownOpen(true);
                setCartDropdownOpen(false);
                setNotifDropdownOpen(false);
                setMenuDropdownOpen(false);
              }}
              className="icon__user"
            />
            <AiFillSetting
              onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
              onMouseEnter={() => {
                setMenuDropdownOpen(true);
                setCartDropdownOpen(false);
                setNotifDropdownOpen(false);
                setAvatarDropdownOpen(false);
              }}
              className="icon__setting"
            />
          </div>
        </div>
        {cartDropdownOpen && (
          <div
            onMouseLeave={() => setCartDropdownOpen(false)}
            className="navbar__cart"
          >
            <div className="navbar__cart--dropdown">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const { _id, ImageUrl, ProductName, SalePrice, Qty } = item;

                  return (
                    <div key={_id} className="navbar__cart--items">
                      <img
                        src={ImageUrl}
                        alt={`Image of ${ProductName}`}
                        className="navbar__cart--img"
                      />
                      <span className="navbar__cart--price">
                        Rp. {Intl.NumberFormat('en-US').format(SalePrice)}
                      </span>
                      x<span>{Qty}</span>
                      <span>{ProductName}</span>
                    </div>
                  );
                })
              ) : (
                <p>Empty Items</p>
              )}
            </div>
            {cartItems.length > 0 && (
              <Link
                onClick={() => setCartDropdownOpen(false)}
                to="/checkout"
                className="navbar__cart--link"
              >
                Checkout
              </Link>
            )}
          </div>
        )}

        {notifDropdownOpen && (
          <div
            onMouseLeave={() => setNotifDropdownOpen(false)}
            className="navbar__notif"
          >
            <div className="navbar__notif--dropdown"></div>
          </div>
        )}

        {avatarDropdownOpen && (
          <div
            onMouseLeave={() => setAvatarDropdownOpen(false)}
            className="navbar__user"
          >
            <div className="navbar__user--dropdown">
              <div>
                <RxAvatar className="icon__avatar" />
                <p>{curUserName}</p>
              </div>
              <Link
                onClick={() => setAvatarDropdownOpen(false)}
                className="navbar__user--item"
                to=""
              >
                Change Password
              </Link>
              <Link
                onClick={() => setAvatarDropdownOpen(false)}
                className="navbar__user--item"
                to=""
              >
                Sign Up
              </Link>
              <Link
                onClick={() => setAvatarDropdownOpen(false)}
                className="navbar__user--item"
                to=""
              >
                Login
              </Link>
            </div>
          </div>
        )}

        {menuDropdownOpen && (
          <div
            onMouseLeave={() => setMenuDropdownOpen(false)}
            className="navbar__menu"
          >
            <div className="navbar__menu--dropdown">
              <Link
                onClick={() => setMenuDropdownOpen(false)}
                to="/product/list"
                className="navbar__menu--item"
              >
                <p>Manage Products</p>
              </Link>
              <Link
                onClick={() => setMenuDropdownOpen(false)}
                to="/product/add"
                className="navbar__menu--item"
              >
                <p>Add Product</p>
              </Link>
              <Link
                onClick={() => setMenuDropdownOpen(false)}
                to=""
                className="navbar__menu--item"
              >
                <p>Stock</p>
              </Link>
              <Link
                onClick={() => setMenuDropdownOpen(false)}
                to=""
                className="navbar__menu--item"
              >
                <p>Discount</p>
              </Link>
              <Link
                onClick={() => setMenuDropdownOpen(false)}
                to="/settings"
                className="navbar__menu--item"
              >
                <p>Settings</p>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Outlet />
      <Footer />
    </>
  );
};

export default Navbar;
