namespace API.ViewModel
{
      public class ProductVm : Pagination
      {
            public string OrderBy { get; set; }

            public string SearchTerm { get; set; }

            public string Types { get; set; }

            public string Brands { get; set; }

            public string minPrice {get; set;}
            public string maxPrice {get; set;}

      }
}