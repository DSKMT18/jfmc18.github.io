const TOKEN = '7604601855:AAHwyYk2BAIe679RJ7sJjdQoC-gOxIlMcDU'; // 🔁 Замени на свой токен
const CHAT_ID = '56690196'; // 🔁 Замени на свой chat_id
const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

// Регулярка: Nick_Name (только латиница, с заглавных букв)
const nicknameRegex = /^[A-Z][a-zA-Z]*_[A-Z][a-zA-Z]*$/;

document.getElementById('telegramForm').addEventListener('submit', function (e) {
   e.preventDefault();

   const form = e.target;
   const nickname = form.nickname.value.trim();
   const rank = form.rank.value;
   const duration = form.duration.value;

   if (!nicknameRegex.test(nickname)) {
      alert("Никнейм должен быть в формате Nick_Name (только латинские буквы, первая и вторая часть с заглавной буквы).");
      return;
   }

   const message = `
📩 Новый запрос:
*Никнейм: * ${nickname}
*Ранг: * ${rank}
*Срок: * ${duration}
  `;

   fetch(URL_API, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         chat_id: CHAT_ID,
         text: message,
         parse_mode: 'Markdown'
      })
   })
      .then(() => {
         document.getElementById('successMessage').style.display = 'block';
         form.reset();

         setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
         }, 5000);
      })
      .catch(() => alert('Ошибка при отправке'));
});
