const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7337121205:AAFOem-OYA2TngQ__nP6N1iGVv0BDk3wlMs';
const bot = new TelegramBot(TOKEN, { polling: true });

const activeStreams = new Map();

process.on('uncaughtException', function(err) {
    console.error('Непойманное исключение:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
});

bot.on('message', async (msg) => {
    if (!msg.chat.type.includes('group')) return;


    if (msg.video_chat_started) {
        const chatId = msg.chat.id;
        console.log(msg)
        
        try {
            const chat = await bot.getChat(chatId);
            let inviteLink = chat.invite_link;
            
            if (!inviteLink) {
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 1000);
                const invite = await bot.createChatInviteLink(chatId, {
                    name: `Stream_${timestamp}_${randomNum}`,
                    creates_join_request: false,
                    expire_date: 0,
                    member_limit: 0
                });
                inviteLink = invite.invite_link;
            } else {
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 1000);
                const invite = await bot.createChatInviteLink(chatId, {
                    name: `Stream_${timestamp}_${randomNum}`,
                    creates_join_request: false,
                    expire_date: 0,
                    member_limit: 0
                });
                inviteLink = invite.invite_link;
            }

            const livestreamUrl = `${inviteLink}?stream_id=${Date.now()}&videochat`;
            

            console.log('Chat ID:', chatId);
            console.log('Invite Link:', inviteLink);
            console.log('Generated URL:', livestreamUrl);
            
            activeStreams.set(chatId, { livestreamUrl });
            
            await bot.sendMessage(chatId,
                '🔴 Новый прямой эфир начался!\n' +
                'Нажмите кнопку ниже, чтобы присоединиться:', {
                reply_markup: {
                    inline_keyboard: [[{
                        text: '🎥 Вступить в эфир',
                        url: livestreamUrl
                    }]]
                }
            });
        } catch (error) {
            console.error('Ошибка при создании ссылки:', error);
            await bot.sendMessage(chatId, 
                '⚠️ Не удалось создать ссылку на эфир. Убедитесь, что бот имеет права администратора.');
        }
    }
    
    if (msg.video_chat_ended) {
        const chatId = msg.chat.id;
        activeStreams.delete(chatId);
        await bot.sendMessage(chatId, '📍 Прямой эфир завершен');
    }
});

bot.on('error', (error) => {
    console.error('Произошла ошибка:', error);
});


bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
});

bot.on('new_chat_members', async (msg) => {
    const newMembers = msg.new_chat_members;

    const botInfo = await bot.getMe();
    
    if (newMembers.some(member => member.id === botInfo.id)) {
        await bot.sendMessage(msg.chat.id, 
            '👋 Спасибо за добавление меня в группу!\n' +

            '⚙️ Пожалуйста, убедитесь, что я являюсь администратором группы для корректной работы.');
    }
});

console.log('Бот запущен!'); 