using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager, RoleManager<Role> roleManager){
            //NOTIFY
            if(!context.Notifies.Any())
            {
                var notify = new Notify
                {
                    Description = "Admin Notifications",
                    CommentNotify = false,
                    OrderNotify = false,
                    MemberNotify = false
                };

                context.Notifies.Add(notify);
            }

            // ROLE
            var roles = new List<Role>
            {
                new Role{Name = "Member"},
                new Role{Name = "Admin"},
                new Role{Name = "Moderator"},
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            // CATEGORIES
            if(context.Categories.Any()) return;
            var categories = new List<Category>
            {
                new Category{Name = "Tops & T-Shirts"},
                new Category{Name = "Shorts"},
                new Category{Name = "Shoes"},
                new Category{Name = "Jackets"},
                new Category{Name = "Accessories"},
            };

            foreach (var category in categories)
            {
                context.Categories.Add(category);
            }

            // SIZE
            if(context.Sizes.Any()) return;
            var sizes = new List<Size>
            {
                new Size{Size_value = "S"},
                new Size{Size_value = "M"},
                new Size{Size_value = "L"},
                new Size{Size_value = "XL"},
            };

            foreach (var size in sizes)
            {
                context.Sizes.Add(size);
            }

            // COLOR
            if(context.Colours.Any()) return;
            var colors = new List<Colour>
            {
                new Colour{Colour_value = "white", Colour_code = "#ffffff"},
                new Colour{Colour_value = "red", Colour_code = "#dc2626"},
                new Colour{Colour_value = "teal", Colour_code = "#0d9488"},
                new Colour{Colour_value = "orange", Colour_code = "#f97316"},
                new Colour{Colour_value = "sky", Colour_code = "#0284c7"},
                // new Colour{Colour_value = "black", Colour_code = "#161616"},
                // new Colour{Colour_value = "gray", Colour_code = "#4b5563"},
                // new Colour{Colour_value = "yellow", Colour_code = "#ca8a04"},
                // new Colour{Colour_value = "green", Colour_code = "#16a34a"},
                // new Colour{Colour_value = "blue", Colour_code = "#2563eb"},
            };

            foreach (var color in colors)
            {
                context.Colours.Add(color);
            }
            // USER
            if(!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] {"Member", "Admin"});
            }

            // SHIPPER
            if(!context.Shippers.Any())
            {
                var shipper = new Shipper
                {
                    Name = "Nguyen Van A",
                    Password = "Admin@123",
                    Email = "vanA@gmail.com",
                    Phone = "0916087649",
                    DayBirth = DateTime.Now,
                    LicensePlates = "65A-L999999",
                    Sex = "Male",
                    Address = "A13-13 street 9",
                    Status = "Online",
                    Role = "Shipper"
                };

                context.Shippers.Add(shipper);
            }

            // PRODUCT
            if(context.Products.Any()) return;
            var products = new List<Product>{
                new Product
                {
                    Name = "Nike Sportswear Air",
                    Description =
                        "The Nike Air collection celebrates the legendary sneakers that helped shape the Swoosh brand over the decades. This French terry crew is made from heavy fleece fabric for soft warmth and comfort that lasts. A Nike Air rubber graphic printed on the chest and cover-stitch piping down the seams elevate the finish.",
                    Price = 20000,
                    PictureUrl = "/images/products/1.jpg",
                    Brand = "Nike",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Dri-FIT A.I.R.",
                    Description = "Add some abstract craft to your route in this Dri-FIT Tank. Our Artist-in-Residence Hola Lou brings her minimal approach with bold shapes printed over smooth fabric.",
                    Price = 15000,
                    PictureUrl = "/images/products/2.jpg",
                    Brand = "Nike",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Air Max",
                    Description =
                        "Stay covered against the elements in this woven jacket. Durable, water-repellent panels in the hood, chest and sleeves help put a barrier between you and bad weather so you stay comfortable when wind and rain are in the forecast. Zip pockets keep essential items secure and close at hand while Air Max branding adds street-ready style.",
                    Price = 18000,
                    PictureUrl = "/images/products/3.jpg",
                    Brand = "Adidas",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Yoga Dri-FIT",
                    Description =
                        "The Nike Yoga Top is made from lightweight knit fabric for a soft, smooth feel against your skin. Sweat-wicking technology will help keep you dry so you can stay comfortable and focused on your practice. And it's mindfully made from at least 50% recycled polyester fibres.",
                    Price = 30000,
                    PictureUrl = "/images/products/4.jpg",
                    Brand = "Adidas",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "UA Windrunner",
                    Description =
                        "The UA Windrunner Jacket gets updated with water-repellent materials and a packable design.Vent details on the back and on the chevron help keep you cool when your run heats up.This product is made from at least 50% recycled polyester fibres.",
                    Price = 25000,
                    PictureUrl = "/images/products/5.jpg",
                    Brand = "Under Armour",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "UA Pro Dri-FIT",
                    Description =
                        "You give your all to the workout, pushing yourself to the limit. Let the Nike Pro Top keep you cool and comfortable with its soft, breathable fabric. It's got a relaxed fit so you can wear it on its own or over a base layer.",
                    Price = 12000,
                    PictureUrl = "/images/products/6.jpg",
                    Brand = "Under Armour",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Dri-FIT ADV A.P.S.",
                    Description =
                        "Your busy day means you need to be ready to exercise at any time. We made the Advanced Performance System (A.P.S.) Top to answer the challenge with a smooth, stretchy and breathable feel that can be worn for your workout and beyond. Wear it on its own or as a layering piece to help you reach peak performance.",
                    Price = 12000,
                    PictureUrl = "/images/products/7.jpg",
                    Brand = "Nike",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "The UA Polo Rafa",
                    Description =
                        "This isn't your average polo—it's The Nike Polo. Every detail, from its innovative, sweat-wicking fabric to the hints of orange that nod to Nike's original shoe box, has been thoughtfully crafted to meet the needs of the everyday you. The result is a street-ready style that looks at home on the course, the court and everywhere else. Rafa's bull logo is featured on the chest. This product is made from 100% sustainable materials, using a blend of both recycled polyester and organic cotton fibres. The blend is at least 10% recycled fibres or at least 10% organic cotton fibres.",
                    Price = 12000,
                    PictureUrl = "/images/products/8.jpg",
                    Brand = "Under Armour",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "UA Dri-FIT Miler",
                    Description =
                        "Take on your daily route with the Nike Dri-FIT Miler Top.It offers lightweight performance and mobility for the entry-level runner.This product is made from at least 50% recycled polyester fibres.",
                    Price = 12000,
                    PictureUrl = "/images/products/9.jpg",
                    Brand = "Under Armour",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Fila Dri-FIT Challenger",
                    Description =
                        "The Fila Dri-FIT Rafa Challenger Top is built to perform. We used a knit fabric that's stretchy and very breathable to help you stay cool when your match heats up. This top also offers a sleeve design that feels smooth and natural through your swing, so you can focus on playing at your best, match after match. This product is made from 100% recycled polyester fibres.",
                    Price = 12000,
                    PictureUrl = "/images/products/10.jpg",
                    Brand = "Fila",
                    Type = "Tops & T-Shirts",
                    CurrentCateId = 1,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Stride D.Y.E.",
                    Description =
                        "Built for unrestricted movement, these lightweight Stride Shorts help keep your momentum going with an all-over neuron print tracing the pathways in your brain that release endorphins as the miles tick by. It's a celebration of you and the joy of the run.",
                    Price = 1000,
                    PictureUrl = "/images/products/11.jpg",
                    Brand = "Adidas",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Dri-FIT",
                    Description =
                        "The Adidas Dri-FIT Shorts are made to keep you moving during high-intensity training. Woven fabric stretches with every move, while vents at the hems are ideal for deep bends like Lunges and Squats. This product is made from 100% recycled polyester fibres.",
                    Price = 8000,
                    PictureUrl = "/images/products/12.jpg",
                    Brand = "Adidas",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Sportswear",
                    Description =
                        "Equal parts style and laid-back comfort, the Nike Sportswear Shorts are an easy pick for everyday wear. Sweat-wicking technology helps you stay dry and comfortable while an added cargo pocket gives you a little extra space to secure your stuff.",
                    Price = 1500,
                    PictureUrl = "/images/products/13.jpg",
                    Brand = "Puma",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Dri-FIT",
                    Description =
                        "The Nike Dri-FIT Shorts are made from 100% sustainable materials, using a blend of both recycled polyester and organic cotton fibres. The blend is at least 10% recycled fibres or at least 10% organic cotton fibres. Soft French terry fabric with sweat-wicking power helps you stay dry and comfortable from your first stretch through to your last set.",
                    Price = 1500,
                    PictureUrl = "/images/products/14.jpg",
                    Brand = "Nike",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Puma Dri-FIT ADV A.P.S.",
                    Description =
                        "Your workouts are an important part of your routine. That's why we made the Axis Performance System (A.P.S.) Shorts to be worn at any time, so you're ready for that high-intensity training on a moment's notice. They're stretchy and breathable so you can get through your reps with ease. Need to go for a quick swim? We added holes to the pockets to help water drain out if you're in the mood for some laps in the pool.",
                    Price = 1500,
                    PictureUrl = "/images/products/15.jpg",
                    Brand = "Puma",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Giannis Nike Dri-FIT",
                    Description =
                        "Suit up in sweat-wicking mesh shorts with prints inspired by the 9th wonder of the world—Giannis. Channel his championship mentality with a smooth, easy feel that lets you move up the court and beyond with ease.",
                    Price = 1500,
                    PictureUrl = "/images/products/16.jpg",
                    Brand = "Puma",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Reebok",
                    Description =
                        "When your team starts to flow with every pass and shot, it can feel like a flash of lightning. We celebrate that feeling in the soft, reversible feel of our Premium Shorts. Lightning on one side captures that electric energy on the court.",
                    Price = 1500,
                    PictureUrl = "/images/products/17.jpg",
                    Brand = "Reebok",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Paris Saint-Germain",
                    Description =
                        "Get comfortable without losing your cool in these all-day versatile Jordan x PSG shorts. They're made from breathable mesh with zip pockets for the essentials. Print and label details highlight our ongoing collaboration with your favourite football club.",
                    Price = 1500,
                    PictureUrl = "/images/products/18.jpg",
                    Brand = "Reebok",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Flex Vent Max",
                    Description =
                        "Made from lightweight, stretchy fabric, the Adidas Pro Flex Shorts move with your body through your most intense workouts. An elastic, fold-over waistband lets you easily adjust your fit and the sweat-wicking technology helps you stay dry, so you can zero in on the challenges ahead. This product is made from at least 75% recycled polyester fibres.",
                    Price = 1500,
                    PictureUrl = "/images/products/19.jpg",
                    Brand = "Adidas",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Addidas Dri-FIT",
                    Description =
                        "The Addidas Dri-FIT Shorts are made to keep you moving during high-intensity training. Woven fabric stretches with every move, while vents at the hems are ideal for deep bends like Lunges and Squats. This product is made from 100% recycled polyester fibres.",
                    Price = 1500,
                    PictureUrl = "/images/products/20.jpg",
                    Brand = "Adidas",
                    Type = "Shorts",
                    CurrentCateId = 2,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Fila Air Force 1 '07",
                    Description =
                        "The radiance lives on in the Nike Air Force 1 '07, the b-ball OG that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
                    Price = 1800,
                    PictureUrl = "/images/products/31.jpg",
                    Brand = "Fila",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Giannis Immortality 2",
                    Description =
                        "Morph into all-timer with the Giannis Immortality 2. A plush foam package combined with a more focused fit in the midfoot in a super-lightweight design means you can maintain a high level of intensity and focus when victory hangs in the balance—just like Giannis at the critical moment.",
                    Price = 1500,
                    PictureUrl = "/images/products/32.jpg",
                    Brand = "Fila",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Puma Mercurial Superfly 9s",
                    Description =
                        "Instantly tilt the pitch in the bold design of the light and low-to-the-ground Superfly 9 Club TF. Fast is in the Air.",
                    Price = 1600,
                    PictureUrl = "/images/products/33.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Jordan Series ES",
                    Description =
                        "Inspired by Mike's backyard battles with his older brother Larry, the Jordan Series references their legendary sibling rivalry throughout the design. The rubber sole offers more than just impressive traction—it also tells the story of how MJ came to be #23. Look for the hidden reminder to Swing for the Fence, a direct quote from Larry to his little bro.",
                    Price = 1400,
                    PictureUrl = "/images/products/34.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas React Pegasus",
                    Description =
                        "The Adidas React Pegasus Trail 4 GORE-TEX is your running companion for those days when the weather turns. Its waterproof GORE-TEX layer helps keep your feet dry, and less rubber in the outsole creates a smooth transition from road to trail without breaking stride.",
                    Price = 1400,
                    PictureUrl = "/images/products/35.jpg",
                    Brand = "Adidas",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "UA Zoom Mercurial",
                    Description =
                        "The pitch is yours when you lace up in the Vapor 15 Pro TF. It's loaded with a Zoom Air unit, so you can dominate in the waning minutes of a match—when it matters most. Fast is in the Air.",
                    Price = 1400,
                    PictureUrl = "/images/products/36.jpg",
                    Brand = "Under Armour",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Luka 1",
                    Description =
                        "Designed for No. 77 and made for every athlete craving speed and efficiency, Luka's debut delivers the goods. The first shoe with full-length Formula 23 foam, it has an ultra-supportive fit crafted with the step-back in mind. Meanwhile, strong and lightweight Flight Wire cables keep you feeling contained, whether you're playing indoors or out. This is the assist you've been waiting for—get out there and make your shot.",
                    Price = 1400,
                    PictureUrl = "/images/products/37.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Air Jordan 1 Mid",
                    Description =
                        "Inspired by the original AJ1, the Air Jordan 1 Mid offers fans a chance to follow in MJ's footsteps. Fresh colour trims the clean, classic materials, imbuing modernity into a classic design.",
                    Price = 1400,
                    PictureUrl = "/images/products/38.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Jordan Delta 3 SP",
                    Description =
                        "Combining high-end craft with high-tech features, these kicks are the embodiment of cool. Airy Ripstop and soft suede pair with a seamless interior for classic low-top looks and premium Jordan Brand comfort.",
                    Price = 1400,
                    PictureUrl = "/images/products/39.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Air Jordan XXXVI",
                    Description =
                        "Next up in the iconic Air Jordan franchise: a wearable expression of Luka's on-court energy. With a minimal yet durable design, this is one of the lightest Js to date. Equipped with a full-length Zoom Air Strobel unit stacked over a Zoom Air unit in the forefoot, you'll get energy return and elite responsiveness when you need it. Step on the court with the confidence that whatever you do—it's light work.",
                    Price = 1400,
                    PictureUrl = "/images/products/40.jpg",
                    Brand = "Puma",
                    Type = "Shoes",
                    CurrentCateId = 3,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "ReebokCourt Advantage",
                    Description =
                        "Gear up for your pre-game routine in our Advantage Jacket. Designed for dynamic movement, it lets you move side to side and power through your swing in smooth, stretchy fabric. Playing in the rain? We made this one water-repellent so wet conditions can't dampen your serve.",
                    Price = 25000,
                    PictureUrl = "/images/products/41.jpg",
                    Brand = "Reebok",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas SB",
                    Description =
                        "Ready to bomb some hills? This lightweight, skate-ready take on the classic zip-up bomber design gives you a breezy outer layer to protect you from the chill as your momentum builds. Fingers crossed for no speed wobbles.",
                    Price = 18999,
                    PictureUrl = "/images/products/42.jpg",
                    Brand = "Adidas",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Adidas Sportswear Repeat",
                    Description =
                        "Zip up and get out of the door prepared, no matter the weather. Falling somewhere between a puffer and a windbreaker, this jacket features a durable, water-repellent shell and a low-profile build for warmth and comfort you can rely on.",
                    Price = 19999,
                    PictureUrl = "/images/products/43.jpg",
                    Brand = "Adidas",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Therma-FIT Repel",
                    Description = "Perfect for cooler temperatures, the Nike Therma-FIT Repel Gilet helps keep you running. Insulating technology is combined with water-repellent fabric so you stay dry and comfortable. It even has stitching nodding to the Windrunner's iconic chevron. This product is made from at least 75% organic cotton fibres.",
                    Price = 15000,
                    PictureUrl = "/images/products/44.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Nike Therma Repel",
                    Description =
                        "Perfect for cooler temperatures, the Nike Therma-FIT Repel Gilet helps keep you running. Insulating technology is combined with water-repellent fabric so you stay dry and comfortable. It even has stitching nodding to the Windrunner's iconic chevron. This product is made from at least 75% organic cotton fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/45.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Therma-FIT Legacy",
                    Description =
                        "Filling the gap between a puffer and a windbreaker, the Nike Sportswear Therma-FIT Jacket offers just the right amount of warmth and loft for everyday layering. The water-repellent shell fabric is paired with synthetic insulation and a fleece lining to keep you warm and dry in cold, wet weather. Ripstop panels reinforce high-wear areas to provide long-lasting durability and style.",
                    Price = 18000,
                    PictureUrl = "/images/products/46.jpg",
                    Brand = "Under Armour",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Jordan 23 Engineered",
                    Description =
                        "You've reached the intersection of utility, style and sport. This gilet is warm, water-repellent and made from at least 75% sustainable materials. Fasten it with a streamlined combo of hidden snaps and a full-length zip.",
                    Price = 18000,
                    PictureUrl = "/images/products/47.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Jordan Essentials",
                    Description =
                        "This Jordan Essentials jacket has you covered when you're out and about. Built from lightweight fabric with a water-repellent coating, this full-zip windbreaker goes the distance to help you get outside in the elements. Michael Jordan's signature is embroidered on the upper back for a subtle nod to His Airness. This product is made from at least 75% recycled polyester fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/48.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Tottenham Hotspur",
                    Description =
                        "The Tottenham Hotspur Jacket combines utilitarian details with proud team print. Durable Ripstop fabric with a water-repellent finish helps keep you dry when the weather bares its teeth. It also has zip pockets to help keep your daily necessities close and secure when you're showing your love for your squad in cool, wet weather.",
                    Price = 18000,
                    PictureUrl = "/images/products/49.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Chelsea F.C.",
                    Description =
                        "With a design inspired by classic athletics jackets, the knit Chelsea F.C. Jacket offers lightweight warmth in an understated look. A loose fit layers easily over your other clothes, while zip pockets help keep everyday necessities secure. A team crest on the chest ensures people know where your football loyalty lies.",
                    Price = 18000,
                    PictureUrl = "/images/products/50.jpg",
                    Brand = "Nike",
                    Type = "Jackets",
                    CurrentCateId = 4,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Puma Multiplier",
                    Description =
                        "Run tall in the Nike Multiplier Crew Socks (2 Pairs). Sweat-wicking fabric helps you stay dry and cool, while mesh along the midfoot gives you breathability. A linear logo stands out as you run.",
                    Price = 18000,
                    PictureUrl = "/images/products/51.jpg",
                    Brand = "Puma",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Puma Heritage",
                    Description =
                        "The Puma Heritage Crossbody Bag gives you a durable design with multiple compartments to help keep you organised when you're out and about. An adjustable strap lets you customise your carrying experience.",
                    Price = 18000,
                    PictureUrl = "/images/products/52.jpg",
                    Brand = "Puma",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Addidas Utility Power",
                    Description =
                        "The Addidas Utility Power Duffel is the perfect partner for your pre- or post-day workout. It keeps your gear secure and ready to go with its durable design, utilising multiple pockets to help keep your things organised, along with padded straps for comfortable carrying.",
                    Price = 18000,
                    PictureUrl = "/images/products/53.jpg",
                    Brand = "Adidas",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Heritage Waistpack",
                    Description =
                        "Look to the Reebok Heritage Waistpack to store the small essentials that don't quite fit in your pockets. An internal zipped stash pocket helps keep things organised and easy to grab. This product is made from at least 65% recycled polyester.",
                    Price = 18000,
                    PictureUrl = "/images/products/54.jpg",
                    Brand = "Reebok",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Reebok Essentials",
                    Description =
                        "With its large laptop sleeve, phone holder and roomy main compartment, this backpack is made to take you places. Tonal trim highlights the construction, while its water-repellent details help secure your stuff even when the weather turns. This product is made from at least 50% recycled polyester fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/55.jpg",
                    Brand = "Reebok",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Heritage Backpack",
                    Description =
                        "Take your gear to go with the UA Heritage Backpack. Its spacious main compartment features a sleeve that holds up to a 15 laptop, so your computer is never out of reach. 2 zipped accessories pockets help keep your gear organised and easy to grab. This product is made from at least 65% recycled polyester fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/56.jpg",
                    Brand = "Under Armour",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Reebok Tote Bag",
                    Description =
                        "An elevated take on a classic, the Reebok Sportswear Tote keeps your everyday essentials organised. The spacious main compartment features interior pockets and a laptop sleeve for secure organisation, along with an exterior pocket for quick access to your keys, cards and phone. This product is made from at least 65% recycled polyester fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/57.jpg",
                    Brand = "Reebok",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Sportswear Heritage 86",
                    Description =
                        "The Nike Sportswear Heritage86 Cap is a classic 6-panel design with sweat-wicking support.It has a metal Swoosh ingot at the front and an adjustable closure for the perfect fit.",
                    Price = 18000,
                    PictureUrl = "/images/products/58.jpg",
                    Brand = "Nike",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Jordan Pro Jumpman",
                    Description =
                        "Show them your hops in the Jordan Pro Jumpman Snapback Hat.It has a flat bill and high structured crown made from tightly woven twill.The iconic logo is thickly embroidered on the front, a bold projection of the Brand's heritage.This product is made from at least 50% recycled polyester fibres.",
                    Price = 18000,
                    PictureUrl = "/images/products/59.jpg",
                    Brand = "Fila",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Fila Vapor Grip3",
                    Description =
                        "The Fila Vapor Grip3 Gloves are designed to wear in both wet and dry conditions. An adjustable strap and foam cushioning give you a tighter grip, while the wristband sits lower to let your hand move naturally.",
                    Price = 18000,
                    PictureUrl = "/images/products/60.jpg",
                    Brand = "Fila",
                    Type = "Accessories",
                    CurrentCateId = 5,
                    QuantityInStock = 100
                },
            };

             foreach (var product in products)
            {
                context.Products.Add(product);
            }

            // // PRODUCT-COLOR
            // if(context.ProductColours.Any()) return;
            // var productColors = new List<ProductColour>
            // {
            //     new ProductColour{ColourId = 7, ProductId = 2},
            //     new ProductColour{ColourId = 8, ProductId = 2},
            //     new ProductColour{ColourId = 9, ProductId = 2},
            //     new ProductColour{ColourId = 10, ProductId = 2},
            //     // new ProductColour{ColourId = 7, ProductId = 2},
            //     // new ProductColour{ColourId = 8, ProductId = 2},
            //     // new ProductColour{ColourId = 9, ProductId = 2},
            //     // new ProductColour{ColourId = 10, ProductId = 2},
            //     // new ProductColour{ColourId = 7, ProductId = 3},
            //     // new ProductColour{ColourId = 8, ProductId = 3},
            //     // new ProductColour{ColourId = 9, ProductId = 3},
            //     // new ProductColour{ColourId = 10, ProductId = 3},
            //     // new ProductColour{ColourId = 7, ProductId = 4},
            //     // new ProductColour{ColourId = 8, ProductId = 4},
            //     // new ProductColour{ColourId = 9, ProductId = 4},
            //     // new ProductColour{ColourId = 10, ProductId = 4},
            //     // new ProductColour{ColourId = 7, ProductId = 5},
            //     // new ProductColour{ColourId = 8, ProductId = 5},
            //     // new ProductColour{ColourId = 9, ProductId = 5},
            //     // new ProductColour{ColourId = 10, ProductId = 5},
            //     // new ProductColour{ColourId = 7, ProductId = 6},
            //     // new ProductColour{ColourId = 8, ProductId = 6},
            //     // new ProductColour{ColourId = 9, ProductId = 6},
            //     // new ProductColour{ColourId = 10, ProductId = 6},
            //     // new ProductColour{ColourId = 7, ProductId = 7},
            //     // new ProductColour{ColourId = 8, ProductId = 7},
            //     // new ProductColour{ColourId = 9, ProductId = 7},
            //     // new ProductColour{ColourId = 10, ProductId = 7},
            //     // new ProductColour{ColourId = 7, ProductId = 8},
            //     // new ProductColour{ColourId = 8, ProductId = 8},
            //     // new ProductColour{ColourId = 9, ProductId = 8},
            //     // new ProductColour{ColourId = 10, ProductId = 8},
            //     // new ProductColour{ColourId = 7, ProductId = 9},
            //     // new ProductColour{ColourId = 8, ProductId = 9},
            //     // new ProductColour{ColourId = 9, ProductId = 9},
            //     // new ProductColour{ColourId = 10, ProductId = 9},
            //     // new ProductColour{ColourId = 7, ProductId = 10},
            //     // new ProductColour{ColourId = 8, ProductId = 10},
            //     // new ProductColour{ColourId = 9, ProductId = 10},
            //     // new ProductColour{ColourId = 10, ProductId = 10},
            //     // new ProductColour{ColourId = 7, ProductId = 11},
            //     // new ProductColour{ColourId = 8, ProductId = 11},
            //     // new ProductColour{ColourId = 9, ProductId = 11},
            //     // new ProductColour{ColourId = 10, ProductId = 11},
            //     // new ProductColour{ColourId = 7, ProductId = 12},
            //     // new ProductColour{ColourId = 8, ProductId = 12},
            //     // new ProductColour{ColourId = 9, ProductId = 12},
            //     // new ProductColour{ColourId = 10, ProductId = 12},
            //     // new ProductColour{ColourId = 7, ProductId = 13},
            //     // new ProductColour{ColourId = 8, ProductId = 13},
            //     // new ProductColour{ColourId = 9, ProductId = 13},
            //     // new ProductColour{ColourId = 10, ProductId = 13},
            //     // new ProductColour{ColourId = 7, ProductId = 14},
            //     // new ProductColour{ColourId = 8, ProductId = 14},
            //     // new ProductColour{ColourId = 9, ProductId = 14},
            //     // new ProductColour{ColourId = 10, ProductId = 14},
            //     // new ProductColour{ColourId = 7, ProductId = 15},
            //     // new ProductColour{ColourId = 8, ProductId = 15},
            //     // new ProductColour{ColourId = 9, ProductId = 15},
            //     // new ProductColour{ColourId = 10, ProductId = 15},
            //     // new ProductColour{ColourId = 7, ProductId = 16},
            //     // new ProductColour{ColourId = 8, ProductId = 16},
            //     // new ProductColour{ColourId = 9, ProductId = 16},
            //     // new ProductColour{ColourId = 10, ProductId = 16},
            //     // new ProductColour{ColourId = 7, ProductId = 17},
            //     // new ProductColour{ColourId = 8, ProductId = 17},
            //     // new ProductColour{ColourId = 9, ProductId = 17},
            //     // new ProductColour{ColourId = 10, ProductId = 17},
            //     // new ProductColour{ColourId = 7, ProductId = 18},
            //     // new ProductColour{ColourId = 8, ProductId = 18},
            //     // new ProductColour{ColourId = 9, ProductId = 18},
            //     // new ProductColour{ColourId = 10, ProductId = 18},
            //     // new ProductColour{ColourId = 7, ProductId = 19},
            //     // new ProductColour{ColourId = 8, ProductId = 19},
            //     // new ProductColour{ColourId = 9, ProductId = 19},
            //     // new ProductColour{ColourId = 10, ProductId = 19},
            //     // new ProductColour{ColourId = 7, ProductId = 20},
            //     // new ProductColour{ColourId = 8, ProductId = 20},
            //     // new ProductColour{ColourId = 9, ProductId = 20},
            //     // new ProductColour{ColourId = 10, ProductId = 20},
            //     // new ProductColour{ColourId = 7, ProductId = 21},
            //     // new ProductColour{ColourId = 8, ProductId = 21},
            //     // new ProductColour{ColourId = 9, ProductId = 21},
            //     // new ProductColour{ColourId = 10, ProductId = 21},
            //     // new ProductColour{ColourId = 7, ProductId = 22},
            //     // new ProductColour{ColourId = 8, ProductId = 22},
            //     // new ProductColour{ColourId = 9, ProductId = 22},
            //     // new ProductColour{ColourId = 10, ProductId = 22},
            //     // new ProductColour{ColourId = 8, ProductId = 23},
            //     // new ProductColour{ColourId = 9, ProductId = 23},
            //     // new ProductColour{ColourId = 10, ProductId = 23},
            //     // new ProductColour{ColourId = 7, ProductId = 24},
            //     // new ProductColour{ColourId = 8, ProductId = 24},
            //     // new ProductColour{ColourId = 9, ProductId = 24},
            //     // new ProductColour{ColourId = 10, ProductId = 24},
            //     // new ProductColour{ColourId = 7, ProductId = 25},
            //     // new ProductColour{ColourId = 8, ProductId = 25},
            //     // new ProductColour{ColourId = 9, ProductId = 25},
            //     // new ProductColour{ColourId = 10, ProductId = 25},
            //     // new ProductColour{ColourId = 7, ProductId = 26},
            //     // new ProductColour{ColourId = 8, ProductId = 26},
            //     // new ProductColour{ColourId = 9, ProductId = 26},
            //     // new ProductColour{ColourId = 10, ProductId = 26},
            //     // new ProductColour{ColourId = 7, ProductId = 27},
            //     // new ProductColour{ColourId = 8, ProductId = 27},
            //     // new ProductColour{ColourId = 9, ProductId = 27},
            //     // new ProductColour{ColourId = 10, ProductId = 27},
            //     // new ProductColour{ColourId = 7, ProductId = 28},
            //     // new ProductColour{ColourId = 8, ProductId = 28},
            //     // new ProductColour{ColourId = 9, ProductId = 28},
            //     // new ProductColour{ColourId = 10, ProductId = 28},
            //     // new ProductColour{ColourId = 7, ProductId = 29},
            //     // new ProductColour{ColourId = 8, ProductId = 29},
            //     // new ProductColour{ColourId = 9, ProductId = 29},
            //     // new ProductColour{ColourId = 10, ProductId = 29},
            //     // new ProductColour{ColourId = 7, ProductId = 30},
            //     // new ProductColour{ColourId = 8, ProductId = 30},
            //     // new ProductColour{ColourId = 9, ProductId = 30},
            //     // new ProductColour{ColourId = 10, ProductId = 30},
            //     // new ProductColour{ColourId = 7, ProductId = 31},
            //     // new ProductColour{ColourId = 8, ProductId = 31},
            //     // new ProductColour{ColourId = 9, ProductId = 31},
            //     // new ProductColour{ColourId = 10, ProductId = 31},
            //     // new ProductColour{ColourId = 7, ProductId = 32},
            //     // new ProductColour{ColourId = 8, ProductId = 32},
            //     // new ProductColour{ColourId = 9, ProductId = 32},
            //     // new ProductColour{ColourId = 10, ProductId = 32},
            //     // new ProductColour{ColourId = 7, ProductId = 33},
            //     // new ProductColour{ColourId = 8, ProductId = 33},
            //     // new ProductColour{ColourId = 9, ProductId = 33},
            //     // new ProductColour{ColourId = 10, ProductId = 33},
            //     // new ProductColour{ColourId = 7, ProductId = 34},
            //     // new ProductColour{ColourId = 8, ProductId = 34},
            //     // new ProductColour{ColourId = 9, ProductId = 34},
            //     // new ProductColour{ColourId = 10, ProductId = 34},
            //     // new ProductColour{ColourId = 7, ProductId = 35},
            //     // new ProductColour{ColourId = 8, ProductId = 35},
            //     // new ProductColour{ColourId = 9, ProductId = 35},
            //     // new ProductColour{ColourId = 10, ProductId = 35},
            //     // new ProductColour{ColourId = 8, ProductId = 36},
            //     // new ProductColour{ColourId = 9, ProductId = 36},
            //     // new ProductColour{ColourId = 10, ProductId = 36},
            //     // new ProductColour{ColourId = 7, ProductId = 37},
            //     // new ProductColour{ColourId = 8, ProductId = 37},
            //     // new ProductColour{ColourId = 9, ProductId = 37},
            //     // new ProductColour{ColourId = 10, ProductId = 37},
            //     // new ProductColour{ColourId = 7, ProductId = 38},
            //     // new ProductColour{ColourId = 8, ProductId = 38},
            //     // new ProductColour{ColourId = 9, ProductId = 38},
            //     // new ProductColour{ColourId = 10, ProductId = 38},
            //     // new ProductColour{ColourId = 7, ProductId = 39},
            //     // new ProductColour{ColourId = 8, ProductId = 39},
            //     // new ProductColour{ColourId = 9, ProductId = 39},
            //     // new ProductColour{ColourId = 10, ProductId = 39},
            //     // new ProductColour{ColourId = 7, ProductId = 40},
            //     // new ProductColour{ColourId = 8, ProductId = 40},
            //     // new ProductColour{ColourId = 9, ProductId = 40},
            //     // new ProductColour{ColourId = 10, ProductId = 40},
            //     // new ProductColour{ColourId = 7, ProductId = 41},
            //     // new ProductColour{ColourId = 8, ProductId = 41},
            //     // new ProductColour{ColourId = 9, ProductId = 41},
            //     // new ProductColour{ColourId = 10, ProductId = 41},
            //     // new ProductColour{ColourId = 7, ProductId = 42},
            //     // new ProductColour{ColourId = 8, ProductId = 42},
            //     // new ProductColour{ColourId = 9, ProductId = 42},
            //     // new ProductColour{ColourId = 10, ProductId = 42},
            //     // new ProductColour{ColourId = 7, ProductId = 43},
            //     // new ProductColour{ColourId = 8, ProductId = 43},
            //     // new ProductColour{ColourId = 9, ProductId = 43},
            //     // new ProductColour{ColourId = 10, ProductId = 43},
            //     // new ProductColour{ColourId = 7, ProductId = 44},
            //     // new ProductColour{ColourId = 8, ProductId = 44},
            //     // new ProductColour{ColourId = 9, ProductId = 44},
            //     // new ProductColour{ColourId = 10, ProductId = 44},
            //     // new ProductColour{ColourId = 7, ProductId = 45},
            //     // new ProductColour{ColourId = 8, ProductId = 45},
            //     // new ProductColour{ColourId = 9, ProductId = 45},
            //     // new ProductColour{ColourId = 10, ProductId = 45},
            //     // new ProductColour{ColourId = 7, ProductId = 46},
            //     // new ProductColour{ColourId = 8, ProductId = 46},
            //     // new ProductColour{ColourId = 9, ProductId = 46},
            //     // new ProductColour{ColourId = 10, ProductId = 46},
            //     // new ProductColour{ColourId = 7, ProductId = 47},
            //     // new ProductColour{ColourId = 8, ProductId = 47},
            //     // new ProductColour{ColourId = 9, ProductId = 47},
            //     // new ProductColour{ColourId = 10, ProductId = 47},
            //     // new ProductColour{ColourId = 7, ProductId = 48},
            //     // new ProductColour{ColourId = 8, ProductId = 48},
            //     // new ProductColour{ColourId = 9, ProductId = 48},
            //     // new ProductColour{ColourId = 10, ProductId = 48},
            //     // new ProductColour{ColourId = 7, ProductId = 49},
            //     // new ProductColour{ColourId = 8, ProductId = 49},
            //     // new ProductColour{ColourId = 9, ProductId = 49},
            //     // new ProductColour{ColourId = 10, ProductId = 49},
            //     // new ProductColour{ColourId = 7, ProductId = 50},
            //     // new ProductColour{ColourId = 8, ProductId = 50},
            //     // new ProductColour{ColourId = 9, ProductId = 50},
            //     // new ProductColour{ColourId = 10, ProductId = 50},
            // };

            // foreach (var color in productColors)
            // {
            //     context.ProductColours.Add(color);
            // }

            // // PRODUCT-SIZE
            // if(context.ProductSizes.Any()) return;
            // var productSizes = new List<ProductSize>
            // {
            //     new ProductSize{SizeId = 5, ProductId = 1},
            //     new ProductSize{SizeId = 4, ProductId = 1},
            //     new ProductSize{SizeId = 3, ProductId = 1},
            //     new ProductSize{SizeId = 2, ProductId = 1},
            //     // new ProductSize{SizeId = 5, ProductId = 2},
            //     // new ProductSize{SizeId = 4, ProductId = 2},
            //     // new ProductSize{SizeId = 3, ProductId = 2},
            //     // new ProductSize{SizeId = 2, ProductId = 2},
            //     // new ProductSize{SizeId = 5, ProductId = 3},
            //     // new ProductSize{SizeId = 4, ProductId = 3},
            //     // new ProductSize{SizeId = 3, ProductId = 3},
            //     // new ProductSize{SizeId = 2, ProductId = 3},
            //     // new ProductSize{SizeId = 5, ProductId = 4},
            //     // new ProductSize{SizeId = 4, ProductId = 4},
            //     // new ProductSize{SizeId = 3, ProductId = 4},
            //     // new ProductSize{SizeId = 2, ProductId = 4},
            //     // new ProductSize{SizeId = 5, ProductId = 5},
            //     // new ProductSize{SizeId = 4, ProductId = 5},
            //     // new ProductSize{SizeId = 3, ProductId = 5},
            //     // new ProductSize{SizeId = 2, ProductId = 5},
            //     // new ProductSize{SizeId = 5, ProductId = 6},
            //     // new ProductSize{SizeId = 4, ProductId = 6},
            //     // new ProductSize{SizeId = 3, ProductId = 6},
            //     // new ProductSize{SizeId = 2, ProductId = 6},
            //     // new ProductSize{SizeId = 5, ProductId = 7},
            //     // new ProductSize{SizeId = 4, ProductId = 7},
            //     // new ProductSize{SizeId = 3, ProductId = 7},
            //     // new ProductSize{SizeId = 2, ProductId = 7},
            //     // new ProductSize{SizeId = 5, ProductId = 8},
            //     // new ProductSize{SizeId = 4, ProductId = 8},
            //     // new ProductSize{SizeId = 3, ProductId = 8},
            //     // new ProductSize{SizeId = 2, ProductId = 8},
            //     // new ProductSize{SizeId = 5, ProductId = 9},
            //     // new ProductSize{SizeId = 4, ProductId = 9},
            //     // new ProductSize{SizeId = 3, ProductId = 9},
            //     // new ProductSize{SizeId = 2, ProductId = 9},
            //     // new ProductSize{SizeId = 5, ProductId = 10},
            //     // new ProductSize{SizeId = 4, ProductId = 10},
            //     // new ProductSize{SizeId = 3, ProductId = 10},
            //     // new ProductSize{SizeId = 2, ProductId = 10},
            //     // new ProductSize{SizeId = 5, ProductId = 11},
            //     // new ProductSize{SizeId = 4, ProductId = 11},
            //     // new ProductSize{SizeId = 3, ProductId = 11},
            //     // new ProductSize{SizeId = 2, ProductId = 11},
            //     // new ProductSize{SizeId = 5, ProductId = 12},
            //     // new ProductSize{SizeId = 4, ProductId = 12},
            //     // new ProductSize{SizeId = 3, ProductId = 12},
            //     // new ProductSize{SizeId = 2, ProductId = 12},
            //     // new ProductSize{SizeId = 5, ProductId = 13},
            //     // new ProductSize{SizeId = 4, ProductId = 13},
            //     // new ProductSize{SizeId = 3, ProductId = 13},
            //     // new ProductSize{SizeId = 2, ProductId = 13},
            //     // new ProductSize{SizeId = 5, ProductId = 14},
            //     // new ProductSize{SizeId = 4, ProductId = 14},
            //     // new ProductSize{SizeId = 3, ProductId = 14},
            //     // new ProductSize{SizeId = 2, ProductId = 14},
            //     // new ProductSize{SizeId = 5, ProductId = 15},
            //     // new ProductSize{SizeId = 4, ProductId = 15},
            //     // new ProductSize{SizeId = 3, ProductId = 15},
            //     // new ProductSize{SizeId = 2, ProductId = 15},
            //     // new ProductSize{SizeId = 5, ProductId = 16},
            //     // new ProductSize{SizeId = 4, ProductId = 16},
            //     // new ProductSize{SizeId = 3, ProductId = 16},
            //     // new ProductSize{SizeId = 2, ProductId = 16},
            //     // new ProductSize{SizeId = 5, ProductId = 17},
            //     // new ProductSize{SizeId = 4, ProductId = 17},
            //     // new ProductSize{SizeId = 3, ProductId = 17},
            //     // new ProductSize{SizeId = 2, ProductId = 17},
            //     // new ProductSize{SizeId = 5, ProductId = 18},
            //     // new ProductSize{SizeId = 4, ProductId = 18},
            //     // new ProductSize{SizeId = 3, ProductId = 18},
            //     // new ProductSize{SizeId = 2, ProductId = 18},
            //     // new ProductSize{SizeId = 5, ProductId = 19},
            //     // new ProductSize{SizeId = 4, ProductId = 19},
            //     // new ProductSize{SizeId = 3, ProductId = 19},
            //     // new ProductSize{SizeId = 2, ProductId = 19},
            //     // new ProductSize{SizeId = 5, ProductId = 20},
            //     // new ProductSize{SizeId = 4, ProductId = 20},
            //     // new ProductSize{SizeId = 3, ProductId = 20},
            //     // new ProductSize{SizeId = 2, ProductId = 20},
            //     // new ProductSize{SizeId = 5, ProductId = 21},
            //     // new ProductSize{SizeId = 4, ProductId = 21},
            //     // new ProductSize{SizeId = 3, ProductId = 21},
            //     // new ProductSize{SizeId = 2, ProductId = 21},
            //     // new ProductSize{SizeId = 5, ProductId = 22},
            //     // new ProductSize{SizeId = 4, ProductId = 22},
            //     // new ProductSize{SizeId = 3, ProductId = 22},
            //     // new ProductSize{SizeId = 2, ProductId = 22},
            //     // new ProductSize{SizeId = 4, ProductId = 23},
            //     // new ProductSize{SizeId = 3, ProductId = 23},
            //     // new ProductSize{SizeId = 2, ProductId = 23},
            //     // new ProductSize{SizeId = 5, ProductId = 24},
            //     // new ProductSize{SizeId = 4, ProductId = 24},
            //     // new ProductSize{SizeId = 3, ProductId = 24},
            //     // new ProductSize{SizeId = 2, ProductId = 24},
            //     // new ProductSize{SizeId = 5, ProductId = 25},
            //     // new ProductSize{SizeId = 4, ProductId = 25},
            //     // new ProductSize{SizeId = 3, ProductId = 25},
            //     // new ProductSize{SizeId = 2, ProductId = 25},
            //     // new ProductSize{SizeId = 5, ProductId = 26},
            //     // new ProductSize{SizeId = 4, ProductId = 26},
            //     // new ProductSize{SizeId = 3, ProductId = 26},
            //     // new ProductSize{SizeId = 2, ProductId = 26},
            //     // new ProductSize{SizeId = 5, ProductId = 27},
            //     // new ProductSize{SizeId = 4, ProductId = 27},
            //     // new ProductSize{SizeId = 3, ProductId = 27},
            //     // new ProductSize{SizeId = 2, ProductId = 27},
            //     // new ProductSize{SizeId = 5, ProductId = 28},
            //     // new ProductSize{SizeId = 4, ProductId = 28},
            //     // new ProductSize{SizeId = 3, ProductId = 28},
            //     // new ProductSize{SizeId = 2, ProductId = 28},
            //     // new ProductSize{SizeId = 5, ProductId = 29},
            //     // new ProductSize{SizeId = 4, ProductId = 29},
            //     // new ProductSize{SizeId = 3, ProductId = 29},
            //     // new ProductSize{SizeId = 2, ProductId = 29},
            //     // new ProductSize{SizeId = 5, ProductId = 30},
            //     // new ProductSize{SizeId = 4, ProductId = 30},
            //     // new ProductSize{SizeId = 3, ProductId = 30},
            //     // new ProductSize{SizeId = 2, ProductId = 30},
            //     // new ProductSize{SizeId = 5, ProductId = 31},
            //     // new ProductSize{SizeId = 4, ProductId = 31},
            //     // new ProductSize{SizeId = 3, ProductId = 31},
            //     // new ProductSize{SizeId = 2, ProductId = 31},
            //     // new ProductSize{SizeId = 5, ProductId = 32},
            //     // new ProductSize{SizeId = 4, ProductId = 32},
            //     // new ProductSize{SizeId = 3, ProductId = 32},
            //     // new ProductSize{SizeId = 2, ProductId = 32},
            //     // new ProductSize{SizeId = 5, ProductId = 33},
            //     // new ProductSize{SizeId = 4, ProductId = 33},
            //     // new ProductSize{SizeId = 3, ProductId = 33},
            //     // new ProductSize{SizeId = 2, ProductId = 33},
            //     // new ProductSize{SizeId = 5, ProductId = 34},
            //     // new ProductSize{SizeId = 4, ProductId = 34},
            //     // new ProductSize{SizeId = 3, ProductId = 34},
            //     // new ProductSize{SizeId = 2, ProductId = 34},
            //     // new ProductSize{SizeId = 5, ProductId = 35},
            //     // new ProductSize{SizeId = 4, ProductId = 35},
            //     // new ProductSize{SizeId = 3, ProductId = 35},
            //     // new ProductSize{SizeId = 2, ProductId = 35},
            //     // new ProductSize{SizeId = 4, ProductId = 36},
            //     // new ProductSize{SizeId = 3, ProductId = 36},
            //     // new ProductSize{SizeId = 2, ProductId = 36},
            //     // new ProductSize{SizeId = 5, ProductId = 37},
            //     // new ProductSize{SizeId = 4, ProductId = 37},
            //     // new ProductSize{SizeId = 3, ProductId = 37},
            //     // new ProductSize{SizeId = 2, ProductId = 37},
            //     // new ProductSize{SizeId = 5, ProductId = 38},
            //     // new ProductSize{SizeId = 4, ProductId = 38},
            //     // new ProductSize{SizeId = 3, ProductId = 38},
            //     // new ProductSize{SizeId = 2, ProductId = 38},
            //     // new ProductSize{SizeId = 5, ProductId = 39},
            //     // new ProductSize{SizeId = 4, ProductId = 39},
            //     // new ProductSize{SizeId = 3, ProductId = 39},
            //     // new ProductSize{SizeId = 2, ProductId = 39},
            //     // new ProductSize{SizeId = 5, ProductId = 40},
            //     // new ProductSize{SizeId = 4, ProductId = 40},
            //     // new ProductSize{SizeId = 3, ProductId = 40},
            //     // new ProductSize{SizeId = 2, ProductId = 40},
            //     // new ProductSize{SizeId = 5, ProductId = 41},
            //     // new ProductSize{SizeId = 4, ProductId = 41},
            //     // new ProductSize{SizeId = 3, ProductId = 41},
            //     // new ProductSize{SizeId = 2, ProductId = 41},
            //     // new ProductSize{SizeId = 5, ProductId = 42},
            //     // new ProductSize{SizeId = 4, ProductId = 42},
            //     // new ProductSize{SizeId = 3, ProductId = 42},
            //     // new ProductSize{SizeId = 2, ProductId = 42},
            //     // new ProductSize{SizeId = 5, ProductId = 43},
            //     // new ProductSize{SizeId = 4, ProductId = 43},
            //     // new ProductSize{SizeId = 3, ProductId = 43},
            //     // new ProductSize{SizeId = 2, ProductId = 43},
            //     // new ProductSize{SizeId = 5, ProductId = 44},
            //     // new ProductSize{SizeId = 4, ProductId = 44},
            //     // new ProductSize{SizeId = 3, ProductId = 44},
            //     // new ProductSize{SizeId = 2, ProductId = 44},
            //     // new ProductSize{SizeId = 5, ProductId = 45},
            //     // new ProductSize{SizeId = 4, ProductId = 45},
            //     // new ProductSize{SizeId = 3, ProductId = 45},
            //     // new ProductSize{SizeId = 2, ProductId = 45},
            //     // new ProductSize{SizeId = 5, ProductId = 46},
            //     // new ProductSize{SizeId = 4, ProductId = 46},
            //     // new ProductSize{SizeId = 3, ProductId = 46},
            //     // new ProductSize{SizeId = 2, ProductId = 46},
            //     // new ProductSize{SizeId = 5, ProductId = 47},
            //     // new ProductSize{SizeId = 4, ProductId = 47},
            //     // new ProductSize{SizeId = 3, ProductId = 47},
            //     // new ProductSize{SizeId = 2, ProductId = 47},
            //     // new ProductSize{SizeId = 5, ProductId = 48},
            //     // new ProductSize{SizeId = 4, ProductId = 48},
            //     // new ProductSize{SizeId = 3, ProductId = 48},
            //     // new ProductSize{SizeId = 2, ProductId = 48},
            //     // new ProductSize{SizeId = 5, ProductId = 49},
            //     // new ProductSize{SizeId = 4, ProductId = 49},
            //     // new ProductSize{SizeId = 3, ProductId = 49},
            //     // new ProductSize{SizeId = 2, ProductId = 49},
            //     // new ProductSize{SizeId = 5, ProductId = 50},
            //     // new ProductSize{SizeId = 4, ProductId = 50},
            //     // new ProductSize{SizeId = 3, ProductId = 50},
            //     // new ProductSize{SizeId = 2, ProductId = 50},
            // };

            // foreach (var size in productSizes)
            // {
            //     context.ProductSizes.Add(size);
            // }

            context.SaveChanges();

        }
    }
}