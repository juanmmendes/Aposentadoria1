// Configurações de animação
const ANIMATION_CONFIG = {
    duration: 0.6,
    stagger: 0.1,
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
};

document.addEventListener('DOMContentLoaded', function() {
    // Animação inicial de carregamento da página
    animatePageLoad();
    
    // Inicialização de funcionalidades
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeContactForm();
    initializeHeaderEffects();
    initializeInputMasks();
    initializeCardHoverEffects();
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        let isTransitioning = false;
        
        mobileMenuToggle.addEventListener('click', function() {
            if (isTransitioning) return;
            
            isTransitioning = true;
            mobileMenuToggle.classList.toggle('active');
            
            if (!nav.classList.contains('active')) {
                nav.style.display = 'block';
                setTimeout(() => {
                    nav.classList.add('active');
                }, 10);
            } else {
                nav.classList.remove('active');
                setTimeout(() => {
                    nav.style.display = 'none';
                }, 300); // Tempo igual à transição CSS
            }
            
            setTimeout(() => {
                isTransitioning = false;
            }, 300);
        });
    }
    
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('.nav-link, .hero-cta, .cta-button');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Fechar menu mobile se estiver aberto
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            
            if (!nome || !email || !telefone) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Coleta dos dados do formulário
            const formData = {
                nome: nome,
                email: email,
                telefone: telefone,
                idade: document.getElementById('idade').value,
                tempoContribuicao: document.getElementById('tempo-contribuicao').value,
                situacao: document.getElementById('situacao').value
            };
            
            // Simular envio (em produção, seria enviado para um servidor)
            console.log('Dados do formulário:', formData);
            
            // Feedback para o usuário
            alert('Obrigado pelo seu contato! Em breve entraremos em contato com você.');
            
            // Limpar formulário
            contactForm.reset();
        });
    }
    
    // Animação de entrada dos elementos ao fazer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação com entrada suave
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .about-content, .rule-card, .benefit-item, .contact-info, .ethics-content'
    );
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Header background change on scroll com transição suave
    const header = document.querySelector('.header');
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            const scrollRatio = Math.min(window.scrollY / 200, 1);
            const opacity = 0.95 + (0.05 * (1 - scrollRatio));
            
            header.style.backgroundColor = `rgba(28, 46, 74, ${opacity})`;
            header.style.backdropFilter = window.scrollY > 50 ? 'blur(10px)' : 'none';
            header.style.transition = 'background-color 0.3s ease, backdrop-filter 0.3s ease';
        });
    });
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Validação de idade
    const idadeInput = document.getElementById('idade');
    if (idadeInput) {
        idadeInput.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (value < 18 || value > 100) {
                e.target.setCustomValidity('A idade deve estar entre 18 e 100 anos.');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }
});

// Função para abrir WhatsApp com mensagem pré-definida
function openWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre aposentadoria por tempo de contribuição.');
    const whatsappUrl = `https://wa.me/5519974100605?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Adicionar evento de clique para links do WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappLinks = document.querySelectorAll('.whatsapp-link');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    });
});

