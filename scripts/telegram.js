document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('telegramForm');
   const statusEl = document.getElementById('status');
   const summaryEl = document.getElementById('summary');

   // Проверка, что элементы существуют
   if (!form || !statusEl || !summaryEl) {
      console.error("Не все необходимые элементы найдены в HTML");
      return;
   }

   const nicknameInput = form.nickname;
   const rankSelect = form.rank;
   const durationSelect = form.duration;

   const summary = {
      '6': {
         '30': { price: '60.000.000', zpvchas: '485.000' },
         '60': { price: '120.000.000', zpvchas: '485.000' }
      },
      '7': {
         '30': { price: '90.000.000', zpvchas: '530.000' },
         '60': { price: '180.000.000', zpvchas: '530.000' }
      },
      '8': {
         '30': { price: '150.000.000', zpvchas: '590.000' },
         '60': { price: '300.000.000', zpvchas: '590.000' }
      },
   };

   function getDays(durationText) {
      if (durationText.includes('30')) return '30';
      if (durationText.includes('60')) return '60';
      return null;
   }

   function updateSummary() {
      const rank = rankSelect.value;
      const duration = durationSelect.value;
      const days = getDays(duration);

      let text = '';
      let price = '';

      if (rank && days && summary[rank] && summary[rank][days]) {
         price = summary[rank][days].price;
         zpvchas = summary[rank][days].zpvchas;
         text = `
            <table style="width: 100%;">
               <tr>
                  <td style="text-align: left;">💸 Стоимость:</td>
                  <td style="text-align: right;"><b>${price} $</b></td>
               </tr>
               <tr>
                  <td style="text-align: left;">💰 ЗП в час:</td>
                  <td style="text-align: right;"><b>${zpvchas} $</b></td>
               </tr>
            </table>
         `;
      }

      summaryEl.innerHTML = text;

      return price;
   }

   rankSelect.addEventListener('change', updateSummary);
   durationSelect.addEventListener('change', updateSummary);

   form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.textContent = '';

      const nickname = nicknameInput.value.trim();
      const rank = rankSelect.value;
      const duration = durationSelect.value;
      const nicknameRegex = /^[A-Za-z]+_[A-Za-z]+$/;

      if (!nicknameRegex.test(nickname)) {
         statusEl.textContent = '❌ Никнейм должен быть в формате Nick_Name';
         hideStatusAfterDelay();
         return;
      }

      const price = updateSummary(); // Получаем цену с клиентской стороны

      try {
         const response = await fetch('https://telegram.andreyselyankin.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, rank, duration, price })
         });

         const data = await response.json();

         if (data.ok) {
            statusEl.textContent = '✅ Заявка успешно отправлена!';
            form.reset();
            summaryEl.innerHTML = '';  // очищаем цену
         } else {
            statusEl.textContent = '❌ Ошибка: ' + (data.description || 'Неизвестная ошибка');
         }
      } catch (error) {
         statusEl.textContent = '⚠️ Ошибка соединения: ' + error.message;
      }

      hideStatusAfterDelay();
   });

   function hideStatusAfterDelay() {
      setTimeout(() => {
         statusEl.textContent = '';
      }, 5000);
   }
});
