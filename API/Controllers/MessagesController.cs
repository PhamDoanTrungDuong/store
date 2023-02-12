using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   public class MessagesController : BaseController
   {
        private readonly StoreContext _context;

        public MessagesController(StoreContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();

            if (username == createMessageDto.RecipientUsername)
                return BadRequest("You cannot send a message to yourself");

            var sender = _context.Users.SingleOrDefault(x => x.UserName == username);
            var recipient = _context.Users.SingleOrDefault( x => x.UserName == createMessageDto.RecipientUsername);
            var adminMessageNotify = await _context.Notifies.FindAsync(1);


            if (recipient == null)
                return BadRequest("Could not find user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = username,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            if(message.SenderUsername != "admin"){
                adminMessageNotify.MessengerNotify = true;
            }
            _context.Messages.Add(message);

            var result = await _context.SaveChangesAsync();

            if (result > 0) return Ok(new MessageDto {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderUsername = message.SenderUsername,
                SenderPhotoUrl = sender.PictureUrl,
                RecipientId = message.RecipientId,
                RecipientUsername = message.RecipientUsername,
                RecipientPhotoUrl = recipient.PictureUrl,
                Content = message.Content,
                DateRead = message.DateRead,
                MessageSent = message.MessageSent
            });

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult> GetMessagesForUser([FromQuery]
            MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = _context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

            messages = messageParams.Container switch
            {
                "Inbox" => messages.Where(u => u.Recipient.UserName == messageParams.Username 
                    && u.RecipientDeleted == false),
                "Outbox" => messages.Where(u => u.Sender.UserName == messageParams.Username
                    && u.SenderDeleted == false),
                _ => messages.Where(u => u.Recipient.UserName ==
                    messageParams.Username && u.RecipientDeleted == false && u.DateRead == null)
            };

            return Ok(await messages.ToListAsync());
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();
            var sender = _context.Users.SingleOrDefault(x => x.UserName == currentUsername);
            var recipient = _context.Users.SingleOrDefault( x => x.UserName == username);

            var messages = await _context.Messages
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted == false
                        && m.Sender.UserName == username
                        || m.Recipient.UserName == username
                        && m.Sender.UserName == currentUsername && m.SenderDeleted == false
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null 
                && m.Recipient.UserName == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }

            var arrayMessagesDto = new List<MessageDto>();
            
            foreach(var message in messages)
            {
                var messageDto = new MessageDto {
                    Id = message.Id,
                    SenderId = message.SenderId,
                    SenderUsername = message.SenderUsername,
                    SenderPhotoUrl = sender.PictureUrl,
                    RecipientId = message.RecipientId,
                    RecipientUsername = message.RecipientUsername,
                    RecipientPhotoUrl = recipient.PictureUrl,
                    Content = message.Content,
                    DateRead = message.DateRead,
                    MessageSent = message.MessageSent
                };

                arrayMessagesDto.Add(messageDto);
            }

            return Ok(arrayMessagesDto); 
        }

        [HttpGet("unread-mess/{username}")]
        public async Task<ActionResult> UnreadMess(string username) {
            var currentUsername = User.GetUsername();
            var sender = _context.Users.SingleOrDefault(x => x.UserName == currentUsername);
            var recipient = _context.Users.SingleOrDefault( x => x.UserName == username);

            List<Message> messages;
            if(currentUsername != "admin")
            {
                messages = await _context.Messages
                    .Include(u => u.Sender)
                    .Include(u => u.Recipient)
                    .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted ==    false && m.Sender.UserName == username
                    )
                    .OrderBy(m => m.MessageSent)
                    .ToListAsync();
            } else {
                messages = await _context.Messages
                    .Include(u => u.Sender)
                    .Include(u => u.Recipient)
                    .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted == false && m.DateRead == null
                    )
                    .OrderBy(m => m.MessageSent)
                    .ToListAsync();
            }

            // var unreadMessages = messages.Where(m => m.DateRead == null 
            //     && m.Recipient.UserName == currentUsername).ToList();

            var arrayUnreadMessagesDto = new List<MessageDto>();
            
            foreach(var message in messages)
            {
                var messageDto = new MessageDto {
                    Id = message.Id,
                    SenderId = message.SenderId,
                    SenderUsername = message.SenderUsername,
                    SenderPhotoUrl = sender.PictureUrl,
                    RecipientId = message.RecipientId,
                    RecipientUsername = message.RecipientUsername,
                    RecipientPhotoUrl = recipient.PictureUrl,
                    Content = message.Content,
                    DateRead = message.DateRead,
                    MessageSent = message.MessageSent
                };

                arrayUnreadMessagesDto.Add(messageDto);
            }

            return Ok(arrayUnreadMessagesDto); 
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _context.Messages
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .SingleOrDefaultAsync(x => x.Id == id);

            if (message.Sender.UserName != username && message.Recipient.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) message.SenderDeleted = true;

            if (message.Recipient.UserName == username) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _context.Messages.Remove(message);

            var result = await _context.SaveChangesAsync();

            if (result > 0) return Ok();

            return BadRequest("Problem deleting the message");
        }

   }
}