using System.Text.Json;
using API.DTOs;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationDto paginationDto)
        {
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationDto, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}