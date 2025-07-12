import React, { useEffect } from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  useEffect(() => {
    createParticles();
    animateStats();

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }, []);

  const createParticles = () => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
      particlesContainer.appendChild(particle);
    }
  };

  const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = target.textContent;
          let currentValue = 0;
          const increment = finalValue.includes('%') ? 5 : 200;
          const timer = setInterval(() => {
            currentValue += increment;
            if (finalValue.includes('%')) {
              target.textContent = Math.min(currentValue, parseInt(finalValue)) + '%';
            } else if (finalValue.includes('K')) {
              target.textContent = (Math.min(currentValue, parseInt(finalValue) * 1000) / 1000).toFixed(0) + 'K+';
            } else {
              target.textContent = Math.min(currentValue, parseInt(finalValue)) + '%';
            }
            if (currentValue >= parseInt(finalValue) * (finalValue.includes('K') ? 1000 : 1)) {
              clearInterval(timer);
              target.textContent = finalValue;
            }
          }, 50);
          observer.unobserve(target);
        }
      });
    });
    stats.forEach(stat => observer.observe(stat));
  };

  return (
    <>
      <div className="particles" id="particles"></div>

      <header className="headers">
        <Navbar/>
      </header>

      <section className="hero">
        <div className="hero-content mt-[20px]">
          <h1>Transform Your Productivity with AI</h1>
          <p className="hero-subtitle">Stop getting distracted. Start achieving your goals with intelligent focus management.</p>

          <div className="hero-cta">
            <button
              className="btn-hero"
              onClick={(e) => {
                const btn = e.target;
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                  btn.style.transform = 'scale(1)';
                }, 150);
              }}
            >
              🚀 Start Your Focus Journey
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <span className="feature-icon">✨</span>
              <h3 className="feature-title">AI-Powered Coaching</h3>
              <p className="feature-description">Get personalized insights and recommendations to optimize your focus and productivity patterns.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⏰</span>
              <h3 className="feature-title">Smart Time Blocking</h3>
              <p className="feature-description">Automatically schedule your tasks based on your energy levels and peak performance times.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3 className="feature-title">Habit Tracking</h3>
              <p className="feature-description">Build lasting habits with intelligent tracking and adaptive goal setting powered by AI.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚫</span>
              <h3 className="feature-title">Distraction Blocker</h3>
              <p className="feature-description">Smart blocking of distracting websites and apps during your focused work sessions.</p>
            </div>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">250%</span>
              <span className="stat-label">Productivity Increase</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">85%</span>
              <span className="stat-label">Goal Achievement</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>↓ SignUp to explore</span>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
