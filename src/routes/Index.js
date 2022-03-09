import Icon from "react-icons-kit";
import {
  grid,
  creditCard,
  list,
  plus,
  gift,
  image,
  layers,
  eyeOff,
  rss,
  shoppingCart,
  users,
  userPlus,
  activity,
  umbrella,
  bookOpen,
  rotateCcw,
  barChart2,
  truck,
  shieldOff,
  navigation2,
} from "react-icons-kit/feather";
import { mapMarker, locationArrow } from "react-icons-kit/fa";

// Dashboard








// Order

import OrderShow from "../pages/orders/Show";

import OrderCreate from "../pages/orders/Create";


export const routes = [
  
 
    {
        title: "Order",
        name: "order",
        inDrawer: true,
        icon: <Icon icon={shoppingCart} size={18} />,
        child: [
            
            {
                title: "New Order",
                name: "order store",
                path: "/dashboard/order/create",
                exact: true,
                inDrawer: true,
                icon: <Icon icon={plus} size={18} />,
                component: OrderCreate
            },
            {
                title: "Show Order",
                name: "order show",
                path: "/dashboard/order/:id/show",
                exact: true,
                inDrawer: false,
                icon: null,
                component: OrderShow
            },
           
        ]
    },
    
   
  
 
];
