import i18n from "i18next";
import { initReactI18next } from "react-i18next";
export const locales = {
   en: "English",
   vi: "Tiếng Việt"
}
const resources = {
  en: {
    translation: {
      //Header
      "Menu_Product": "Products",
      "Menu_About": "About",
      "Menu_Contact": "Contact",
      "Menu_SignIn": "Sign In",
      "Menu_SignUp": "Sign Up",
      //Submenu
      "SubProfile_Profile": "Profile",
      "SubProfile_MyOrders": "My Order",
      "SubProfile_LikedProducts": "Liked Products",
      "SubProfile_FaceAuth": "Face Authentication",
      "SubProfile_ShippingAddress": "Shipping Address",
      "SubProfile_ChangePwd": "Change Password",
      "SubProfile_Logout": "Log out",
    }
  },
  vi: {
    translation: {
      //Header
      "Menu_Product": "Sản Phẩm",
      "Menu_About": "Về Chúng Tôi",
      "Menu_Contact": "Liên Hệ",
      "Menu_SignIn": "Đăng Nhập",
      "Menu_SignUp": "Đăng Ký",
      //Submenu
      "SubProfile_Profile": "Hồ sơ cá nhân",
      "SubProfile_MyOrders": "Đơn hàng của tôi",
      "SubProfile_LikedProducts": "Sản phẩm đã thích",
      "SubProfile_FaceAuth": "Nhận diện khuôn mặt",
      "SubProfile_ShippingAddress": "Địa chỉ giao hàng",
      "SubProfile_ChangePwd": "Đổi mật khẩu",
      "SubProfile_Logout": "Đăng xuất",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;