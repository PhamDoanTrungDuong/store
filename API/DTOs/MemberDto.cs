using API.ViewModel;

namespace API.DTOs
{
    public class MemberDto : Pagination
    {
            public string SearchTerm { get; set; }
    }
}