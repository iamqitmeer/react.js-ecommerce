import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as RouterLink,
  Button,
  Avatar,
  Badge,
  User,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { IsUserAvailable } from "../context/IsUserHe";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { IsUserDataAvailable } from "../context/UserDetails";
import { CartContext } from "../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  const handleClick = (event) => {
    event.preventDefault();
    navigate("/register");
  };

  const { isUser, setIsUser } = useContext(IsUserAvailable);
  const { userData, loading } = useContext(IsUserDataAvailable);

  if (loading) return <p>Loading...</p>;

  function handleSignOutBtn() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }

  let { cart, setCart } = useContext(CartContext);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <NavLink to={`/`}>
            <p className="font-black text-2xl underline">
              Sad<span className="text-blue-600">ny</span>
            </p>
          </NavLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <NavLink to={`about`} aria-current="page">
            About
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink to={`products`} color="foreground">
            Products
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink to={`contact`} color="foreground">
            Contact
          </NavLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {User ? (
          <NavLink to="/cart">
            <Badge content={cart.length} shape="circle" color="danger">
              <Button
                radius="full"
                isIconOnly
                variant="light"
                
              >
                <i className="ri-shopping-cart-fill text-xl"></i>
              </Button>
            </Badge>
          </NavLink>
        ) : (
          <NavLink to={`/login`}>
            <NavbarItem className="hidden lg:flex">
              <span>Login</span>
            </NavbarItem>
          </NavLink>
        )}

        {isUser ? (
          <Dropdown>
            <DropdownTrigger className="cursor-pointer">
              <Avatar isBordered src={userData.profileImageUrl} />
            </DropdownTrigger>
            <DropdownMenu aria-label="Action event example">
              <DropdownItem variant="light">
                {" "}
                <User
                  name={userData.fullName}
                  description={userData.email}
                  avatarProps={{
                    src: `${userData.profileImageUrl}`,
                  }}
                />
              </DropdownItem>
              <DropdownItem key="edit_profile">Edit Profile</DropdownItem>
              <DropdownItem key="favoutite_list">Favourite List</DropdownItem>
              <DropdownItem key="add_products">Add Products</DropdownItem>
              <DropdownItem key="add_products">Manage Products</DropdownItem>

              <DropdownItem
                onClick={handleSignOutBtn}
                key="delete"
                className="text-danger"
                color="danger"
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              type="button"
              color="primary"
              variant="shadow"
              onClick={handleClick}
            >
              Register
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
