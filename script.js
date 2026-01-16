// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// 活动导航链接高亮
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// 切换答案显示
function toggleAnswer(button) {
    const answerContent = button.nextElementSibling;
    answerContent.classList.toggle('show');
    
    if (answerContent.classList.contains('show')) {
        button.textContent = '隐藏答案';
    } else {
        button.textContent = '查看答案';
    }
}

// 代码块复制功能
document.querySelectorAll('.code-block').forEach(block => {
    block.style.position = 'relative';
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '复制';
    copyBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    `;
    
    copyBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    copyBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    copyBtn.addEventListener('click', function() {
        const code = block.querySelector('pre').textContent;
        navigator.clipboard.writeText(code).then(() => {
            this.textContent = '已复制!';
            setTimeout(() => {
                this.textContent = '复制';
            }, 2000);
        });
    });
    
    block.appendChild(copyBtn);
});

// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// 移动端导航菜单切换
const navbar = document.querySelector('.navbar');
const container = navbar.querySelector('.container');

// 添加移动端菜单按钮
const menuBtn = document.createElement('button');
menuBtn.innerHTML = '☰';
menuBtn.style.cssText = `
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
`;

// 响应式菜单
function checkWidth() {
    if (window.innerWidth <= 768) {
        menuBtn.style.display = 'block';
        if (!navbar.contains(menuBtn)) {
            navbar.querySelector('.container').insertBefore(menuBtn, navbar.querySelector('.nav-links'));
        }
    } else {
        menuBtn.style.display = 'none';
        document.querySelector('.nav-links').style.display = 'flex';
    }
}

checkWidth();
window.addEventListener('resize', checkWidth);

menuBtn.addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = '#3776ab';
        navLinks.style.padding = '1rem';
        navLinks.style.zIndex = '999';
    }
});

// 进度追踪
function createProgressTracker() {
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        max-width: 250px;
    `;
    
    const progressTitle = document.createElement('div');
    progressTitle.textContent = '学习进度';
    progressTitle.style.fontWeight = 'bold';
    progressTitle.style.marginBottom = '10px';
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        background: rgba(255, 255, 255, 0.3);
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        background: var(--secondary-color);
        height: 100%;
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    const progressText = document.createElement('div');
    progressText.textContent = '0% 完成';
    progressText.style.fontSize = '12px';
    progressText.style.marginTop = '5px';
    
    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressTitle);
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    document.body.appendChild(progressContainer);
    
    // 追踪已查看的答案
    let answeredQuestions = 0;
    const totalQuestions = document.querySelectorAll('.exercise-card').length;
    
    document.querySelectorAll('.answer-toggle button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '隐藏答案') {
                answeredQuestions++;
                const percentage = Math.round((answeredQuestions / totalQuestions) * 100);
                progressFill.style.width = percentage + '%';
                progressText.textContent = percentage + '% 完成';
            }
        });
    });
}

createProgressTracker();

console.log('🐍 Python学习网站已加载完成！');
console.log('祝你在NOAI竞赛中取得好成绩！');