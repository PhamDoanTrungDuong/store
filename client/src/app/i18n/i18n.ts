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
      
      //Catalog
      "Cat_Sort": "Sort Order",
      "Cat_Latest": "Latest Product",
      "Cat_Alpha": "Alphabetical",
      "Cat_HTL": "Hight to low",
      "Cat_LTH": "Low to hight",
      "Cat_Price": "Price Range",
      "Cat_Brand": "Brands",
      "Cat_Cats": "Categories",
  
      //Product Search
      "ProSear_Search": "Search Products...",
      
      //Pagination
      "Page_Display": "Displaying",
      "Page_Of": "of",
      "Page_Items": "items",
      
      //Product Details
      "De_Qty": "Quantity",
      "De_PIS": "Product in stock",
      "De_Color": "Color",
      "De_Size": "Size",
      "De_AddCart": "Add To Cart",
      "De_UpdateCart": "Update Quantity",
      "De_Desc": "DESCRIPTION",
      "De_Policy": "SHIPPING AND RETURN",
      "De_Review": "REVIEW",
      "De_ReturnPolicy": "Returns Policy",
      "De_Pol1": "+ You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).",
      "De_Pol2": "+ You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes the transit time for us to receive your return from the shipper (5 to 10 business days), the time it takes us to process your return once we receive it (3 to 5 business days), and the time it takes your bank to process our refund request (5 to 10 business days).",
      "De_Pol3": "+ If you need to return an item, simply login to your account, view the order using the 'Complete Orders' link under the My Account menu and click the Return Item(s) button. We'll notify you via e-mail of your refund once we've received and processed the returned item.",
      "De_Ship": "Shipping",
      "De_ShipPol1": "+ We can ship to virtually any address in the world. Note that there are restrictions on some products, and some products cannot be shipped to international destinations.",
      "De_ShipPol2": "+ When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose. Depending on the shipping provider you choose, shipping date estimates may appear on the shipping quotes page.",
      "De_ShipPol3": "+ Please also note that the shipping rates for many items we sell are weight-based. The weight of any such item can be found on its detail page. To reflect the policies of the shipping companies we use, all weights will be rounded up to the next full pound.",
      "De_Comment": "Add a new comment",
      "De_Evaluate": "Evaluate",
      "De_Type": "Type your comment",
      "De_Submit": "Submit",

      //Basket
      "Bas_Empty": "Your Cart Is Empty",
      "Bas_Text": "Add something to make you happy (:",
      "Bas_GoBack": "Go to Shopping",
      
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

      //Catalog
      "Cat_Sort": "Thứ tự sắp xếp",
      "Cat_Latest": "Sản phẩm mới nhất",
      "Cat_Alpha": "Theo chữ cái",
      "Cat_HTL": "Cao tới thấp",
      "Cat_LTH": "Thấp tới cao",
      "Cat_Price": "Khoảng giá",
      "Cat_Brand": "Thương hiệu",
      "Cat_Cats": "Loại hàng",
      
      //Product Search
      "ProSear_Search": "Tìm kiếm sản phẩm...",

      //Pagination
      "Page_Display": "Hiển thị",
      "Page_Of": "của",
      "Page_Items": "sản phẩm",

      //Product Details
      "De_Qty": "Số Lượng",
      "De_PIS": "Sản phẩm trong kho",
      "De_Color": "Màu",
      "De_Size": "Kích cỡ",
      "De_AddCart": "Thêm vào giỏ hàng",
      "De_UpdateCart": "Cập nhật số lượng",
      "De_Desc": "MÔ TẢ",
      "De_Policy": "VẬN CHUYỂN VÀ HOÀN TRẢ",
      "De_Review": "ĐÁNH GIÁ",
      "De_ReturnPolicy": "Quy định đổi trả",
      "De_Pol1": "+ Bạn có thể trả lại hầu hết các mặt hàng mới, chưa mở trong vòng 30 ngày kể từ ngày giao hàng để được hoàn lại toàn bộ tiền. Chúng tôi cũng sẽ thanh toán chi phí vận chuyển trả lại nếu việc trả lại là do lỗi của chúng tôi (bạn đã nhận được một mặt hàng không chính xác hoặc bị lỗi, v.v.).",
      "De_Pol2": "+ Bạn sẽ nhận được tiền hoàn lại trong vòng bốn tuần sau khi giao gói hàng của mình cho người gửi hàng trả lại, tuy nhiên, trong nhiều trường hợp, bạn sẽ nhận được tiền hoàn lại nhanh hơn. Khoảng thời gian này bao gồm thời gian vận chuyển để chúng tôi nhận được hàng trả lại của bạn từ người gửi hàng (5 đến 10 ngày làm việc), thời gian chúng tôi xử lý hàng trả lại của bạn sau khi chúng tôi nhận được hàng (3 đến 5 ngày làm việc) và thời gian cần thiết ngân hàng của bạn để xử lý yêu cầu hoàn tiền của chúng tôi (5 đến 10 ngày làm việc).",
      "De_Pol3": "+ Nếu bạn cần trả lại một mặt hàng, chỉ cần đăng nhập vào tài khoản của bạn, xem đơn đặt hàng bằng cách sử dụng liên kết 'Hoàn thành đơn đặt hàng' trong menu Tài khoản của tôi và nhấp vào nút Trả lại (các) mặt hàng. Chúng tôi sẽ thông báo cho bạn qua e-mail về khoản hoàn trả của bạn sau khi chúng tôi đã nhận và xử lý mặt hàng bị trả lại.",
      "De_Ship": "Giao Hàng",
      "De_ShipPol1": "+ Chúng tôi có thể gửi đến hầu như bất kỳ địa chỉ nào trên thế giới. Lưu ý rằng có những hạn chế đối với một số sản phẩm và một số sản phẩm không thể được vận chuyển đến các điểm đến quốc tế.",
      "De_ShipPol2": "+ Khi bạn đặt hàng, chúng tôi sẽ ước tính ngày vận chuyển và giao hàng cho bạn dựa trên tình trạng sẵn có của các mặt hàng và các tùy chọn vận chuyển mà bạn chọn. Tùy thuộc vào nhà cung cấp dịch vụ vận chuyển mà bạn chọn, ước tính ngày vận chuyển có thể xuất hiện trên trang báo giá vận chuyển.",
      "De_ShipPol3": "+ Cũng xin lưu ý rằng giá vận chuyển cho nhiều mặt hàng chúng tôi bán dựa trên trọng lượng. Trọng lượng của bất kỳ mục nào như vậy có thể được tìm thấy trên trang chi tiết của nó. Để phản ánh chính sách của các công ty vận chuyển mà chúng tôi sử dụng, tất cả các trọng lượng sẽ được làm tròn thành pound đầy đủ tiếp theo.",
      "De_Comment": "Thêm một bình luận mới",
      "De_Evaluate": "Đánh giá",
      "De_Type": "Gõ bình luận của bạn",
      "De_Submit": "Gửi",

      //Basket
      "Bas_Empty": "Giỏ hàng của bạn rỗng",
      "Bas_Text": "Thêm vào thứ gì đó để giúp bạn vui vẻ (:",
      "Bas_GoBack": "Đi mua sắm nào!",
      
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