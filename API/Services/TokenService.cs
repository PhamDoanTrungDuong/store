using System;
using System.Text;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace API.Services
{
      public class TokenService
      {
            private readonly UserManager<User> _userManager;
            private readonly IConfiguration _config;
            public TokenService(UserManager<User> userManager, IConfiguration config)
            {
                  _config = config;
                  _userManager = userManager;

            }

            public async Task<string> GenerateToken(User user)
            {
                //get config key for credentials (HEADER)
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

                //get Claim to for Claims (PAYLOAD)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                };

                var roles = await _userManager.GetRolesAsync(user);
                foreach(var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                //combine into tokenOptions
                var tokenOptions = new JwtSecurityToken(
                    issuer: null,
                    audience: null,
                    claims: claims,
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: creds
                );

                //Create Token with tokenOptions
                return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            }
      }
}