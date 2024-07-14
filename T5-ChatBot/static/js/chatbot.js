function sendMessage(event) {
    if (event.key == 'Enter') {
        var inputElement = document.querySelector('#to-be-sent');
        var message = inputElement.value.trim();

        if (message !== '') {
            var chatBody = document.getElementById('chat-box-body');
            var messageSentDiv = document.createElement('div');
            var span_user = document.createElement('span');
            span_user.className = 'material-symbols-outlined';
            span_user.textContent = 'person';
            messageSentDiv.className = 'chat-box-body-send';
            messageSentDiv.innerHTML = '<p>' + message + '</p>';
            messageSentDiv.appendChild(span_user);
            chatBody.appendChild(messageSentDiv);
            inputElement.value = '';

            var messageDiv = document.createElement('div');
            messageDiv.className = 'chat-box-body-receive'; 
            var paragraph = 'Thinking...';

            var span = document.createElement('span');
            span.className = 'material-symbols-outlined';
            span.textContent = 'smart_toy';

            var p = document.createElement('p');
            p.textContent = paragraph.trim();

            messageDiv.appendChild(span);
            messageDiv.appendChild(p);

            chatBody.appendChild(messageDiv);

            inputElement.value = '';


            chatBody.scrollTop = chatBody.scrollHeight;

            fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: message,
                }),
            })
            .then(response => response.json())
            .then(data => {
                chatBody.removeChild(messageDiv);

                var receivedMessageDiv = document.createElement('div');
                receivedMessageDiv.className = 'chat-box-body-receive';

                var span = document.createElement('span');
                span.className = 'material-symbols-outlined';
                span.textContent = 'smart_toy';

                var p = document.createElement('p');

                var cleanedData = data['answers'].replace('</s>', '').trim();
                p.textContent = cleanedData;

                receivedMessageDiv.appendChild(span);
                receivedMessageDiv.appendChild(p);
                chatBody.appendChild(receivedMessageDiv);

                chatBody.scrollTop = chatBody.scrollHeight;

                inputElement.value = '';
            });
        }
    }
}

function sendMessageClick() {
    var inputElement = document.querySelector('#to-be-sent');
    var message = inputElement.value.trim();

    if (message !== '') {
        var chatBody = document.getElementById('chat-box-body');
        var messageSentDiv = document.createElement('div');
        var span_user = document.createElement('span');
        span_user.className = 'material-symbols-outlined';
        span_user.textContent = 'person';
        messageSentDiv.className = 'chat-box-body-send';
        messageSentDiv.innerHTML = '<p>' + message + '</p>';
        messageSentDiv.appendChild(span_user);
        chatBody.appendChild(messageSentDiv);
        inputElement.value = '';

        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-box-body-receive'; 
        var paragraph = 'Thinking...';

        var span = document.createElement('span');
        span.className = 'material-symbols-outlined';
        span.textContent = 'smart_toy';

        var p = document.createElement('p');
        p.textContent = paragraph.trim();

        messageDiv.appendChild(span);
        messageDiv.appendChild(p);

        chatBody.appendChild(messageDiv);

        inputElement.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: message,
            }),
        })
        .then(response => response.json())
        .then(data => {
            chatBody.removeChild(messageDiv);

            var receivedMessageDiv = document.createElement('div');
            receivedMessageDiv.className = 'chat-box-body-receive';

            var span = document.createElement('span');
            span.className = 'material-symbols-outlined';
            span.textContent = 'smart_toy';

            var p = document.createElement('p');

            var cleanedData = data['answers'].replace('</s>', '').trim();
            p.textContent = cleanedData;

            receivedMessageDiv.appendChild(span);
            receivedMessageDiv.appendChild(p);
            chatBody.appendChild(receivedMessageDiv);

            chatBody.scrollTop = chatBody.scrollHeight;

            inputElement.value = '';
        });
    }
}

if (localStorage.getItem('targetedLanguage') != 'en') {

    let originalEnglishText = [];
    let translatedText = [];

    function collectInitialText() {
        originalEnglishText = [];
        document.querySelectorAll('[data-translate]').forEach(element => {
            originalEnglishText.push(element.textContent);
        });
    }
    collectInitialText();

    function translateAllElements() {
        const selectedLanguage = localStorage.getItem('targetedLanguage');
        if (selectedLanguage === 'en') {
            window.location.reload();
        }
        sessionStorage.setItem('targetedLanguage', selectedLanguage);
        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texts: originalEnglishText,
                target_lang: selectedLanguage,
            }),
        })
        .then(response => response.json())
        .then(data => {
            translatedText = data.translated_texts || [];
            document.querySelectorAll('[data-translate]').forEach((element, index) => {
                element.textContent = translatedText[index] || '';
            });
        })
        .catch(error => {
            console.error('Translation error:', error);
        });
    }
    translateAllElements();
}