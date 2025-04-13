document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('telegramForm');
   const statusEl = document.getElementById('status');
   const priceEl = document.getElementById('price');  // оставляем для других целей (если нужно)
   const summaryEl = document.getElementById('summary');

   // Проверка, что элементы существуют
   if (!form || !statusEl || !priceEl || !summaryEl) {
      console.error("Не все необходимые элементы найдены в HTML");
      return;
   }

   const nicknameInput = form.nickname;
   const rankSelect = form.rank;
   const durationSelect = form.duration;

   const prices = {
      '6': { '30': '60.000.000', '60': '120.000.000' },
      '7': { '30': '90.000.000', '60': '180.000.000' },
      '8': { '30': '150.000.000', '60': '300.000.000' },
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

      if (rank && days && prices[rank] && prices[rank][days]) {
         const price = prices[rank][days];
         text = `💸 Стоимость: <b>${price} $</b>`;
      }

      summaryEl.innerHTML = text;
   }

   nicknameInput.addEventListener('input', updateSummary);  // не нужно, если не показываем ник
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

      try {
         const response = await fetch('https://telegram.andreyselyankin.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, rank, duration })
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

