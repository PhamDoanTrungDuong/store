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
      //Home
      "Home_SalesProduct": "Sales Product",
      "Home_DealOfDay": "Deal of the day",
      "Home_Collaboration": "Collaboration",
      "Home_Trusted": "Trusted By Comsumers Across The World",
      "Home_AtStore": "At STORE., we give you the choice of 100+ degree programs and customized career preparation. Star professors and pro-level technology. Real-world experiences and alumni connections. All so you can turn your dream into your reality. Make it here so you can make it out there.",
      "Home_Completion": "Completion",
      "Home_Delivery": "Delivery",
      "Home_Transac": "Transactions",
      "Home_AllProduct": "All-Product In Store",
      "Home_OnTheStore": "On the Store's Best Product",
      "Home_MakeThings": "To Make Things Convenient For Site Visitors",
      "Home_Contact": "The contact us page on Dija Ouija website includes an image of her product - in this case, the artist work - to catch the eye of site visitors. To the left of an image is a form labeled “Contact Me.” Between the light pink, black and white used on both the image and the form, the artist, Kahdija Murray, has customized the contact page to fit her brand colors. Interestingly, the contact us page not only includes the standard name, email and message fields, but it also includes several social media buttons. Clicking on these buttons takes the user directly to Kahdija social media pages, providing yet another option for viewing her work and getting in touch.",
      "Home_Leading": "LEADING SERVICES",
      "Home_AllInclusive": "ALL-INCLUSIVE COMPANY FOR 20 YEARS IN-A-ROW",
      "Home_PhoneNumber": "PHONE NUMBER",
      "Home_Around": "AROUND THE WORLD",

      //Footer
      "Footer_Support": "SUPPORT",
      "Footer_Help": "HELP CENTER",
      "Footer_Contact": "CONTACT US",
      "Footer_API": "API STATUS",
      "Footer_Docs": "DOCUMENTATION",
      "Footer_Info": "INFO",
      "Footer_About": "ABOUT US",
      "Footer_Carrers": "CARRERS",
      "Footer_Invest": "INVEST",
      "Footer_Legal": "LEGAL",
      "Footer_Payments": "PAYMENTS",
      "Footer_SignUpShopping": "SIGN UP FOR SHOPPING",
      "Footer_Email": "Enter your email",
      "Footer_SignUp": "Sign Up",
      "Footer_Welcom": "Welcom to the",
      
      //Login
      "Login_Signin": "Sign In",
      "Login_Username": "Username",
      "Login_UsernameReq": "Username is require",
      "Login_Pass": "Password",
      "Login_PassReq": "Password is require",
      "Login_Or": "Or",
      "Login_GG": "Sign in with Google",
      "Login_Account": "Don't have an account",
      "Login_Signup": "Sign Up",
      
      //Register
      "Reg_Signup": "Sign Up",
      "Reg_Username": "Username",
      "Reg_UsernameReq": "Username is require",
      "Reg_Email": "Email",
      "Reg_EmailReq": "Email is require",
      "Reg_Pass": "Password",
      "Reg_PassReq": "Password is require",
      "Reg_PassComplex": "Password is not complex enough",
      "Reg_Register": "Register",
      "Reg_Already": "Already have an account?",
      "Reg_Signin": "Sign In",


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
      //Home
      "Home_SalesProduct": "Sản Phẩm Giảm Giá",
      "Home_DealOfDay": "Giảm giá trong ngày",
      "Home_Collaboration": "Đối Tác Kinh Doanh",
      "Home_Trusted": "Được Người Tiêu Dùng Trên Toàn Thế Giới Tin Cậy",
      "Home_AtStore": "Tại STORE., chúng tôi mang đến cho bạn sự lựa chọn trong số hơn 100 chương trình cấp bằng và sự chuẩn bị nghề nghiệp tùy chỉnh. Các giáo sư ngôi sao và công nghệ chuyên nghiệp. Kinh nghiệm thực tế và kết nối cựu sinh viên. Tất cả để bạn có thể biến ước mơ thành hiện thực. Làm cho nó ở đây để bạn có thể làm cho nó ra khỏi đó.",
      "Home_Completion": "Hoàn Thiện",
      "Home_Delivery": "Giao Hàng",
      "Home_Transac": "Giao dịch",
      "Home_AllProduct": "Tất Cả Sản Phẩm Ở Store",
      "Home_OnTheStore": "Những Sản Phẩm Tốt Nhất Của Cửa Hàng",
      "Home_MakeThings": "Để Làm Mọi Thứ Thuận Tiện Cho Khách Truy Cập Trang Ưeb",
      "Home_Contact": "Trang liên hệ với chúng tôi trên trang web Dija Ouija bao gồm hình ảnh sản phẩm của cô ấy - trong trường hợp này là tác phẩm của nghệ sĩ - để thu hút sự chú ý của khách truy cập trang web. Ở bên trái của hình ảnh là một biểu mẫu có nhãn “Liên hệ với tôi”. Giữa màu hồng nhạt, đen và trắng được sử dụng trên cả hình ảnh và hình thức, nghệ sĩ Kahdija Murray đã tùy chỉnh trang liên hệ để phù hợp với màu sắc thương hiệu của mình. Thật thú vị, trang liên hệ với chúng tôi không chỉ bao gồm các trường tên, email và thông báo tiêu chuẩn mà còn bao gồm một số nút truyền thông xã hội. Nhấp vào các nút này sẽ đưa người dùng trực tiếp đến các trang truyền thông xã hội của Kahdija, cung cấp một tùy chọn khác để xem tác phẩm của cô ấy và liên lạc.",
      "Home_Leading": "DỊCH VỤ HÀNG ĐẦU",
      "Home_AllInclusive": "CÔNG TY BAO GỒM TẤT CẢ TRONG 20 NĂM LIÊN TỤC",
      "Home_PhoneNumber": "SỐ ĐIỆN THOẠI",
      "Home_Around": "VÒNG QUANH THẾ GIỚI",
      //Footer
      "Footer_Support": "HỖ TRỢ",
      "Footer_Help": "TRUNG TÂM CHĂM SÓC",
      "Footer_Contact": "LIÊN HỆ",
      "Footer_API": "API STATUS",
      "Footer_Docs": "TÀI LIỆU",
      "Footer_Info": "THÔNG TIN",
      "Footer_About": "VỀ CHÚNG TÔI",
      "Footer_Carrers": "NGHỀ NGHIỆP",
      "Footer_Invest": "ĐẦU TƯ",
      "Footer_Legal": "HỢP PHÁP",
      "Footer_Payments": "THANH TOÁN",
      "Footer_SignUpShopping": "ĐĂNG KÝ MUA SẮM",
      "Footer_Email": "Nhập email của bạn",
      "Footer_SignUp": "Đăng ký",
      "Footer_Welcom": "Chào Mừng Đến Với",

      //Login
      "Login_Signin": "Đăng Nhập",
      "Login_Username": "Tài Khoản",
      "Login_UsernameReq": "Tài khoản không được bỏ trống",
      "Login_Pass": "Mật Khẩu",
      "Login_PassReq": "Mật khẩu không được bỏ trống",
      "Login_Or": "Hoặc",
      "Login_GG": "Đăng nhập bằng Google",
      "Login_Account": "Bạn chưa có tài khoản?",
      "Login_Signup": "Đăng Nhập",
      
      //Register
      "Reg_Signup": "Đăng Ký",
      "Reg_Username": "Tài Khoản",
      "Reg_UsernameReq": "Tài khoản không được bỏ trống",
      "Reg_Email": "Email",
      "Reg_EmailReq": "Email không được bỏ trống",
      "Reg_Pass": "Mật Khẩu",
      "Reg_PassReq": "Mật khẩu không được bỏ trống",
      "Reg_PassComplex": "Mật khẩu không đủ phức tạp",
      "Reg_Register": "Đăng ký",
      "Reg_Already": "Đã có tài khoản?",
      "Reg_Signin": "Đăng Nhập",
      
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