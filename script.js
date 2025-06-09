// ===== PRELOADER =====
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000); // Показываем preloader минимум 1 секунду
});

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Добавляем класс reveal к элементам при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем класс reveal к секциям
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
    
    // Добавляем класс reveal к элементам внутри секций
    const revealElements = document.querySelectorAll('.datetime-item, .location-item, .gifts-content, .about-content');
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });
    
    // Запускаем проверку при загрузке
    revealOnScroll();
});

// Слушаем событие прокрутки
window.addEventListener('scroll', revealOnScroll);

// ===== FORM VALIDATION & SUBMISSION =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        
        // Проверяем обязательные поля
        if (!name) {
            showError('Пожалуйста, введите ваше имя');
            return false;
        }
        
        if (!contact) {
            showError('Пожалуйста, введите email или телефон');
            return false;
        }
        
        // Проверяем формат email или телефона
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        
        if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
            showError('Пожалуйста, введите корректный email или номер телефона');
            return false;
        }
        
        return true;
    }
    
    function submitForm() {
        const formData = new FormData(form);
        
        // Показываем индикатор загрузки
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Отправляем...';
        submitButton.disabled = true;
        
        // Отправляем форму через Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showSuccess();
                form.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        })
        .finally(() => {
            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
    
    function showSuccess() {
        hideMessages();
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    function showError(message) {
        hideMessages();
        errorMessage.querySelector('p').textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    function hideMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }
});

// ===== ЯНДЕКС.КАРТЫ =====
function initYandexMap() {
    ymaps.ready(function () {
        // Координаты ЗАГСа и ресторана (замените на реальные)
        const zagsCoords = [51.662951, 39.203001]; // Москва, Красная площадь (пример)
        const restaurantCoords = [51.689114, 39.221182]; // Москва, ГУМ (пример)
        
        // Создание карты
        const myMap = new ymaps.Map('map', {
            center: zagsCoords,
            zoom: 13,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Стиль карты
        myMap.options.set('suppressMapOpenBlock', true);
        
        // Метка ЗАГСа
        const zagsPlacemark = new ymaps.Placemark(zagsCoords, {
            balloonContent: '<strong>ЗАГС Центрального и Ленинского районов</strong><br>ул. Цветочная, д. 15<br>Время: 16:00',
            hintContent: 'ЗАГС Центрального и Ленинского районов'
        }, {
            preset: 'islands#redHeartIcon',
            iconColor: '#FF7F50'
        });

        // Метка ресторана
        const restaurantPlacemark = new ymaps.Placemark(restaurantCoords, {
            balloonContent: '<strong>Event-пространство «Купол на Крыше»</strong><br>ул. Набережная, д. 8<br>Время: 18:00',
            hintContent: 'Event-пространство «Купол на Крыше»'
        }, {
            preset: 'islands#foodIcon',
            iconColor: '#FF69B4'
        });

        // Добавление меток на карту
        myMap.geoObjects.add(zagsPlacemark);
        myMap.geoObjects.add(restaurantPlacemark);

        // Автоматическое позиционирование карты для показа всех меток
        myMap.setBounds(myMap.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 120
        });
    });
}

// Инициализация Яндекс.Карт при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, загружен ли API Яндекс.Карт
    if (typeof ymaps !== 'undefined') {
        initYandexMap();
    } else {
        // Если API еще не загружен, ждем его загрузки
        const checkYmaps = setInterval(function() {
            if (typeof ymaps !== 'undefined') {
                clearInterval(checkYmaps);
                initYandexMap();
            }
        }, 100);
        
        // Fallback если API не загрузится
        setTimeout(function() {
            if (typeof ymaps === 'undefined') {
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    mapContainer.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f0ec; color: #6b6b6b;">
                            <div style="text-align: center;">
                                <p>Карта временно недоступна</p>
                                <p style="font-size: 0.9em;">Адреса указаны в разделе выше</p>
                            </div>
                        </div>
                    `;
                }
            }
        }, 5000);
    }
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section, .reception-section');
    
    parallaxElements.forEach(element => {
        const speed = 0;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== MOBILE MENU TOGGLE (если понадобится) =====
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// ===== UTILITY FUNCTIONS =====
// Функция для анимации чисел (можно использовать для счетчиков)
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Функция для проверки видимости элемента
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle функция для оптимизации событий прокрутки
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Применяем throttle к событию прокрутки
window.addEventListener('scroll', throttle(revealOnScroll, 100));

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем поддержку клавиатурной навигации
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && element.tagName === 'A') {
                element.click();
            }
        });
    });
    
    // Улучшаем доступность формы
    const form = document.getElementById('rsvp-form');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', function() {
                this.setAttribute('aria-invalid', 'true');
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.removeAttribute('aria-invalid');
                }
            });
        });
    }
});

console.log('Wedding invitation script loaded successfully! 💒💕');


// ===== ENHANCED MODAL FUNCTIONALITY =====
function createModal(title, content) {
    // Удаляем существующий модал если есть
    const existingModal = document.getElementById('dynamic-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем новый модал
    const modal = document.createElement('div');
    modal.id = 'dynamic-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>${title}</h2>
            <div class="modal-body">${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Показываем модал
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Обработчики закрытия
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => closeModal(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    };
    
    // Закрытие по ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeModal(modal) {
    modal.style.animation = 'modalFadeOut 0.3s ease';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = 'auto';
    }, 300);
}

// ===== ENHANCED PHOTO GALLERY =====
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем клики на фотографии для увеличения
    const photos = document.querySelectorAll('.about-photo, .memory-photo');
    photos.forEach(photo => {
        photo.style.cursor = 'pointer';
        photo.addEventListener('click', function() {
            const title = this.alt || 'Фотография';
            const content = `<img src="${this.src}" alt="${title}" style="width: 100%; border-radius: 10px;">`;
            createModal(title, content);
        });
    });
    
    // Улучшенная анимация появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми анимируемыми элементами
    const animatedElements = document.querySelectorAll(
        '.photo-item, .memory-item, .timeline-item, .datetime-item, .location-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== ENHANCED TIMELINE ANIMATION =====
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('reveal');
        }, index * 200);
    });
}

// ===== ENHANCED SCROLL EFFECTS =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Параллакс для hero секции
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.transform = `translateY(${rate}px)`;
    }
    
    // Анимация появления timeline при прокрутке
    const programSection = document.querySelector('.program-section');
    if (programSection) {
        const rect = programSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const timelineItems = programSection.querySelectorAll('.timeline-item:not(.reveal)');
            if (timelineItems.length > 0) {
                animateTimeline();
            }
        }
    }
});

// ===== ENHANCED FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показываем индикатор загрузки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            // Отправляем форму
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showSuccess('Спасибо! Мы получили ваш ответ.');
                    form.reset();
                } else {
                    throw new Error('Ошибка отправки');
                }
            }).catch(error => {
                showError('Произошла ошибка. Попробуйте еще раз.');
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    function showSuccess(message) {
        createModal('Успешно!', `<p style="color: #4CAF50; text-align: center; font-size: 1.1rem;">${message}</p>`);
    }
    
    function showError(message) {
        createModal('Ошибка', `<p style="color: #f44336; text-align: center; font-size: 1.1rem;">${message}</p>`);
    }
});

// ===== ENHANCED NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для всех якорных ссылок
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Учитываем высоту навигации
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

console.log('Enhanced wedding invitation features loaded! 💒✨');


// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const weddingDate = new Date('2025-08-01T13:50:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<div class="countdown-finished">Мы поженились! 💕</div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    // Обновляем каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== ADD TO CALENDAR =====
function addToCalendar() {
    const event = {
        title: 'Свадьба Влада и Яны',
        start: '20250801T135000',
        end: '20250801T220000',
        description: 'Церемония бракосочетания и банкет',
        location: 'ЗАГС Центрального района, ул. Площадь Ленина, д. 11'
    };
    
    // Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    // Outlook URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.start}&enddt=${event.end}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    // Создаем модальное окно с выбором календаря
    const modal = document.createElement('div');
    modal.className = 'calendar-modal';
    modal.innerHTML = `
        <div class="calendar-modal-content">
            <h3>Выберите календарь</h3>
            <div class="calendar-options">
                <a href="${googleUrl}" target="_blank" class="calendar-option">
                    📅 Google Calendar
                </a>
                <a href="${outlookUrl}" target="_blank" class="calendar-option">
                    📅 Outlook
                </a>
                <button onclick="downloadICS()" class="calendar-option">
                    📅 Скачать .ics файл
                </button>
            </div>
            <button onclick="closeCalendarModal()" class="close-modal">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function downloadICS() {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Wedding Invitation//EN
BEGIN:VEVENT
UID:wedding-vlad-yana-2025@example.com
DTSTAMP:20250609T120000Z
DTSTART:20250801T135000
DTEND:20250801T220000
SUMMARY:Свадьба Влада и Яны
DESCRIPTION:Церемония бракосочетания и банкет
LOCATION:ЗАГС Центрального района, ул. Площадь Ленина, д. 11
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-vlad-yana.ics';
    a.click();
    window.URL.revokeObjectURL(url);
    closeCalendarModal();
}

function closeCalendarModal() {
    const modal = document.querySelector('.calendar-modal');
    if (modal) {
        modal.remove();
    }
}

// Инициализируем countdown при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
});


// ===== FAQ FUNCTIONALITY =====
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    
    // Закрываем все остальные FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
        }
    });
    
    // Переключаем текущий FAQ
    faqItem.classList.toggle('active');
    answer.classList.toggle('active');
}


// ===== WEATHER FUNCTIONALITY =====
async function loadWeather() {
    const weatherLoading = document.getElementById('weather-loading');
    const weatherData = document.getElementById('weather-data');
    const weatherError = document.getElementById('weather-error');
    
    try {
        // Координаты Воронежа
        const lat = 51.672;   // Широта Воронежа
        const lon = 39.1843;  // Долгота Воронежа
        
        // OpenWeatherMap API с вашим ключом
        const apiKey = 'aaf1164d43eba6e486965e09371df25c';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather API error');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        console.error('Weather loading error:', error);
        showDemoWeather(); // Показываем демо данные при ошибке
    }
}

function showDemoWeather() {
    // Демо данные для показа функциональности
    const demoData = {
        main: {
            temp: 22,
            feels_like: 24,
            humidity: 65,
            pressure: 1013
        },
        weather: [{
            main: 'Clear',
            description: 'ясно',
            icon: '01d'
        }],
        wind: {
            speed: 3.2
        }
    };
    
    displayWeather(demoData, true);
}

function displayWeather(data, isDemo = false) {
    const weatherLoading = document.getElementById('weather-loading');
    const weatherData = document.getElementById('weather-data');
    
    // Скрываем загрузку, показываем данные
    weatherLoading.style.display = 'none';
    weatherData.style.display = 'block';
    
    // Заполняем данные
    document.getElementById('weather-temp').textContent = Math.round(data.main.temp);
    document.getElementById('weather-desc').textContent = data.weather[0].description;
    document.getElementById('feels-like').textContent = Math.round(data.main.feels_like) + '°C';
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('wind').textContent = data.wind.speed + ' м/с';
    document.getElementById('pressure').textContent = Math.round(data.main.pressure * 0.75) + ' мм рт.ст.';
    
    // Устанавливаем иконку погоды
    const weatherIcon = document.getElementById('weather-icon');
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Mist': '🌫️',
        'Fog': '🌫️'
    };
    weatherIcon.textContent = iconMap[data.weather[0].main] || '🌤️';
    
    // Генерируем рекомендации по одежде
    generateClothingAdvice(data.main.temp, data.weather[0].main);
    
    if (isDemo) {
        // Добавляем пометку о демо данных
        const demoNote = document.createElement('div');
        demoNote.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(255, 193, 7, 0.2); border-radius: 8px; font-size: 0.9rem; color: #856404;';
        demoNote.innerHTML = '📝 Демо данные. Для получения актуального прогноза настройте API ключ.';
        weatherData.appendChild(demoNote);
    }
}

function generateClothingAdvice(temp, condition) {
    const adviceElement = document.getElementById('clothing-advice');
    let advice = '';
    
    if (temp < 0) {
        advice = 'Очень холодно! Теплая зимняя одежда, шапка, перчатки, теплая обувь.';
    } else if (temp < 10) {
        advice = 'Прохладно. Куртка или пальто, закрытая обувь, возможно шарф.';
    } else if (temp < 20) {
        advice = 'Умеренно тепло. Легкая куртка или кардиган, удобная обувь.';
    } else if (temp < 25) {
        advice = 'Комфортная температура. Легкая одежда, можно без куртки.';
    } else {
        advice = 'Тепло! Легкая летняя одежда, солнцезащитные очки.';
    }
    
    // Добавляем рекомендации по погодным условиям
    if (condition === 'Rain' || condition === 'Drizzle') {
        advice += ' Не забудьте зонт и непромокаемую обувь!';
    } else if (condition === 'Snow') {
        advice += ' Осторожно, возможна скользкая дорога!';
    } else if (condition === 'Clear' && temp > 20) {
        advice += ' Отличная погода для фотосессии на улице!';
    }
    
    adviceElement.textContent = advice;
}

// Инициализируем погоду при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем погоду с небольшой задержкой для лучшего UX
    setTimeout(loadWeather, 1000);
});


// ===== GUEST PHOTOS FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initPhotoUpload();
    initGuestGallery();
});

function initPhotoUpload() {
    const uploadArea = document.getElementById('upload-area');
    const photoInput = document.getElementById('photo-input');
    const uploadProgress = document.getElementById('upload-progress');
    const uploadSuccess = document.getElementById('upload-success');
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });
    
    // File input change
    photoInput.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFileUpload(files);
    });
    
    // Click to upload
    uploadArea.addEventListener('click', function() {
        photoInput.click();
    });
}

function handleFileUpload(files) {
    if (files.length === 0) return;
    
    // Валидация файлов
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
    
    for (let file of files) {
        if (file.size > maxSize) {
            alert(`Файл ${file.name} слишком большой. Максимальный размер: 10MB`);
            continue;
        }
        
        if (!allowedTypes.includes(file.type)) {
            alert(`Файл ${file.name} имеет неподдерживаемый формат. Разрешены: JPG, PNG, HEIC`);
            continue;
        }
        
        validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
        alert('Не выбрано ни одного подходящего файла');
        return;
    }
    
    // Симуляция загрузки (в реальном проекте здесь будет отправка на сервер)
    simulateUpload(validFiles);
}

function simulateUpload(files) {
    const uploadArea = document.getElementById('upload-area');
    const uploadProgress = document.getElementById('upload-progress');
    const uploadSuccess = document.getElementById('upload-success');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Показываем прогресс
    uploadArea.style.display = 'none';
    uploadProgress.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Загружаем фотографии... ${Math.round(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                uploadSuccess.style.display = 'block';
                
                // Добавляем фотографии в галерею (демо)
                addPhotosToGallery(files);
                
                // Возвращаем форму через 3 секунды
                setTimeout(() => {
                    uploadSuccess.style.display = 'none';
                    uploadArea.style.display = 'block';
                    progressFill.style.width = '0%';
                    document.getElementById('photo-input').value = '';
                }, 3000);
            }, 500);
        }
    }, 200);
}

function addPhotosToGallery(files) {
    const grid = document.getElementById('guest-photos-grid');
    const placeholder = grid.querySelector('.add-photo-placeholder');
    
    // Удаляем placeholder если это первые фото
    if (placeholder && grid.children.length <= 4) {
        placeholder.remove();
    }
    
    // Добавляем новые фотографии (демо - используем URL.createObjectURL)
    Array.from(files).forEach((file, index) => {
        setTimeout(() => {
            const photoItem = document.createElement('div');
            photoItem.className = 'guest-photo-item';
            
            const img = document.createElement('img');
            img.className = 'guest-photo';
            img.src = URL.createObjectURL(file);
            img.alt = 'Фото от гостя';
            
            const author = document.createElement('div');
            author.className = 'photo-author';
            author.textContent = 'От: Вы';
            
            photoItem.appendChild(img);
            photoItem.appendChild(author);
            
            // Добавляем обработчик клика для просмотра
            photoItem.addEventListener('click', () => openPhotoModal(img.src));
            
            grid.appendChild(photoItem);
            
            // Анимация появления
            photoItem.style.opacity = '0';
            photoItem.style.transform = 'translateY(20px)';
            setTimeout(() => {
                photoItem.style.transition = 'all 0.5s ease';
                photoItem.style.opacity = '1';
                photoItem.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

function initGuestGallery() {
    // Добавляем обработчики клика для существующих фотографий
    const existingPhotos = document.querySelectorAll('.guest-photo-item');
    existingPhotos.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.guest-photo');
            if (img) {
                openPhotoModal(img.src);
            }
        });
    });
}

function openPhotoModal(imageSrc) {
    // Создаем модальное окно для просмотра фотографии
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="photo-modal-content">
            <span class="photo-modal-close">&times;</span>
            <img src="${imageSrc}" alt="Фото от гостя" class="modal-photo">
            <div class="photo-modal-actions">
                <button onclick="downloadPhoto('${imageSrc}')" class="download-btn">
                    💾 Скачать
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Обработчики закрытия
    modal.querySelector('.photo-modal-close').onclick = () => closePhotoModal(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closePhotoModal(modal);
    };
    
    // Закрытие по ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closePhotoModal(modal);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closePhotoModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

function downloadPhoto(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'wedding-photo-' + Date.now() + '.jpg';
    link.click();
}

